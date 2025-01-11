import express from "express";
import * as registerController from "../controllers/auth/register.auth.controller.js";
import * as loginController from "../controllers/auth/login.auth.controller.js";

const router = express.Router();

// 모든 도시 가져오기

// id가 unqiue한지 체크하기

// 로컬 로그인
router.post("/login/local", loginController.userLogin);

// 로컬 회원가입
router.post("/contries", registerController.userRegister);

// 토큰 reissue

// id 찾기

// pw 찾기

router.get("/teapot", (res) => res.status(418).send("I'm a teapot"));

export default router;

// 하단에는 swagger 작성
