import logger from "../../logger";
import { refreshTokenCookieOptions } from "../../options";
import loginService from "../../services/auth/login.auth.service";
import tokenService from "../../services/auth/auth.token.service";
import { encrypt62 } from "../../utils/encrypt.util";
import { logError } from "../../utils/handlers/error.logger";
import registerService from "../../services/auth/register.auth.service";

const localLogin = async (req, res, next) => {
  try {
    const data = await loginService.getUserPasswordByPhoneNumber(
      req.body.login_id
    );
    await loginService.comparePassword({
      password: req.body.password,
      hashed_password: data.password,
    });

    const accessToken = tokenService.createAccessToken({
      user_id: data.user_id,
      name: data.name,
      nickname: data.nickname,
    });
    const refreshToken = await tokenService.createRefreshToken(data.user_id);

    logger.debug(
      `[localLogin] 토큰 발급 완료\
      \nAT : ${accessToken}\
      \nRT : ${refreshToken}`
    );

    const ret = {
      user_id: encrypt62(data.user_id),
      name: data.name,
      nickname: data.nickname,
    };

    logger.debug(`[localLogin] 응답 데이터: ${JSON.stringify(ret, null, 2)}`);

    return res
      .status(200)
      .cookie("SPECTOGETHER_RT", refreshToken, refreshTokenCookieOptions)
      .success({
        user: ret,
        access_token: accessToken,
      });
  } catch (err) {
    logError(err);
    next(err);
  }
};

const logout = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.SPECTOGETHER_RT;
    const isTokenExist = tokenService.checkIfRefreshTokenExists(refreshToken);
    if (isTokenExist) await loginService.deleteRefreshToken(refreshToken);

    return res.status(200).clearCookie("SPECTOGETHER_RT").success({
      message: "로그아웃 되었습니다.",
    });
  } catch (err) {
    logError(err);
    next(err);
  }
};

const reissueAccessToken = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.SPECTOGETHER_RT;
    tokenService.checkIfRefreshTokenExists(refreshToken);
    const decodedToken = await tokenService.isRefreshTokenValid(refreshToken);
    const data = await loginService.getUserInfoByEncryptedUserId(
      decodedToken.user_id
    );
    const accessToken = tokenService.createAccessToken({
      user_id: data.user_id,
      name: data.name,
      nickname: data.nickname,
    });

    return res.status(200).success({
      access_token: accessToken,
    });
  } catch (err) {
    logError(err);
    next(err);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const phone = await registerService.getPhoneNumberByVerificationId(
      req.body.phone_verification_session_id
    );
    await loginService.setPassword({
      phone: phone,
      newPassword: req.body.new_password,
    });

    return res.status(200).success({
      message: "비밀번호가 초기화되었습니다.",
    });
  } catch (err) {
    logError(err);
    next(err);
  }
};

const changePassword = async (req, res, next) => {
  try {
    const phone = await registerService.getPhoneNumberByVerificationId(
      req.body.phone_verification_session_id
    );
    const oldData = await loginService.getUserPasswordByPhoneNumber(phone);
    await loginService.comparePassword({
      password: req.body.old_password,
      hashed_password: oldData.password,
    });
    await loginService.setPassword({
      phone: phone,
      newPassword: req.body.new_password,
    });

    return res.status(200).success({
      message: "비밀번호가 변경되었습니다.",
    });
  } catch (err) {
    logError(err);
    next(err);
  }
};

export {
  localLogin,
  logout,
  reissueAccessToken,
  resetPassword,
  changePassword,
};
