import jwt from "jsonwebtoken";
import { UserRefreshToken } from "../../models";
import { encrypt62 } from "../../utils/encrypt.util";
import { SERVER } from "../../config.json";
import tokenValidator from "../../utils/validators/token.validator";
import { NotExistsError, NotAllowedError, DatabaseError } from "../../errors";
import logger from "../../logger";

const { JWT_SECRET } = SERVER;

/**
 * 사용자 ID, 이름, 닉네임을 기반으로 액세스 토큰을 생성하는 서비스 함수.
 * @param {string|number} user_id - 토큰을 생성할 사용자의 고유 ID.
 * @param {string} name - 사용자의 이름.
 * @param {string} nickname - 사용자의 닉네임.
 * @returns {string} 생성된 JWT 액세스 토큰 문자열.
 */
export const createAccessToken = ({ user_id, name, nickname }) => {
  const encryptedUserId = encrypt62(user_id.toString());
  const payload = {
    user_id: encryptedUserId,
    name,
    nickname,
  };
  const options = {
    expiresIn: "30m",
  };
  return jwt.sign(payload, JWT_SECRET, options);
};

/**
 * 테스트용 사용자 ID, 이름, 닉네임을 기반으로 액세스 토큰을 생성하는 서비스 함수.
 * @param {string|number} user_id - 토큰을 생성할 테스트 사용자의 고유 ID.
 * @param {string} name - 테스트 사용자의 이름.
 * @param {string} nickname - 테스트 사용자의 닉네임.
 * @returns {string} 생성된 JWT 액세스 토큰 문자열.
 */
export const createTestUserToken = (user_id, name, nickname) => {
  const encryptedUserId = encrypt62(user_id.toString());
  const payload = {
    user_id: encryptedUserId,
    name,
    nickname,
  };
  const options = {
    expiresIn: "1y",
  };
  const token = jwt.sign(payload, JWT_SECRET, options);
  return `Bearer ${token}`;
};

/**
 * 사용자 ID를 기반으로 리프레시 토큰을 생성하고 데이터베이스에 저장하는 서비스 함수.
 * @param {string|number} user_id - 리프레시 토큰을 생성할 사용자의 고유 ID.
 * @throws {DatabaseError} 리프레시 토큰 생성 또는 저장에 실패한 경우 오류를 발생시킵니다.
 * @returns {Promise<string>} 생성된 JWT 리프레시 토큰 문자열.
 */
export const createRefreshToken = async (user_id) => {
  const encryptedUserId = encrypt62(user_id.toString());
  const payload = {
    user_id: encryptedUserId,
  };
  const options = {
    expiresIn: "7d",
  };
  const result = jwt.sign(payload, JWT_SECRET, options);

  try {
    await UserRefreshToken.create({
      user_id,
      refresh_token: result,
    });
  } catch (error) {
    throw new DatabaseError("리프레시 토큰 저장에 실패했습니다.", error);
  }

  return result;
};

export const checkIfRefreshTokenExists = (data) => {
  // 없으면 에러 뱉어주기
  if (!data) {
    logger.error(
      "[checkIfRefreshTokenExists] 리프레시 토큰이 존재하지 않습니다."
    );
    // throw new NotExistsError("리프레시 토큰이 존재하지 않습니다.");
  }
};

export const isAccessTokenValid = (token) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    tokenValidator.accessToken(token);
    return { ...decoded };
  } catch (err) {
    throw new NotAllowedError("유효하지 않은 토큰입니다.");
  }
};

export const isRefreshTokenValid = (token) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    tokenValidator.refreshToken(token);
    return { ...decoded };
  } catch (err) {
    throw new NotAllowedError("유효하지 않은 토큰입니다.");
  }
};
