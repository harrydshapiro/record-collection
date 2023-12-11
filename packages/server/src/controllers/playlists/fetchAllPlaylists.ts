import { Request, Response } from "express";
import { Playlist } from "orm/entities/Playlist";
import { findAllPlaylists } from "orm/repositories/playlist.repository";

export async function fetchAllPlaylists(
  req: Request<
    Record<string, never>,
    { playlists: Playlist[] },
    never,
    { start?: string; end?: string }
  >,
  res: Response,
) {
  const playlists = await findAllPlaylists();
  res.status(200).send(playlists);
}
