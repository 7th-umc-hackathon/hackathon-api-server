import axios from "axios";
import { User, UserOauth } from "../../models";
import { createAccessToken, createRefreshToken } from "./auth.token.service";
import { encrypt62 } from "../../utils/encrypt.util";
import config from "../../config.json";
import { NotExistsError, InvalidInputError } from "../../errors";
import logger from "../../logger";

const { FRONTEND_URL } = config.SERVER;
const { KAKAO_REST_API_KEY, KAKAO_CLIENT_SECRET, KAKAO_REDIRECT_URI } =
  config.KAKAO;

/**
 * 카카오 OAuth 인증 코드를 사용하여 액세스 토큰을 요청하는 함수.
 * @param {string} authorizationCode - 카카오에서 받은 인증 코드.
 * @returns {Promise<string>} 액세스 토큰.
 * @throws {InvalidInputError} 액세스 토큰 요청이 실패한 경우.
 */
export const getKakaoAccessToken = async (authorizationCode) => {
  logger.info(`[getKakaoAccessToken] 인증 코드: ${authorizationCode}`);
  const tokenResponse = await axios.post(
    "https://kauth.kakao.com/oauth/token",
    null,
    {
      params: {
        grant_type: "authorization_code",
        client_id: KAKAO_REST_API_KEY,
        redirect_uri: KAKAO_REDIRECT_URI,
        code: authorizationCode,
        client_secret: KAKAO_CLIENT_SECRET, // 필요한 경우
      },
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  return tokenResponse.data.access_token;
};

/**
 * 카카오 액세스 토큰을 사용하여 사용자 정보를 조회하는 함수.
 * @param {string} accessToken - 카카오 액세스 토큰.
 * @returns {Promise<Object>} 카카오 사용자 정보.
 * @throws {NotExistsError} 사용자 정보 조회가 실패한 경우.
 */
export const getKakaoUserInfo = async (accessToken) => {
  const userInfoResponse = await axios.get(
    "https://kapi.kakao.com/v2/user/me",
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: {
        property_keys: [
          "kakao_account.email",
          "kakao_account.profile.nickname",
          "kakao_account.profile.profile_image_url",
        ],
      },
    }
  );

  logger.debug(
    `[getKakaoUserInfo] 사용자 정보: ${JSON.stringify(userInfoResponse.data, null, 2)}`
  );

  const { id, properties, kakao_account } = userInfoResponse.data;

  return {
    oauth_id: id,
    name: properties.nickname,
    nickname: properties.nickname,
    email: kakao_account.email,
    profile_image: properties.profile_image,
  };
};

export const checkAuthorizationCode = (authorizationCode) => {
  if (!authorizationCode) {
    logger.error("[checkAuthorizationCode] 인증 코드가 필요합니다.");
    throw new NotExistsError("인증 코드가 필요합니다.");
  }
  logger.debug(`[checkAuthorizationCode] 인증 코드: ${authorizationCode}`);
};

export const checkIfUserExists = async (data) => {
  const info = await User.findOne({
    attributes: ["user_id", "name", "nickname"],
    include: [
      {
        model: UserOauth,
        as: "user_oauths",
        attributes: ["user_id"],
        where: {
          oauth_type: "kakao",
          oauth_id: data.oauth_id,
        },
      },
    ],
  });

  if (!info) {
    logger.error("[checkIfUserExist] 가입되어 있지 않은 사용자입니다.");
    return false;
  }

  return {
    user_id: info.user_id,
    name: info.name,
    nickname: info.nickname,
  };
};

export const createTokens = async (data) => {
  const accessToken = createAccessToken({
    user_id: data.user_id,
    name: data.name,
    nickname: data.nickname,
  });
  const refreshToken = await createRefreshToken(data.user_id);

  return { accessToken, refreshToken };
};

export const createResponse = (data) => {
  return {
    user_id: encrypt62(data.user_id),
    name: data.name,
    nickname: data.nickname,
  };
};

export const createScript = (data) => {
  return `
    <script>
      window.opener.postMessage(${JSON.stringify(data)}, '${FRONTEND_URL}');
      window.close();
    </script>
  `;
};
