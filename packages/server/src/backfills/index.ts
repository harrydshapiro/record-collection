// import { messageRepository } from "orm/repositories/message.repository";
// import { Like } from "typeorm";

// async function forEachTrack(fn: (trackId: string) => Promise<void>) {
//   const messages = await messageRepository.find({
//     where: { body: Like("%track%") },
//     relations: ["user", "submissionRequest"],
//   });
//   for (let i = 0; i < messages.length; i++) {
//     const message = messages[i];
//     const trackId = new URL(message.body).pathname.split("/").pop();
//     if (trackId) {
//       await fn(trackId);
//     }
//   }
// }

export async function backfillDB() {
  //   await forEachTrack();
}
