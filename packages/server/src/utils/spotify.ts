import axios from 'axios';
import { Track } from 'orm/entities/Track';

export const ZEITGEIST_URI = '7tSOhMZxJRbqBgVMMUzxnR';

export function addSongToPlaylist(songUri: string, playlistUri: string) {
    if (!playlistUri || !songUri) {
        console.error('Required arguments missing form addSongToPlaylist', { songUri, playlistUri });
        return;
    }

    const result = axios.post('https://hooks.zapier.com/hooks/catch/5927178/bcw7zup/', {
        songUri,
        playlistUri,
    });
    console.log('result of adding song to playlist was', { songUri, playlistUri, result })
    return result
}

export function createSpotifyPlaylist(name: string) {
    return axios.post('https://hooks.zapier.com/hooks/catch/5927178/b02ue8o/', name);
}

export function getPlaylistShareLink(uri: string) {
    return `https://open.spotify.com/playlist/${uri}`;
}



/**
 * Determines what data related to a given track is missing from our DB,
 * fetches it, and adds it to the DB.
 */
export async function persistTrackDataAndRelationsToDb(songUri: string): Promise<{ track: Track, trackPopularity: number }> {
    // TODO: Actually implement fetching from Spotify :) and whatnot
    return Promise.resolve({ track: new Track(), trackPopularity: 0 })
}