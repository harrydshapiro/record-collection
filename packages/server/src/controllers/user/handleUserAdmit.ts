import Express from "express";

import { userRepository } from "orm/repositories/user.repository";
import { sendMessageToPhoneNumber } from "utils/phone";
import { createSpotifyPlaylist } from "utils/spotify";

export default async function handleUserAdmit(
  request: Express.Request<{ phoneNumber: string }>,
  response: Express.Response,
) {
  const phoneNumber = request.params.phoneNumber;
  const user = await userRepository.findOne({
    where: { phoneNumber, active: false },
  });
  if (user) {
    user.active = true;
    await userRepository.save(user);
    try {
      await createSpotifyPlaylist(
        `hausmate | ${user.firstName} ${user.lastName}`,
      );
    } catch (err) {
      console.error("Error creating user playlist", err);
    }
    void sendMessageToPhoneNumber(
      `Welcome to song.haus! You’ve been admitted off the wait list.
            
        You’ll be texted a playlist prompt once every couple of days. All you gotta do is go find a song that matches on Spotify, and text a link to it back! There are never any wrong answers, but please put some love and vibe-consciousness into your recommendations.
            
        For all you #visual_learners, there’s a how-to video in the highlights on our IG page: @song.haus
            
        To unsubscribe at any time (our feelings won’t be hurt, promise), you can just text us here saying so. No special “STOP” word is necessary… we’re humans, you can just say you wanna dip out 😎
            
        If you have any questions, text us at this number or email songhausapp@gmail.com.
            
        PS - Wanna see every submission ever? Check this playlist out: https://open.spotify.com/playlist/7tSOhMZxJRbqBgVMMUzxnR.
            
        <3 song.haus <3`,
      phoneNumber,
    );
    response.sendStatus(201);
  } else {
    response.sendStatus(404);
  }
}
