const dotenv = require("dotenv");
dotenv.config();

const musicmetadata = require("music-metadata");
const fs = require("fs/promises");
const path = require("path");
const NodeID3 = require("node-id3");

const inputDirectory = process.env.LIBRARY_ROOT_PATH;

async function processDirectory(directory) {
    const entries = await fs.readdir(directory, { withFileTypes: true });
    let hasSubdirectories = false;

    for (const entry of entries) {
        if (entry.isDirectory()) {
            hasSubdirectories = true;
            await processDirectory(`${directory}/${entry.name}`);
        }
    }

    if (!hasSubdirectories) {
        const files = entries.filter(e => e.isFile());
        const artists = {};
        const albumArtists = {};
        const filePaths = files.map((file) => path.join(directory, file.name))
        for (const filePath of filePaths) {
            const trackData = await musicmetadata.parseFile(filePath);
            const { artist, albumartist } = trackData;
            console.log(filePath, trackData)
            if (albumartist) {
                if (typeof albumArtists[albumartist] !== 'number') {
                    albumArtists[albumartist] = 0;
                }
                albumArtists[albumartist]++    
            }
            if (artist) {
                if (typeof artists[artist] !== 'number') {
                    artists[artist] = 0;
                }
                artists[artist]++
            }
        }
        const albumArtistName = Object.entries(albumArtists).sort((a, b) => {
            b[1] - a[1]
        })[0]?.[0] || Object.entries(artists).sort((a, b) => {
            b[1] - a[1]
        })[0]?.[0] || "unknown"
        // for (const filePath of filePaths) {
        //     const success = NodeID3.update({ TPE2: albumArtistName, 'performerInfo': albumArtistName, artist: albumArtistName }, filePath)
        //     console.log('success', filePath, success)
        // } 
    }
}

(async function () {
    await processDirectory(inputDirectory);
})()