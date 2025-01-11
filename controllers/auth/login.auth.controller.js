import { logError } from "../../utils/handlers/error.logger.js";
import * as loginService from "../../services/auth/login.auth.service.js";
import { comparePassword } from "../../utils/cipher/encrypt.js";
import * as tokenService from "../../services/auth/auth.token.service.js";

import logger from "../../utils/logger/logger.js";
export const userLogin = async (req, res, next) => {
  try {
    // id로 사용자 정보 가져와서 hashed 비밀번호와 비교
    const user = await loginService.getUserByLoginId(req.body.login_id);
    const result = await comparePassword(req.body.password, user.password);
    const accessToken = tokenService.createAccessToken({
      user_id: user.user_id,
      name: user.name,
      nickname: user.nickname,
    });

    if (result) {
      logger.info(`로그인 성공: ${user.login_id}`);
      res.success({
        message: "로그인 성공",
        access_token: accessToken,
      });
    }
    // 로그인
    // 로그인 성공 시, 토큰 발급
    // 로그인 실패 시, 에러 처리
  } catch (err) {
    logError(err);
    next(err);
  }
};
