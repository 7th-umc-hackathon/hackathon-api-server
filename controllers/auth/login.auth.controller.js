import { logError } from "../../utils/handlers/error.logger.js";
import * as loginService from "../../services/auth/login.auth.service.js";
import * as tokenService from "../../services/auth/auth.token.service.js";

import { comparePassword } from "../../utils/cipher/encrypt.js";

import logger from "../../utils/logger/logger.js";
import { UnknownError } from "../../utils/errors/errors.js";
export const userLogin = async (req, res, next) => {
  try {
    // id로 사용자 정보 가져와서 hashed 비밀번호와 비교
    const user = await loginService.getUserByLoginId(req.body.login_id);
    // 로그인 실패 시, 에러 처리 (비밀번호 불일치)
    const result = await comparePassword(req.body.password, user.password);
    logger.info(
      `로그인 시도: ${req.body.login_id} ${req.body.password} ${result}`
    );

    if (result) {
      logger.info(`로그인 성공: ${user.login_id}`);

      // 로그인 성공 시, 토큰 발급
      const accessToken = tokenService.createAccessToken({
        user_id: user.user_id,
        name: user.name,
        nickname: user.nickname,
      });
      res.success({
        message: "로그인 성공",
        access_token: `Bearer ${accessToken}`,
      });
    }
    // 발생하면 안되는 error
    throw new UnknownError("로그인 실패");
  } catch (err) {
    logError(err);
    next(err);
  }
};
