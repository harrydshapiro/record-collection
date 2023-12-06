import axios from "axios";
import { Track } from "orm/entities/Track";
import { upsertTrack } from "orm/repositories/track.repository";
import * as Spotify from "@spotify/web-api-ts-sdk";
import { Album } from "orm/entities/Album";
import { Genre } from "orm/entities/Genre";
import { Artist } from "orm/entities/Artist";
import { upsertAlbum } from "orm/repositories/album.repository";
import { upsertArtists } from "orm/repositories/artist.repository";
import { upsertGenres } from "orm/repositories/genre.repository";

let sdk: Spotify.SpotifyApi;
function initSdk() {
  sdk = Spotify.SpotifyApi.withClientCredentials(
    process.env.SPOTIFY_CLIENT_ID || "",
    process.env.SPOTIFY_CLIENT_SECRET || "",
  );
}
initSdk();

export const ZEITGEIST_URI = "7tSOhMZxJRbqBgVMMUzxnR";

export function addSongToPlaylist(songUri: string, playlistUri: string) {
  if (!playlistUri || !songUri) {
    console.error("Required arguments missing form addSongToPlaylist", {
      songUri,
      playlistUri,
    });
    return;
  }

  const result = axios.post(
    "https://hooks.zapier.com/hooks/catch/5927178/bcw7zup/",
    {
      songUri,
      playlistUri,
    },
  );
  console.log("result of adding song to playlist was", {
    songUri,
    playlistUri,
    result,
  });
  return result;
}

export function createSpotifyPlaylist(name: string) {
  return axios.post(
    "https://hooks.zapier.com/hooks/catch/5927178/b02ue8o/",
    name,
  );
}

export function getPlaylistShareLink(uri: string) {
  return `https://open.spotify.com/playlist/${uri}`;
}

export async function persistTrackDataAndRelationsToDb(
  trackUri: string,
): Promise<{ track: Track; trackPopularity: number }> {
  async function attempt() {
    const spotifyTrack = await sdk.tracks.get(trackUri);
    const spotifyTrackAudioFeatures = await sdk.tracks.audioFeatures(trackUri);
    const spotifyAlbum = await sdk.albums.get(spotifyTrack.album.id);
    const spotifyArtists = await Promise.all(
      spotifyTrack.artists.map(({ id }) => sdk.artists.get(id)),
    );

    const songhausArtists: Artist[] = [];
    for (const artist of spotifyArtists) {
      const genres = await upsertGenres(
        artist.genres.map(mapSpotifyGenreToSongHausGenre),
      );
      songhausArtists.push(mapSpotifyArtistToSongHausArtist(artist, genres));
    }
    const upsertedArtists = await upsertArtists(songhausArtists);

    const songhausAlbum = mapSpotifyAlbumToSongHausAlbum(
      spotifyAlbum,
      upsertedArtists,
    );
    const upsertedAlbum = await upsertAlbum(songhausAlbum);

    const songhausTrack = mapSpotifyTrackToSongHausTrack(
      spotifyTrack,
      upsertedAlbum,
      upsertedArtists,
      spotifyTrackAudioFeatures,
    );
    const upsertedTrack = await upsertTrack(songhausTrack);
    return { track: upsertedTrack, trackPopularity: spotifyTrack.popularity };
  }
  try {
    return await attempt();
  } catch (err) {
    initSdk();
    return attempt();
  }
}

export function mapSpotifyTrackToSongHausTrack(
  spotifyTrack: Spotify.Track,
  album: Pick<Album, "id">,
  artists: Pick<Artist, "id">[],
  audioFeatures: Spotify.AudioFeatures,
) {
  return new Track({
    uri: spotifyTrack.uri,
    durationMs: spotifyTrack.duration_ms,
    trackNumber: spotifyTrack.track_number,
    name: spotifyTrack.name,
    album: album as Album,
    artists: artists as Artist[],
    danceability: audioFeatures.danceability,
    key: audioFeatures.key,
    liveness: audioFeatures.liveness,
    loudness: audioFeatures.loudness,
    mode: audioFeatures.mode,
    speechiness: audioFeatures.speechiness,
    tempo: audioFeatures.tempo,
    timeSignature: audioFeatures.time_signature,
    valence: audioFeatures.valence,
    acousticness: audioFeatures.acousticness,
    energy: audioFeatures.energy,
  });
}

export function mapSpotifyAlbumToSongHausAlbum(
  spotifyAlbum: Spotify.Album,
  artists: Pick<Artist, "id">[],
) {
  return new Album({
    name: spotifyAlbum.name,
    uri: spotifyAlbum.uri,
    images: spotifyAlbum.images,
    releaseDate: new Date(spotifyAlbum.release_date),
    popularity: spotifyAlbum.popularity,
    artists: artists as Artist[],
  });
}

export function mapSpotifyGenreToSongHausGenre(spotifyGenre: string) {
  return new Genre({ name: spotifyGenre });
}

/**
 * For now, this is just used when mapping a Spotify track to a SongHaus track. It omits some relations as a result.
 *
 * @param spotifyArtist This should be a full - not simplied - artist from the Spotify API
 * @returns An Artist entity *without* track or album relations
 */
export function mapSpotifyArtistToSongHausArtist(
  spotifyArtist: Spotify.Artist,
  genres: Pick<Genre, "id">[],
) {
  return new Artist({
    uri: spotifyArtist.uri,
    name: spotifyArtist.name,
    followers: spotifyArtist.followers.total,
    images: spotifyArtist.images,
    popularity: spotifyArtist.popularity,
    genres: genres as Genre[],
  });
}

// export async function backfillDB () {
//     const messages = await messageRepository.find({ where: { body: Like('%track%') }, relations: ['user', 'submissionRequest'] })
//     for (let i = 0; i < messages.length; i++) {
//         const message = messages[i]
//         const trackId = new URL(message.body).pathname.split('/').pop()
//         if (trackId) {
//             const matchingTrack = await getFullTrackContext(`spotify:track:${trackId}`)
//             try {
//                 if (matchingTrack) {
//                     await addSubmittedTrack({ trackId: matchingTrack.id, userId: message.user?.id, submissionRequestId: message.submissionRequest.id, popularityAtSubmissionTime: 101 })
//                     console.log(i, 'Submitted track:', trackId, 'Message:', message.id)
//                 }
//             } catch (err) {
//                 console.error(trackId, err)
//             }
//         }
//     }
// }
