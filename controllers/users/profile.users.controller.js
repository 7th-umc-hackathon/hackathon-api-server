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

export const countryRankingList = async (req, res, next) => {
  try {
    const rank = await userService.countryRanking();

    return res.status(200).success({ rank });
  } catch (err) {
    logError(err);
    next(err);
  }
};

export const myCountryRanking = async (req, res, next) => {
  try {
    const rank = await userService.myCountryRanking(req.user.user_id);

    return res.status(200).success({ rank });
  } catch (err) {
    logError(err);
    next(err);
  }
};

export const userRankList = async (req, res, next) => {
  try {
    const rank = await userService.userRankList();

    return res.status(200).success({ rank });
  } catch (err) {
    logError(err);
    next(err);
  }
};

export const claimRewared = async (req, res, next) => {};
