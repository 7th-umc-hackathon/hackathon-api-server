import { NotExistsError } from "../../errors";
import logger from "../../logger";
import { User, UserLocal, UserRefreshToken } from "../../models";
import encryptUtil from "../../utils/encrypt.util";
import jwt from "jsonwebtoken";

// 핸드폰번호로 이미 존재하는 사용자인지 확인하기
const getUserPasswordByPhoneNumber = async (phoneNumber) => {
  const result = await UserLocal.findOne({
    attributes: ["password"],
    include: {
      model: User,
      as: "user", // 'as' 키워드를 사용하여 별칭을 지정합니다.
      where: {
        phone_number: phoneNumber,
      },
      attributes: ["user_id", "name", "nickname"],
    },
  });
  // 존재하지 않는 사용자에 대한 로그인 요청
  if (!result) {
    logger.error(
      `[getUserPasswordByPhoneNumber] 존재하지 않는 사용자입니다.\n전화번호 : ${phoneNumber}`
    );
    throw new NotExistsError("존재하지 않는 사용자입니다.");
  }

  return {
    user_id: result.user.user_id,
    name: result.user.name,
    nickname: result.user.nickname,
    password: result.password,
  };
};

const comparePassword = async (data) => {
  // 비밀번호 비교
  await encryptUtil.comparePassword(data.password, data.hashed_password);
  // 비밀번호가 일치하는 경우
  logger.debug("[comparePassword] 비밀번호 일치");
  return true;
};

// 로그아웃

// 리프레시 토큰 삭제
// 삭제된게 없을 경우 에러
const deleteRefreshToken = async (token) => {
  const num = await UserRefreshToken.destroy({
    where: {
      refresh_token: token,
    },
  });

  if (num === 0) {
    logger.error(
      `[deleteRefreshToken] 존재하지 않는 리프레시 토큰입니다.\nRT : ${token}`
    );
    return false;
    // throw new NotExistsError("존재하지 않는 리프레시 토큰입니다.");
  }
  return true;
};

// AT 재발급
const getUserInfoByEncryptedUserId = async (encryptedId) => {
  const id = encryptUtil.decrypt62(encryptedId);
  const user = await User.findByPk(id, {
    attributes: ["user_id", "name", "nickname"],
  });
  return {
    user_id: user.user_id,
    name: user.name,
    nickname: user.nickname,
  };
};

const setPassword = async ({ phone, newPassword }) => {
  const user = await UserLocal.findOne({
    include: {
      model: User,
      as: "user",
      where: {
        phone_number: phone,
      },
    },
  });

  if (!user) {
    logger.error(
      `[setPassword] 존재하지 않는 사용자입니다.\n전화번호 : ${phone}`
    );
    throw new NotExistsError("존재하지 않는 사용자입니다.");
  }
  const hashedPassword = await encryptUtil.generateHashedPassword(newPassword);
  user.password = hashedPassword;
  await user.save();

  logger.debug(`[setPassword] 비밀번호 변경 완료\n전화번호 : ${phone}`);
  return true;
};

export {
  getUserPasswordByPhoneNumber,
  comparePassword,
  deleteRefreshToken,
  getUserInfoByEncryptedUserId,
  setPassword,
};
