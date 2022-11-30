import 'dotenv/config';
import 'reflect-metadata';
import bodyParser from 'body-parser';
import express from 'express';
import morgan from 'morgan';
import path from 'path'

import { dbCreateConnection } from 'orm/DataSource';
import { startCron } from 'request-scheduler/cron';
import routes from 'routes/index';

export const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(morgan('combined'));

app.use('/', routes);
app.use(express.static(path.join(__dirname, '../../client/build')));

const port = process.env.PORT || 4000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

(async () => {
    await dbCreateConnection();
    if (process.env.NODE_ENV === 'production') {
        startCron();
    }
})();
