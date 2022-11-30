import { twiml } from 'twilio';

import { messageRepository } from 'orm/repositories/message.repository';
import { getCurrentSubmissionRequest } from 'orm/repositories/submissionRequest.repository';
import { userRepository } from 'orm/repositories/user.repository';
import { sendMessageToPhoneNumber } from 'utils/phone';
import { addSongToPlaylist, ZEITGEIST_URI, getPlaylistShareLink } from 'utils/spotify';

export default async function handleIncomingMessage(req: any, res: any) {
    const twimlResponse = new twiml.MessagingResponse();
    const { Body: messageBody, From: senderPhoneNumber } = req.body;

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
        relations: ['personalPlaylist'],
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
        console.error('Error attempting to insert into messages', err);
    }

    if (!currentSubmissionRequest?.type) {
        twimlResponse.message('song.haus is on vacation :-)\n\nc u l8r');
        res.type('text/xml').send(twiml.toString());
        return;
    }

    if (currentSubmissionRequest.type === 'playlist') {
        console.log('incoming message', { messageBody, senderPhoneNumber });

        const bodyIsSongLink = messageBody?.indexOf('https://open.spotify.com/track/') === 0;

        let songUri: string | undefined;
        try {
            songUri = new URL(messageBody).pathname.split('/').pop();
        } catch (err) {}

        if (!bodyIsSongLink || !songUri) {
            await sendMessageToPhoneNumber(
                JSON.stringify({
                    senderPhoneNumber,
                    messageBody,
                }),
                '+19176475261',
            );
            return;
        }

        const dailyPlaylistUri = currentSubmissionRequest.playlist?.uri;

        const results = await Promise.allSettled([
            addSongToPlaylist(songUri, dailyPlaylistUri),
            addSongToPlaylist(songUri, user.personalPlaylist?.uri),
            addSongToPlaylist(songUri, ZEITGEIST_URI),
        ]);

        console.log('results from incoming sms', results);

        if (dailyPlaylistUri) {
            twimlResponse.message(
                `${
                    currentSubmissionRequest.submissionResponse
                }\n\nYou can find today's playlist here: ${getPlaylistShareLink(dailyPlaylistUri)}`,
            );
        } else {
            twimlResponse.message(
                "thanks! there's no playlist for today, but your song was added to The Zeitgeist, our running list of all submissions",
            );
        }

        res.type('text/xml').send(twimlResponse.toString());
        return;
    } else if (currentSubmissionRequest.type === 'prompt') {
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
        console.error('unrecognized request type', currentSubmissionRequest.type);
        res.sendStatus(500);
    }
}
