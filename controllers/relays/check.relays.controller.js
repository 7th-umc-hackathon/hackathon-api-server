import {
  checkCurrentRelayExists,
  listUserRelayHistorys,
  getRelayHistory as getRelayHistoryService,
} from "../../services/relays/check.relays.service.js";
import { logError } from "../../utils/handlers/error.logger.js";

//현재 사용자 진행중 릴레이 조회
export const handleUserCurrentRelayGet = async (req, res, next) => {
  try {
    console.log("사용자의 진행중인 릴레이 조회를 요청하였습니다.");

    //현재 진행중인 릴레이가 있는지 조회
    const relay = await checkCurrentRelayExists(req.user.user_id);

    return res.status(200).success(relay);
  } catch (err) {
    logError(err);
    next(err);
  }
};

//사용자의 릴레이 이력 조회
export const handleGetUserRelayHistory = async (req, res, next) => {
  try {
    console.log("사용자의 릴레이 이력 조회를 요청하였습니다.");

    const relayList = await listUserRelayHistorys(req.user.user_id);

    return res.status(200).success(relayList);
  } catch (err) {
    logError(err);
    next(err);
  }
};

export const getRelayHistory = async (req, res, next) => {
  try {
    const { relay_id } = req.params;
    const result = await getRelayHistoryService(relay_id);
    return res.status(201).success({ result });
  } catch (err) {
    logError(err);
    next(err);
  }
};
