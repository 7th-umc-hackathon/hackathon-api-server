import { Op } from "sequelize"; // Sequelize에서 연산자 가져오기
import { RelayUser } from "../../models/index.js";
import { NotExistsError } from "../../utils/errors/errors.js";

// 사용자 현재 진행 중인 릴레이 조회
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
        throw new NotExistsError("사용자가 진행중인 릴레이가 없습니다.",{userId}); // 릴레이가 없으면 null 반환
    }

    return currentRelay; // 릴레이가 있으면 반환
};