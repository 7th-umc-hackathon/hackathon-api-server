import {
  InvalidInputError,
  AlreadyExistsError,
  ServiceImplementationError,
} from "../../errors";
import { decrypt62, generateHashedPassword } from "../../utils/encrypt.util";
import {
  User,
  UserLocal,
  VerificationCode,
  UserOauth,
  UserTerm,
  Term,
} from "../../models";
import logger from "../../logger";

// /auth/register

// 핸드폰번호 인증 세션으로 핸드폰번호 가져오기
const getPhoneNumberByVerificationId = async (encryptedId) => {
  const id = decrypt62(encryptedId);
  const result = await VerificationCode.findByPk(id, {
    attributes: ["identifier_type", "identifier_value", "is_verified"],
  });
  // 해당 세션 ID가 존재하지 않는 경우
  if (!result) {
    logger.error(
      `[getPhoneNumberByVerificationId] 존재하지 않는 세션 ID: ${id}`
    );
    throw new InvalidInputError("인증 세션이 존재하지 않습니다.");
  }
  // 해당 세션이 핸드폰번호로 인증되지 않은 경우
  if (result.identifier_type !== "phone") {
    logger.error(
      `[getPhoneNumberByVerificationId] 핸드폰번호로 인증되지 않은 세션 ID: ${id}`
    );
    throw new InvalidInputError("올바르지 않은 인증 세션입니다.");
  }
  // 해당 세션이 인증되지 않은 경우
  if (!result.is_verified) {
    logger.error(
      `[getPhoneNumberByVerificationId] 인증되지 않은 세션 ID: ${id} ${result.is_verified}`
    );
    throw new InvalidInputError("인증되지 않은 세션입니다.");
  }
  logger.debug(
    `[getPhoneNumberByVerificationId] 핸드폰번호: ${result.identifier_value}`
  );
  return result.identifier_value;
};

// 핸드폰번호로 이미 존재하는 사용자인지 확인하기
const checkIfUserExistsByPhoneNumber = async (phoneNumber) => {
  const result = await User.findOne({
    where: {
      phone_number: phoneNumber,
    },
  });
  // 이미 존재하는 사용자인 경우
  if (result) {
    throw new AlreadyExistsError("해당 전화번호로 가입된 사용자가 존재합니다.");
  }
  // 가입 가능; 존재하지 않는 사용자인 경우
  return true;
};

// service 내부에서 사용됩니다.
const createNewUser = async (data) => {
  // user 테이블에 먼저 정보 저장
  const newUser = await User.create({
    name: data.name,
    nickname: data.nickname,
    birthdate: data.birthdate,
    phone_number: data.phone_number,
    email: data.email,
    profile_image: "https://picsum.photos/200",
  });
  return newUser.user_id;
};
// service 내부에서 사용됩니다.
const inputUserAgreedTerms = async (data) => {
  for (const term of data.terms) {
    await UserTerm.create({
      user_id: data.new_user_id,
      term_id: term.term_id,
      is_agreed: term.is_agreed,
    });
  }
};

const createNewOauthUser = async (data) => {
  data.new_user_id = await createNewUser(data);
  // oauth 테이블에 oauth 정보 저장
  await UserOauth.create({
    user_id: data.new_user_id,
    oauth_type: data.oauth_type,
    oauth_id: data.oauth_id,
  });
  // 사용자가 동의한 약관 정보 저장
  await inputUserAgreedTerms(data);
  return true;
};

const createNewLocalUser = async (data) => {
  data.new_user_id = await createNewUser(data);
  const hashedPassword = await generateHashedPassword(data.password);
  // user_local에 마저 저장
  await UserLocal.create({
    user_id: data.new_user_id,
    password: hashedPassword,
  });
  // 사용자가 동의한 약관 정보 저장
  await inputUserAgreedTerms(data);
  return true;
};

const getCurrentActiveTerms = async () => {
  const terms = await Term.findAll({
    attributes: [
      "term_id",
      "name",
      "description",
      "is_required",
      "term_version",
    ],
    where: {
      status: true,
    },
  });
  if (!terms) {
    logger.error("[getCurrentActiveTerms] 활성화된 약관이 존재하지 않습니다.");
    throw new ServiceImplementationError("활성화된 약관이 존재하지 않습니다.");
  }

  return terms;
};

export {
  getPhoneNumberByVerificationId,
  checkIfUserExistsByPhoneNumber,
  createNewOauthUser,
  createNewLocalUser,
  getCurrentActiveTerms,
};
