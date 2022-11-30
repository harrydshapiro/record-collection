import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromNumber = process.env.FROM_NUMBER;

const twilioClient = twilio(accountSid, authToken);

export async function sendMessageToPhoneNumber(body: string, phoneNumber: string) {
    console.log('About to send message to phone number', { body, phoneNumber });
    try {
        await twilioClient.messages.create({ body, from: fromNumber, to: phoneNumber });
    } catch (err) {
        console.error('Error attempting to send message', { body, phoneNumber, err });
    }
}
