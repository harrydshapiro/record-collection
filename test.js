const express = require('express');

const app = express();
const port = 8787;

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(port, () => {
    console.log(`Express app listening at http://localhost:${port}`);
});