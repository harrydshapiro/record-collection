import Express from 'express';

import { userRepository } from 'orm/repositories/user.repository';
import { sendMessageToPhoneNumber } from 'utils/phone';
import { createSpotifyPlaylist } from 'utils/spotify';

export default async function userSignupController(request: Express.Request, response: Express.Response) {
    sendMessageToPhoneNumber(`New user submission: ${JSON.stringify(request.body)}`, '+19176475261');

    const { firstName, lastName, phone, email, spotifyProfile } = request.body;

    if (!firstName || !lastName || !phone || !spotifyProfile) {
        response.sendStatus(404);
        return;
    }

    const spotifyUri = new URL(spotifyProfile).pathname.split('/')[2];

    await userRepository.insert({
        firstName,
        lastName,
        spotifyUri,
        phoneNumber: phone,
        active: false,
    });

    try {
        await createSpotifyPlaylist(`hausmate | ${firstName} ${lastName}`);
    } catch (err) {
        console.error('Error creating user playlist', err);
    }

    sendMessageToPhoneNumber('hey pal - ur on the list. expect a text from this # soon...', phone);

    response.sendStatus(201)
}
