import {
    getCurrentSubmissionRequest,
    getSubmissionRequestToSend,
    turnOffSubmissionRequest,
    turnOnSubmissionRequest,
} from 'orm/repositories/submissionRequest.repository';
import { userRepository } from 'orm/repositories/user.repository';
import { sendMessageToPhoneNumber } from 'utils/phone';

async function executeSubmissionRequest() {
    console.log('Running executeSubmissionRequest', Date.now());

    const requestToSend = await getSubmissionRequestToSend();

    if (!requestToSend) {
        return;
    }

    const currentRequest = await getCurrentSubmissionRequest();
    if (currentRequest) {
        await turnOffSubmissionRequest(currentRequest);
    }
    await turnOnSubmissionRequest(requestToSend);
    const users = await userRepository.find({ where: { active: true } });
    const requestText = requestToSend.requestText;

    users.forEach(async (user) => {
        const body = `${user.firstName} !!! it's time :)\n\n${requestText}`;
        const result = await sendMessageToPhoneNumber(body, user.phoneNumber);
        return result;
    });
}

export function startCron() {
    executeSubmissionRequest();
    setInterval(executeSubmissionRequest, 1000 * 60);
}
