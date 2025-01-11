import jwt from "jsonwebtoken";
import logger from "../logger/logger";
import { SERVER } from "./config.json";
const { JWT_SECRET } = SERVER;

export const parseBearerFromHeader = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    req.token = token;
    logger.info(`Parsed token: ${token}`);
  }
  next();
};

export const decodeToken = (req, res, next) => {
  const token = req.token;
  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;
      logger.info(`Decoded token: ${JSON.stringify(decoded, 2)}`);
    } catch (error) {
      logger.error(`Token decoding error: ${error.message}`);
    }
  }
  next();
};
