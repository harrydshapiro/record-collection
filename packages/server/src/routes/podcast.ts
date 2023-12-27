import { Router } from "express";

export const podcastRouter = Router();

podcastRouter.use("*", (req, res) => {
  res.redirect(302, "http://subscribers.transistor.fm/f683ac20700d03");
});
