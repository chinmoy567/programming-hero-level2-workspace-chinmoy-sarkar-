import type { NextFunction, Request, Response } from "express";
import fs from "fs";

const logger = (req: Request, res: Response, next: NextFunction) => {
  const currentDate = new Date();

  const date = currentDate.toLocaleDateString();
  const time = currentDate.toLocaleTimeString();
  const log = `
Method -> ${req.method}
URL -> ${req.url}
Date -> ${date}
Time -> ${time}
`;
  fs.appendFile("logger.txt", log, (err) => {
  });

  next();
};
export default logger;
