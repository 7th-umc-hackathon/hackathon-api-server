import * as registerService from "../../services/auth/register.auth.service.js";
import { logError } from "../../utils/handlers/error.logger.js";
import logger from "../../utils/logger/logger.js";

export const userRegister = async (req, res, next) => {
  /*
    {
      "login_id": "login_id",
      "password": "password",
      "name": "name",
      "nickname" : "nickname",
      "country_id": "country_id"
    }

    이러한 방식으로 요청 넣을 것임.
    encrypt 해서 넣기
  */
  try {
    // (나중에) 이미 존재하는 사용자인지 검토

    // 사용자 등록
    const user = await registerService.userRegister(req.body);
    logger.info(`회원가입 성공: ${user.login_id}`);

    return res.status(201).json({
      message: "회원가입에 성공했습니다.",
    });
  } catch (err) {
    logError(err);
    next(err);
  }
};

export const getCountries = async (req, res, next) => {
  try {
    const countries = await registerService.getCountries();
    res.status(200).success(countries);
  } catch (err) {
    logError(err);
    next(err);
  }
};

export const checkIdUnique = async (req, res, next) => {
  try {
    const { login_id } = req.body;
    const isUnique = await registerService.checkIdUnique(login_id);
    res.status(200).success({ message: "사용 가능한 아이디입니다." });
  } catch (err) {
    logError(err);
    next(err);
  }
};
