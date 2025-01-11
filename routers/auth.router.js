import express from "express";
import * as registerController from "../controllers/auth/register.auth.controller.js";
import * as loginController from "../controllers/auth/login.auth.controller.js";
import * as authMiddleware from "../middleware/authenticate.jwt.js";

const router = express.Router();

// 모든 도시 가져오기
router.get("/countries", registerController.getCountries);

// id가 unqiue한지 체크하기

// 로컬 로그인
router.post("/login/local", loginController.userLogin);

// 로컬 회원가입
router.post("/register/local", registerController.userRegister);

// 미들웨어 테스트
router.get(
  "/check-token",
  authMiddleware.authenticateAccessToken,
  (req, res) => {
    res.status(200).success({
      message: "토큰이 유효합니다.",
      user: req.user,
    });
  }
);

// id 찾기

// pw 찾기

router.get("/teapot", (res) => res.status(418).send("I'm a teapot"));

export default router;

// 하단에는 swagger 작성
