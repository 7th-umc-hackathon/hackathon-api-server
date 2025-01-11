import express from "express";
import registerController from "../controllers/auth/register.auth.controller";
import loginController from "../controllers/auth/login.auth.controller";
import kakaoController from "../controllers/auth/kakao.auth.controller";
import authValidator from "../utils/validators/auth.validators";
import validate from "../middleware/validate";

const router = express.Router();

// 24.12.24 다시 작성하였음

// 회원가입
router.post(
  "/register",
  validate(authValidator.userRegister),
  registerController.userRegister
);

// 로컬 로그인
router.post(
  "/login/local",
  validate(authValidator.userLogin),
  loginController.localLogin
);
// 카카오 로그인
router.get("/login/kakao", kakaoController.kakaoLogin);
router.get("/login/kakao/callback", kakaoController.kakaoCallback);
// 로그아웃
router.get("/logout", loginController.logout);

// AT 재발급
router.get("/token/reissue", loginController.reissueAccessToken);

router.get("/terms", registerController.getTerms);
// 24.12.24 terms 삭제 처리, test user 생성 코드도 삭제 처리
// terms는 다시 작성완료

router.post(
  "/password/reset",
  validate(authValidator.resetPassword),
  loginController.resetPassword
);

router.post(
  "/password/change",
  validate(authValidator.changePassword),
  loginController.changePassword
);

router.get("/teapot", (res) => res.status(418).send("I'm a teapot"));

export default router;

// 하단에는 swagger 작성
