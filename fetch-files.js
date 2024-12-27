const fs = require('fs');
const fetch = require('node-fetch');

const filePrefix = "Madison Cunningham/Who Are You Now/";
const fileNames = [
"01 - Madison Cunningham - Pin It Down.flac",
"02 - Madison Cunningham - Song In My Head.flac",
"03 - Madison Cunningham - Something To Believe In.flac",
"04 - Madison Cunningham - Trouble Found Me.flac",
"05 - Madison Cunningham - Plain Letters.flac",
"06 - Madison Cunningham - L.A. (Looking Alive).flac",
"07 - Madison Cunningham - Dry As Sand.flac",
"08 - Madison Cunningham - Like You Do.flac",
"09 - Madison Cunningham - Common Language.flac",
"10 - Madison Cunningham - Bound.flac",
"folder.jpg",
"large_cover.jpg"
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
