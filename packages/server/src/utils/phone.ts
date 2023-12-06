import Bottleneck from "bottleneck";
import twilio from "twilio";
import { MessageListInstanceCreateOptions } from "twilio/lib/rest/api/v2010/account/message";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromNumber = process.env.FROM_NUMBER;

const twilioClient = twilio(accountSid, authToken);

const smsLimiter = new Bottleneck({
  maxConcurrent: 1,
  minTime: 1500,
});

export function sendMessageToPhoneNumber(
  body: string,
  phoneNumber: string,
  mediaUrl?: string,
) {
  return smsLimiter.schedule(async () => {
    console.log("About to send message to phone number", {
      body,
      phoneNumber,
      mediaUrl,
    });
    try {
      const messageConfig: MessageListInstanceCreateOptions = {
        body,
        from: fromNumber,
        to: phoneNumber,
      };
      if (mediaUrl) {
        messageConfig.mediaUrl = mediaUrl;
      }
      await twilioClient.messages.create(messageConfig);
    } catch (err) {
      console.error("Error attempting to send message", {
        body,
        phoneNumber,
        err,
      });
    }
  });
}
