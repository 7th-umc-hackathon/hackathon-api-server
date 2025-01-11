import config from "../../config.json";
import { logError } from "../../utils/handlers/error.logger";
import kakaoService from "../../services/auth/kakao.auth.service";
import { refreshTokenCookieOptions } from "../../options";

const { KAKAO_REST_API_KEY, KAKAO_REDIRECT_URI } = config.KAKAO;

export const kakaoLogin = async (req, res, next) => {
  try {
    const redirectUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_REST_API_KEY}&redirect_uri=${KAKAO_REDIRECT_URI}&response_type=code`;
    res.redirect(redirectUrl);
  } catch (error) {
    logError(error);
    next(error);
  }
};

/**
 * 카카오 OAuth 콜백을 처리하는 컨트롤러.
 * @param {Object} req - Express 요청 객체.
 * @param {Object} res - Express 응답 객체.
 */
export const kakaoCallback = async (req, res, next) => {
  try {
    const authorizationCode = req.query.code;
    // 0. 카카오 인증 코드가 유효한지 확인
    kakaoService.checkAuthorizationCode(authorizationCode);
    // 1. 카카오에 인증 코드를 보내서 액세스 토큰을 받아옴
    const kakaoAccessToken =
      await kakaoService.getKakaoAccessToken(authorizationCode);
    // 2. 받아온 액세스 토큰으로 카카오 사용자 정보를 조회
    const kakaoUserInfo = await kakaoService.getKakaoUserInfo(kakaoAccessToken);
    // 3. 조회한 사용자 정보로 우리 DB에 사용자 정보를 조회
    const stUser = await kakaoService.checkIfUserExists(kakaoUserInfo);
    // 4-1. DB에 사용자 정보가 없다면 사용자 정보를 담아서 return
    if (!stUser) {
      return res.status(202).send(
        kakaoService.createScript({
          is_registered: false,
          id: kakaoUserInfo.oauth_id,
          email: kakaoUserInfo.email,
        })
      );
    }
    // 4-2. DB에 사용자 정보가 있다면 토큰 발급
    const { accessToken, refreshToken } =
      await kakaoService.createTokens(stUser);
    // 4-3. 보낼 정보 생성
    const resData = kakaoService.createResponse(stUser);
    return res
      .status(200)
      .cookie("SPECTOGETHER_RT", refreshToken, refreshTokenCookieOptions)
      .send(
        kakaoService.createScript({
          is_registered: true,
          user_info: JSON.stringify(resData),
          access_token: accessToken,
        })
      );
  } catch (error) {
    logError(error);
    next(error);
  }
};
