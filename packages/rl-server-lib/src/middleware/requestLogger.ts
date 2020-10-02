import { Request, Response, NextFunction } from "express";
import log from "../services/LogService";

const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction
): any => {
  log.info({ url: req.url, body: req.body });
  next();
};

export default requestLogger;
