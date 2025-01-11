import {
  User,
  EmailVerificationCode,
  Calendar,
  UserCalendar,
  Term,
  UserTerm,
  UserRefreshToken,
} from "../../models";
import { generateHashedPassword } from "../../utils/encrypt.util";
import authValidator from "../../utils/validators/auth/auth.validators";
import logger from "../../logger";
import {
  NotExistsError,
  NotAllowedError,
  DatabaseError,
  AlreadyExistsError,
  InvalidInputError,
  UnauthorizedError,
} from "../../errors";
import jwt from "jsonwebtoken";
import { SERVER } from "../../config.json";

const { JWT_SECRET } = SERVER;

export const validateRegisterInput = (data) => {
  const valid = authValidator.validateNewUserInputSchema(data);
  if (!valid) {
    throw new InvalidInputError({
      errors: authValidator.validateNewUserInputSchema.errors,
      message: "입력값이 올바르지 않습니다.",
    });
  }
  return {
    isValid: true,
    errors: null,
  };
};

export const validateLoginInput = (data) => {
  const valid = authValidator.validateLoginInputSchema(data);
  if (!valid) {
    throw new InvalidInputError({
      errors: authValidator.validateLoginInputSchema.errors,
      message: "입력값이 올바르지 않습니다.",
    });
  }
  return {
    isValid: true,
    errors: null,
  };
};

export const getEmailByEmailVerificationId = async (emailVerificationId) => {
  const email = await EmailVerificationCode.findByPk(emailVerificationId);
  logger.debug(
    `[getEmailByEmailVerificationId] email: ${JSON.stringify(email, null, 2)}`
  );

  if (!email) {
    throw new InvalidInputError("인증된 이메일이 아닙니다.");
  }
  return email;
};

export const createNewUser = async (user) => {
  const newUser = {
    name: user.name,
    nickname: user.nickname,
    password: user.password,
    birthdate: user.birthdate,
    phone_number: user.phone_number,
    email: user.email,
    profile_image: user.profile_image,
  };
  logger.debug(
    `[createNewUser] 새로운 사용자 생성: ${JSON.stringify(newUser, null, 2)}`
  );

  newUser.password = await generateHashedPassword(newUser.password);
  logger.debug(`[createNewUser] 암호화된 비밀번호: ${newUser.password}`);

  const createdUser = await User.create(newUser);
  logger.debug(
    `[createNewUser] 새로운 사용자 생성: ${JSON.stringify(createdUser, null, 2)}`
  );
  return createdUser;
};

export const createTestUser = async (name, email, phoneNumber) => {
  const user = {
    user_register_type: "local",
    name,
    nickname: "Johnny",
    birthdate: "1980-01-01",
    phone_number: phoneNumber,
    email,
    password: "password",
    profile_image: "binary data",
  };
  user.password = await generateHashedPassword(user.password);
  const newUser = await User.create(user);
  if (!newUser) throw new DatabaseError("테스트 유저 생성에 실패했습니다.");

  return newUser;
};

export const checkDuplicateUser = async (email, phoneNumber) => {
  logger.debug(
    `[checkDuplicateUser] email: ${email}, phoneNumber: ${phoneNumber}`
  );
  const result = await User.findOne({
    attributes: ["user_id"],
    where: {
      [Sequelize.Op.or]: [{ email }, { phone_number: phoneNumber }],
    },
  });

  if (result) {
    throw new AlreadyExistsError({
      message: "이미 존재하는 사용자입니다.",
      data: result,
    });
  }

  return result;
};

export const createCalendarForNewUser = async (userId) => {
  const calendar = await Calendar.create();
  const userCalendar = await UserCalendar.create({
    user_id: userId,
    calendar_id: calendar.calendar_id,
  });

  return userCalendar;
};

export const getUserInfo = async (loginId, password) => {
  const user = await User.findOne({
    attributes: ["user_id", "name", "nickname", "password"],
    where: {
      phone_number: loginId,
    },
  });
  if (!user) {
    throw new NotExistsError("가입되지 않은 사용자입니다.");
  }
  return user;
};

export const checkIfTokenIsValid = (token) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return { isValid: true, decoded };
  } catch (error) {
    throw new NotAllowedError("유효하지 않은 토큰입니다.");
  }
};

export const removeRefreshTokenFromDatabaseByTokenString = async (token) => {
  const result = await UserRefreshToken.destroy({
    where: {
      refresh_token: token,
    },
  });
  if (result === 0) {
    throw new NotExistsError("존재하지 않는 RT 입니다.");
  }
  logger.debug(
    `[removeRefreshTokenFromDatabaseByTokenString] 로그아웃 성공, ${result}개의 refresh token이 삭제되었습니다.`
  );
  return result;
};

export const checkIfRefreshTokenExistsByTokenString = async (token) => {
  const result = await UserRefreshToken.findOne({
    where: {
      refresh_token: token,
    },
  });

  if (!result) {
    throw new NotExistsError("존재하지 않는 RT 입니다.");
  }

  return result;
};

export const checkAndReturnRefreshTokenIfExistsInRequestCookie = (req) => {
  const refreshToken = req.cookies.SPECTOGETHER_RT;
  if (!refreshToken) {
    throw new UnauthorizedError("로그인 상태가 아닙니다.");
  }
  return refreshToken;
};

export const createUserAgreedTermsToDatabase = async (userId, terms) => {
  for (const term of terms) {
    const result = await UserTerm.create({
      term_id: term.term_id,
      user_id: userId,
      is_agreed: term.agreed,
    });
    if (!result) {
      throw new DatabaseError("약관 동의 정보 저장에 실패했습니다.");
    }
  }
  return;
};

export const getCurrentTerms = async () => {
  const terms = await Term.findAll({
    attributes: ["term_id", "name", "description", "is_required"],
    where: {
      status: "active",
    },
  });
  if (!terms) {
    throw new NotExistsError("약관 정보가 없습니다.");
  }

  return terms;
};
