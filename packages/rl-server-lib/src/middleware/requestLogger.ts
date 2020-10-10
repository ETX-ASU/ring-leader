import { Request, Response, NextFunction } from "express";
import logger from "../services/LogService";

const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction
): any => {
  logger.info({ url: req.url, body: req.body });
  next();
};

export default requestLogger;
