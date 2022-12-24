import 'dotenv/config';
import 'reflect-metadata';
import bodyParser from 'body-parser';
import express from 'express';
import morgan from 'morgan';
import path from 'path'

import { dbCreateConnection } from 'orm/DataSource';
import { startCron } from 'request-scheduler/cron';
import routes from 'routes/index';
import cors from 'cors'
import cookieParser from 'cookie-parser'
import expressSession from 'express-session'
import postgresSession from 'connect-pg-simple'


export const app = express();  

app.use(cors({}))

app.use(cookieParser())

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(morgan('combined'));

app.use(routes);
app.use(express.static(path.join(__dirname, '../../client/build')));
app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../client/build/index.html'));
});

const port = process.env.PORT || 4000;

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

(async () => {
    await dbCreateConnection();

    const pgSessionStore = postgresSession(expressSession)
    app.use(
        expressSession({
            store: new pgSessionStore({
                createTableIfMissing: true,
                conObject: {
                    connectionString: process.env.DATABASE_URL,
                    ssl: { rejectUnauthorized: false }
                } 
            }),
            secret: process.env.COOKIE_SECRET!,
            resave: false,
            cookie: { maxAge: 24 * 60 * 60 * 1000 },
            rolling: true,
            saveUninitialized: true
            // Insert express-session options here
        })
    );

    if (process.env.NODE_ENV === 'production') {
        startCron();
    }
})();