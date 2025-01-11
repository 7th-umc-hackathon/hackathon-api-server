import { checkCurrentRelayNoExists } from "../../services/relays/check.relays.service.js";
import { createNewRelay } from "../../services/relays/create.relays.service.js";
import { logError } from "../../utils/handlers/error.logger.js";

export const handleCreateNewRelay = async (req, res, next) => {
  try {
    // 사용자가 진행중인 릴레이가 있는지 확인 => service 내에서 에러 처리
    await checkCurrentRelayNoExists(req.user.user_id);

    /*
    unqiue 국가는 생성할 때 고정
    reward_relay는 참가하는 사용자가 정하는 부분

    */

    const { mission, unique_country_count } = req.body;

    // 새로운 릴레이 생성
    const createdRelay = await createNewRelay({
      userId: req.user.user_id,
      mission,
      unique_country_count,
    });

    return res.status(200).success(createdRelay);
  } catch (err) {
    logError(err);
    next(err);
  }
};
