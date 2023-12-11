import {
  Between,
  FindOptionsWhere,
  IsNull,
  LessThanOrEqual,
  MoreThanOrEqual,
} from "typeorm";

import { AppDataSource } from "orm/DataSource";
import { SubmissionRequest } from "orm/entities/SubmissionRequest";
import { Playlist } from "orm/entities/Playlist";
import { CreateSubmissionRequestInput } from "src/export";

const submissionRequestRepository =
  AppDataSource.getRepository(SubmissionRequest);

export function getCurrentSubmissionRequest() {
  return submissionRequestRepository.findOne({
    where: {
      isActive: true,
    },
    order: {
      requestedAt: "DESC",
    },
    relations: {
      playlist: true,
      submissions: {
        user: true,
      },
    },
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

export async function turnOffSubmissionRequest(
  submissionRequest: SubmissionRequest,
) {
  console.log("Turning off daily submission request");
  await submissionRequestRepository.save({
    ...submissionRequest,
    isActive: false,
  });
}

export async function turnOnSubmissionRequest(
  submissionRequest: SubmissionRequest,
) {
  await submissionRequestRepository.save({
    ...submissionRequest,
    isActive: true,
    requestedAt: new Date(),
  });
}

export function fetchSubmissionRequests({
  start,
  end,
}: {
  start?: number;
  end?: number;
}) {
  const scheduledForFilter = start
    ? end
      ? { scheduledFor: Between(new Date(start), new Date(end)) }
      : { scheduledFor: MoreThanOrEqual(new Date(start)) }
    : end
      ? { scheduledFor: LessThanOrEqual(new Date(end)) }
      : null;

  const whereOptions = [scheduledForFilter].filter(
    (a) => !!a,
  ) as FindOptionsWhere<SubmissionRequest>[];

  return submissionRequestRepository.find({
    ...(whereOptions.length ? { where: whereOptions } : {}),
    relations: ["playlist"],
    order: {
      scheduledFor: {
        direction: "DESC",
        nulls: "FIRST",
      },
    },
  });
}

export function fetchSubmissionRequest(id: number) {
  return submissionRequestRepository.findOneOrFail({
    where: { id },
    relations: ["playlist"],
  });
}

function createInputToEntity({
  requestText,
  scheduledFor,
  submissionResponse,
  playlistId,
  mediaUrl,
}: CreateSubmissionRequestInput): SubmissionRequest {
  return new SubmissionRequest({
    requestText,
    scheduledFor: scheduledFor ? new Date(scheduledFor) : undefined,
    submissionResponse,
    playlist: new Playlist({ id: playlistId }),
    mediaUrl,
  });
}

export function createSubmissionRequest(
  createInput: CreateSubmissionRequestInput,
) {
  return submissionRequestRepository.save(
    new SubmissionRequest(createInputToEntity(createInput)),
  );
}

export async function updateSubmissionRequest(
  id: number,
  update: Partial<CreateSubmissionRequestInput>,
) {
  const submissionRequest = await submissionRequestRepository.findOneOrFail({
    where: { id },
  });
  if (submissionRequest.requestedAt) {
    throw new Error(
      "Will not update an active submission request. Run a DB query if you really want to.",
    );
  }
  Object.assign(submissionRequest, update);
  return submissionRequest.save();
}
