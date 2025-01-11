import { Country } from "../../models/index.js";
import * as assignService from "../../services/relays/assign.relays.service.js";
import { logError } from "../../utils/handlers/error.logger.js";

export const newAssign = async (req, res, next) => {
  try {
    const { user_id } = req.user;
    // 새로운 릴레이 배정 랜덤
    const newAssignment = await assignService.assignment(user_id);
    return res.status(200).success({
      relay: newAssignment,
    });
  } catch (error) {
    logError(error);
    next(error);
  }
};

export const assignConfirm = async (req, res, next) => {
  try {
    const { user_id } = req.user;
    
    // 현재 릴레이 배정을 확정
    const confirmedRelay = await assignService.confirmAssignment(user_id,req.body);

    return res.status(200).success({
      message: "참가하기 선택 성공",
      relay_user: confirmedRelay,
    });
  } catch (error) {
    logError(error);
    next(error);
  }
};

export const nextCountry = async (req, res, next) => {
  try {
    const { relay_id } = req.params;

    const nextCountries = await assignService.getNextCountries(relay_id);

    return res.status(200).success({
      country: nextCountries,
    });
  } catch (error) {
    logError(error);
    next(error);
  }
};

export const countryConfirm = async (req, res, next) => {
  try {
    const { relay_id } = req.params;
    const { user_id } = req.user;
    const { next_country_id } = req.body; // 다음 국가

    const confirmedCountry = await assignService.confirmCountry(
      user_id,
      relay_id,
      next_country_id
    );

    return res.status(200).success({
      message: "국가 선택 성공",
      country: confirmedCountry,
    });
  } catch (error) {
    logError(error);
    next(error);
  }
};
