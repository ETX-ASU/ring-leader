import { Express } from "express";

import log from "../services/LogService";
import requestLogger from "../middleware/requestLogger";

const ltiLaunchEndpoints = (app: Express): void => {
  app.get("/launch", requestLogger, (req, res) => {
    res.send("");
  });

  app.post("/launch", requestLogger, (req, res) => {
    res.redirect(`/instructor`);
  });
};

export default ltiLaunchEndpoints;
