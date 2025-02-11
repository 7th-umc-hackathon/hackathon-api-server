import jwt from "jsonwebtoken";
import logger from "../utils/logger/logger.js";
import { NotAllowedError, UnauthorizedError } from "../utils/errors/errors.js";

import config from "../config.js";
const { JWT_SECRET } = config.SERVER;
/**
 * Bearer 토큰을 추출하고 검증하는 미들웨어
 */
export const authenticateAccessToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];

    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) {
        logger.warn(`[authenticateAccessToken] 토큰 검증 실패: ${err.message}`);
        next(
          new NotAllowedError({
            message: "토큰이 유효하지 않습니다.",
            jwt_message: err.message,
          })
        );
        return;
      }

      let { user_id, name, nickname } = user;

      // payload 안의 user_id를 암호화하여 전달했을 경우 복호화
      // user_id = parseInt(decrypt62(user_id));

      req.user = {
        user_id,
        name,
        nickname,
      }; // 검증된 사용자 정보를 요청 객체에 추가
      next();
    });
  } else {
    logger.error("[authenticateAccessToken] 인증 헤더가 누락되었습니다.");
    next(new UnauthorizedError("Authorization이 제공되지 않았습니다."));
  }
};
