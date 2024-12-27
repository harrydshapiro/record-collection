const fs = require('fs');
const fetch = require('node-fetch');

const filePrefix = "Big Star/#1 Record (Remastered 2024)/";
const fileNames = [
  '01 - Big Star - Feel (Remastered 2024).flac',
  '02 - Big Star - The Ballad Of El Goodo (Remastered 2024).flac',
  '03 - Big Star - In The Street (Remastered 2024).flac',
  '04 - Big Star - Thirteen (Remastered 2024).flac',
  "05 - Big Star - Don't Lie To Me (Remastered 2024).flac",
  '06 - Big Star - The India Song (Remastered 2024).flac',
  "07 - Big Star - When My Baby's Beside Me (Remastered 2024).flac",
  '08 - Big Star - My Life Is Right (Remastered 2024).flac',
  '09 - Big Star - Give Me Another Chance (Remastered 2024).flac',
  '10 - Big Star - Try Again (Remastered 2024).flac',
  '11 - Big Star - Watch The Sunrise (Remastered 2024).flac',
  '12 - Big Star - St 1006 (Remastered 2024).flac',
  'folder.jpg',
  'large_cover.jpg'
];

(async function () {
  for (const fileName of fileNames) {
    const filePath = `${filePrefix}/${fileName}`;
    const uri = `https://harryshapiro.ngrok.io/${encodeURIComponent(filePath)}`;

    await fetch(uri)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Failed to fetch ${uri}: ${response.statusText}`);
        }
        const dest = fs.createWriteStream(`/mnt/music/music/${filePath}`);
        response.body.pipe(dest);
        response.body.on('error', (err) => {
          console.error(`Error writing ${fileName}:`, err);
        });
        dest.on('finish', () => {
          console.log(`Saved ${fileName}`);
        });
      })
      .catch(error => {
        console.error(`Error fetching ${fileName}:`, error);
      });
  }
})()
