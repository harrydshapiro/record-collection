import "dotenv/config";
import "reflect-metadata";
import bodyParser from "body-parser";
import express, { ErrorRequestHandler } from "express";
import morgan from "morgan";
import path from "path";
import "express-async-errors";

import routes from "routes/index";
import cors from "cors";
import cookieParser from "cookie-parser";

export const app = express();

// Ensures async errors in route handling don't hang.
// This is a fallback - individual handlers *should* do their own error responses.
app.use(((err, req, res, next) => {
  next(err);
}) as ErrorRequestHandler);

app.use(cors({}));

// 🍪
app.use(cookieParser());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(morgan("combined"));

app.use(routes);
app.use(express.static(path.join(__dirname, "../../client/build")));
app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "../../client/build/index.html"));
});

const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
