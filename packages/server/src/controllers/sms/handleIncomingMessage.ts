import { twiml } from "twilio";
import { Request, Response } from "express";

import { messageRepository } from "orm/repositories/message.repository";
import { getCurrentSubmissionRequest } from "orm/repositories/submissionRequest.repository";
import { userRepository } from "orm/repositories/user.repository";
import { sendMessageToPhoneNumber } from "utils/phone";
import {
  addSongToPlaylist,
  ZEITGEIST_URI,
  getPlaylistShareLink,
  persistTrackDataAndRelationsToDb,
} from "utils/spotify";
import { addSubmittedTrack } from "orm/repositories/submittedTrack.repository";

const MINIMUM_SUBMISSIONS_BEFORE_SENDING_PLAYLIST = 5;

export default async function handleIncomingMessage(
  req: Request,
  res: Response,
) {
  const twimlResponse = new twiml.MessagingResponse();
  const requestBody = req.body as { Body: string; From: string };
  const messageBody = requestBody.Body;
  const senderPhoneNumber = requestBody.From;

  if (
    messageBody?.indexOf('Laughed at "') === 0 ||
    messageBody?.indexOf('Loved "') === 0 ||
    messageBody?.indexOf('Liked "') === 0 ||
    messageBody?.indexOf('Disliked "') === 0 ||
    messageBody?.indexOf('Emphasized "') === 0
  ) {
    res.sendStatus(201);
    return;
  }

  const user = await userRepository.findOneOrFail({
    relations: ["personalPlaylist"],
    where: {
      phoneNumber: senderPhoneNumber,
    },
  });

  const currentSubmissionRequest = await getCurrentSubmissionRequest();

  try {
    await messageRepository.insert({
      user,
      body: messageBody,
      submissionRequest: currentSubmissionRequest || undefined,
    });
  } catch (err) {
    console.error("Error attempting to insert into messages", err);
  }

  if (!currentSubmissionRequest?.type) {
    twimlResponse.message("song.haus is on vacation :-)\n\nc u l8r");
    // eslint-disable-next-line @typescript-eslint/no-base-to-string
    res.type("text/xml").send(twiml.toString());
    return;
  }

  if (currentSubmissionRequest.type === "playlist") {
    console.log("incoming message", { messageBody, senderPhoneNumber });

    const bodyIsSongLink =
      messageBody?.indexOf("https://open.spotify.com/track/") === 0;

    let songUri: string | undefined;
    try {
      songUri = new URL(messageBody).pathname.split("/").pop();
    } catch (err) {
      console.error("Error generating song uri");
      console.error(err);
    }

    if (!bodyIsSongLink || !songUri) {
      await sendMessageToPhoneNumber(
        `Received non-song text to songhaus. You might need to respond to the user.\nSender:\n${senderPhoneNumber}.\nMessage:\n${messageBody}`,
        "+19176475261",
      );
      return;
    }

    const dailyPlaylistUri = currentSubmissionRequest.playlist?.uri;

    await Promise.allSettled([
      addSongToPlaylist(songUri, dailyPlaylistUri),
      addSongToPlaylist(songUri, user.personalPlaylist?.uri),
      addSongToPlaylist(songUri, ZEITGEIST_URI),
    ]);

    await persistTrackDataAndRelationsToDb(songUri)
      .then(async ({ track, trackPopularity }) => {
        return addSubmittedTrack({
          trackId: track.id,
          submissionRequestId: currentSubmissionRequest.id,
          userId: user.id,
          popularityAtSubmissionTime: trackPopularity,
        });
      })
      .catch((err) => {
        console.error(
          "Error attempting to persist track data that was submitted to the DB",
        );
        console.error(err);
      });

    const previousSubmittedTracks = currentSubmissionRequest.submissions;
    const dailyPlaylistShareMessage = `${
      currentSubmissionRequest.submissionResponse
    }\n\nYou can find today's playlist here: ${getPlaylistShareLink(
      dailyPlaylistUri,
    )}`;
    const dailyPlaylistWaitMessage = `${currentSubmissionRequest.submissionResponse}\n\nYou're one of the first submitters. We'll hyu when there's a critical mass of submissions ;)`;
    const zeitgeistShareMessage = `thanks! there's no playlist for today, but your song was added to The Zeitgeist, our running list of all submissions: ${getPlaylistShareLink(
      ZEITGEIST_URI,
    )}`;
    const responseText = dailyPlaylistUri
      ? previousSubmittedTracks.length >=
        MINIMUM_SUBMISSIONS_BEFORE_SENDING_PLAYLIST
        ? dailyPlaylistShareMessage
        : dailyPlaylistWaitMessage
      : zeitgeistShareMessage;
    twimlResponse.message(responseText);
    console.log("Determined response text", {
      responseText,
      previousSubmittedTracksCount: previousSubmittedTracks.length,
    });
    if (
      previousSubmittedTracks.length ===
      MINIMUM_SUBMISSIONS_BEFORE_SENDING_PLAYLIST
    ) {
      const allPreviousSubmitors = previousSubmittedTracks.reduce(
        (acc: string[], curr) => {
          if (
            curr.user.phoneNumber !== senderPhoneNumber &&
            !acc.includes(curr.user.phoneNumber)
          ) {
            acc.push(curr.user.phoneNumber);
          }
          return acc;
        },
        [],
      );
      console.log("Previous submittors to send to", allPreviousSubmitors);
      void Promise.allSettled(
        allPreviousSubmitors.map((phoneNumber) =>
          sendMessageToPhoneNumber(
            `You can find today's playlist here: ${getPlaylistShareLink(
              dailyPlaylistUri,
            )}`,
            phoneNumber,
          ).catch((e) => {
            console.error(
              "There was an error sending a playlist to an early submittor",
            );
            console.error(e);
          }),
        ),
      );
    }

    res.type("text/xml").send(twimlResponse.toString());
    return;
  } else if (currentSubmissionRequest.type === "prompt") {
    // const responsesFromUserThatDay = await query(`
    //     SELECT
    //         messages.*
    //     FROM
    //         messages
    //     INNER JOIN
    //         users
    //     ON
    //         messages.user_id = users.id
    //     INNER JOIN
    //         submission_requests
    //     ON
    //         submission_requests.id = messages.submission_request_id
    //     WHERE
    //         users.phone_number = '${senderPhoneNumber}'
    //         AND submission_requests.is_active = TRUE
    // `);

    // if (responsesFromUserThatDay.length === 1) {
    //     twimlResponse.message(
    //         `thanks!! harry'll prob be in touch 2 chat more about that. (please keep sending more ideas, im just a robot who cant pick up on social cues so idk when ull be done hehehe). here's the playlist: https://open.spotify.com/playlist/6b9dhtq59hLjiJfec58wCW?si=87e43713c1ac410b`,
    //     );

    //     res.type('text/xml').send(twiml.toString());
    // }

    return;
  } else {
    console.error("unrecognized request type", currentSubmissionRequest.type);
    res.sendStatus(500);
  }
}
