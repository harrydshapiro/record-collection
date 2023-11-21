import { IsNull, LessThanOrEqual } from 'typeorm';

import { AppDataSource } from 'orm/DataSource';
import { SubmissionRequest } from 'orm/entities/SubmissionRequest';

const submissionRequestRepository = AppDataSource.getRepository(SubmissionRequest);

export function getCurrentSubmissionRequest() {
    return submissionRequestRepository.findOne({
        where: {
            isActive: true,
        },
        order: {
            requestedAt: 'DESC',
        },
        relations: ['playlist'],
    });
}

export async function getSubmissionRequestToSend() {
    console.log('Getting unsent daily submission request');
    const mostRecentRecord = await submissionRequestRepository.findOne({
        order: {
            scheduledFor: 'DESC',
        },
    });
    console.log("most recent", { mostRecentRecord })
    const result = await submissionRequestRepository.findOne({
        where: {
            requestedAt: IsNull(),
            scheduledFor: LessThanOrEqual(new Date()),
            isActive: false,
        },
    });
    console.log('result of getSubmissionRequestToSend', { result })
    return result
}

export async function turnOffSubmissionRequest(submissionRequest: SubmissionRequest) {
    console.log('Turning off daily submission request');
    await submissionRequestRepository.save({
        ...submissionRequest,
        isActive: false,
    });
}

export async function turnOnSubmissionRequest(submissionRequest: SubmissionRequest) {
    await submissionRequestRepository.save({
        ...submissionRequest,
        isActive: true,
        requestedAt: new Date(),
    });
}
