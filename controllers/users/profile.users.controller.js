import * as userService from "../../services/users/users.service.js";
import { logError } from "../../utils/handlers/error.logger.js";

export const userProfile = async (req, res, next) => {
  try {
    const user = await userService.userProfile(req.user.user_id);

    return res.status(200).success({ user });
  } catch (err) {
    logError(err);
    next(err);
  }
};

export const userRank = async (req, res, next) => {
  try {
    const rank = await userService.userRanking(req.user.user_id);

    return res.status(200).success({ rank });
  } catch (err) {
    logError(err);
    next(err);
  }
};

export const countryRank = async (req, res, next) => {
  try {
    const rank = await userService.countryRanking(req.user.country_id);

    return res.status(200).success({ rank });
  } catch (err) {
    logError(err);
    next(err);
  }
};

export const claimRewared = async (req, res, next) => {};
