import { Op } from "sequelize"; // Sequelize에서 연산자 가져오기
import { RelayUser } from "../../models/index.js";
import {
  AlreadyExistsError,
  NotExistsError,
} from "../../utils/errors/errors.js";

// 사용자가 진행한 릴레이 이력 조회
export const listUserRelayHistorys = async (userId) => {
  const historyList = await RelayUser.findAll({
    where: {
      user_id: userId,
    },
  });
  console.log(historyList);
  if (!historyList || historyList.length == 0) {
    throw new NotExistsError("사용자가 진행한 릴레이 이력이 없습니다.", {
      userId,
    });
  }

  return historyList;
};

export const getRelayHistory = async (relayId) => {
  const history = await RelayUser.findAll({
    where: {
      relay_id: relayId,
    },
    order: [["relay_user_id", "ASC"]],
  });

  return history;
};

//사용자가 현재 진행 중인 릴레이 조회: 있으면 error
export const checkCurrentRelayNoExists = async (userId) => {
  const currentRelay = await RelayUser.findOne({
    where: {
      user_id: userId,
      status: {
        [Op.or]: ["in_progress", "waiting"], // 'in_progress' 또는 'waiting' 조건
      },
    },
  });

  if (currentRelay) {
    throw new AlreadyExistsError("사용자가 진행중인 릴레이가 있습니다.", {
      userId,
    }); // 릴레이가 없으면 null 반환
  }

  return currentRelay; // 릴레이가 있으면 반환
};

// 사용자 현재 진행 중인 릴레이 조회: 없으면 error
export const checkCurrentRelayExists = async (userId) => {
  const currentRelay = await RelayUser.findOne({
    where: {
      user_id: userId,
      status: {
        [Op.or]: ["in_progress", "waiting"], // 'in_progress' 또는 'waiting' 조건
      },
    },
  });

  if (!currentRelay) {
    throw new NotExistsError("사용자가 진행중인 릴레이가 없습니다.", {
      userId,
    }); // 릴레이가 없으면 null 반환
  }

  return currentRelay; // 릴레이가 있으면 반환
};
