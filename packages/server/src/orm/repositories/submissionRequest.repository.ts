import { IsNull, LessThanOrEqual } from 'typeorm';

import { AppDataSource } from 'src/orm/DataSource';
import { SubmissionRequest } from 'src/orm/entities/SubmissionRequest';

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

export function getSubmissionRequestToSend() {
    return submissionRequestRepository.findOne({
        where: {
            requestedAt: IsNull(),
            scheduledFor: LessThanOrEqual(new Date()),
            isActive: false,
        },
    });
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
