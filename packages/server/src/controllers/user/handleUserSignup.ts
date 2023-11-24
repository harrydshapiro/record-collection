import Express from "express";
import { parsePhoneNumber } from "libphonenumber-js";

import { userRepository } from "orm/repositories/user.repository";
import { sendMessageToPhoneNumber } from "utils/phone";

export default async function handleUserSignup(
  request: Express.Request,
  response: Express.Response
) {
  const { firstName, lastName, phone, email, spotifyProfile } = request.body;
  if (!firstName || !lastName || !phone || !spotifyProfile) {
    console.error('Missing required fields from signup', { firstName, lastName, phone, email, spotifyProfile })
    response.sendStatus(404);
    return;
  }

  const formattedPhone = parsePhoneNumber(phone, 'US').format('E.164')

  sendMessageToPhoneNumber("Thanks for signing up for song.haus! You can opt-out at any time by replying STOP.", formattedPhone)

  sendMessageToPhoneNumber(
    `New user submission: ${JSON.stringify(request.body)}`,
    "+19176475261"
  );

  const spotifyUri = new URL(spotifyProfile).pathname.split("/")[2];

  await userRepository.insert({
    firstName,
    lastName,
    spotifyUri,
    phoneNumber: formattedPhone,
    active: false,
  });

  response.sendStatus(201);
}
