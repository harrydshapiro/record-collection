/**
 * database - the song database has been modified after update
 *
 * update - a database update has started or finished; if the database was modified during the update, the database event is also emitted
 *
 * stored_playlist - a stored playlist has been modified, renamed, created or deleted
 *
 * playlist - the current playlist has been modified
 *
 * player - the player has been started, stopped or seeked
 *
 * mixer - the volume has been changed
 *
 * output - an audio output has been enabled or disabled
 *
 * options - options like repeat, random, crossfade, replay gain
 *
 * sticker - the sticker database has been modified
 *
 * subscription - a client has subscribed or unsubscribed to a channel
 *
 * message - a message was received on a channel this client is subscribed to; this event is only emitted when the queue is empty
 */
export type MpdSubsystem =
  | "database"
  | "update"
  | "stored_playlist"
  | "playlist"
  | "player"
  | "mixer"
  | "output"
  | "options"
  | "sticker"
  | "subscription"
  | "message";
