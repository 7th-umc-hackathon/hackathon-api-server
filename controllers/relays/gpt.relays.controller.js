import * as aiService from "../../services/openai/v4.gpt.service.js";
import { logError } from "../../utils/handlers/error.logger.js";

export const missionComplete = async (req, res, next) => {
  try {
    const result = await aiService.analyzeMissionImage(
      req.body.mission,
      req.body.image
    );
    return res.status(200).success({ result });
  } catch (err) {
    logError(err);
    next(err);
  }
};

export const explainImage = async (req, res, next) => {
  try {
    const result = await aiService.explainImage(req.body.image);
    return res.status(200).success({ result });
  } catch (err) {
    logError(err);
    next(err);
  }
};

export const getMission = async (req, res, next) => {
  try {
    const result = await aiService.getMission();
    return res.status(201).success({ result });
  } catch (err) {
    logError(err);
    next(err);
  }
};
