import registerService from "../../services/auth/register.auth.service";
import { logError } from "../../utils/handlers/error.logger";

export const userRegister = async (req, res, next) => {
  /*
  1. 미들웨어에서 데이터 검증
  2. 이미 존재하는 사용자인지 확인하기 (전화번호가 중복하는지 확인)
  3. 핸드폰번호는 인증세션 ID를 제공
    해당 인증세션이 인증되었는지 확인하기
    * 현재는 인증완료되면 지우도록 되어 있는데 수정 필요
  4. name, nickname, birhdate, phone_verify_session_id, email 
    제공할 필요 있음, 이때 profile_image는 서버측에서 default로 입력
  5. 사용자가 동의한 약관 정보 저장하기
  */
  try {
    // 2. 이미 존재하는 사용자인지 확인하기
    // 2-1. 인증 세션에서 핸드폰번호 가져오기
    const phoneNumber = await registerService.getPhoneNumberByVerificationId(
      req.body.phone_verification_session_id
    );
    // 2-2. 해당 핸드폰번호로 이미 사용자가 존재하는지 확인하기
    await registerService.checkIfUserExistsByPhoneNumber(phoneNumber);
    req.body.phone_number = phoneNumber;
    // 3. 사용자 생성하기 - local, oauth 구분해서
    if (req.body.register_type === "local") {
      await registerService.createNewLocalUser(req.body);
    } else if (req.body.register_type === "oauth") {
      await registerService.createNewOauthUser(req.body);
    }

    return res.status(201).json({
      message: "회원가입에 성공했습니다.",
    });
  } catch (err) {
    logError(err);
    next(err);
  }
};

export const getTerms = async (req, res, next) => {
  try {
    const terms = await registerService.getCurrentActiveTerms();
    return res.status(200).json({
      terms,
    });
  } catch (err) {
    logError(err);
    next(err);
  }
};
