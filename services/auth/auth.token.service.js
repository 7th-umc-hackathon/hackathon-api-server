import jwt from "jsonwebtoken";

import config from "../../config.js";
const { JWT_SECRET } = config.SERVER;

import { UnauthorizedError } from "../../utils/errors/errors.js";

/**
 * 사용자 ID, 이름, 닉네임을 기반으로 액세스 토큰을 생성하는 서비스 함수.
 * @param {string|number} user_id - 토큰을 생성할 사용자의 고유 ID.
 * @param {string} name - 사용자의 이름.
 * @param {string} nickname - 사용자의 닉네임.
 * @returns {string} 생성된 JWT 액세스 토큰 문자열.
 */
export const createAccessToken = ({ user_id, name, nickname }) => {
  const payload = {
    user_id,
    name,
    nickname,
  };
  const options = {
    expiresIn: "10h",
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
  const payload = {
    user_id,
    name,
    nickname,
  };
  const options = {
    expiresIn: "1y",
  };
  const token = jwt.sign(payload, JWT_SECRET, options);
  return `Bearer ${token}`;
};

export const isAccessTokenValid = (token) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return { ...decoded };
  } catch (err) {
    throw new UnauthorizedError("유효하지 않은 토큰입니다.");
  }
};
