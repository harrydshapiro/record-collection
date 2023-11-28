import {
    getCurrentSubmissionRequest,
    getSubmissionRequestToSend,
    turnOffSubmissionRequest,
    turnOnSubmissionRequest,
} from 'orm/repositories/submissionRequest.repository';
import { userRepository } from 'orm/repositories/user.repository';
import { sendMessageToPhoneNumber } from 'utils/phone';

async function executeSubmissionRequest() {
    const requestToSend = await getSubmissionRequestToSend();

    if (!requestToSend) {
        return;
    }

    console.log("Found submission request to send", { requestToSend })

    const currentRequest = await getCurrentSubmissionRequest();
    if (currentRequest) {
        await turnOffSubmissionRequest(currentRequest);
    }
    await turnOnSubmissionRequest(requestToSend);
    const users = await userRepository.find({ where: { phoneNumber: "+19176475261" } });
    const requestText = requestToSend.requestText;

    users.forEach(async (user) => {
        const body = `${user.firstName} !!! it's time :)\n\n${requestText}`;
        sendMessageToPhoneNumber(body, user.phoneNumber);
    });
}

export function startCron() {
    executeSubmissionRequest();
    setInterval(executeSubmissionRequest, 1000 * 60);
}
