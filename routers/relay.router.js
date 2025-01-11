import express from "express";
import * as aiController from "../controllers/relays/gpt.relays.controller.js";
//import validate from "../middleware/validate";
import {
  handleGetUserRelayHistory,
  handleUserCurrentRelayGet,
} from "../controllers/relays/check.relays.controller.js";
import { authenticateAccessToken } from "../middleware/authenticate.jwt.js";

import * as multerMiddleware from "../middleware/upload/multer.image.js";

const router = express.Router();

//사용자가 현재 진행중인 릴레이 (메인화면)
router.get("/current", authenticateAccessToken, handleUserCurrentRelayGet);

//사용자의 릴레이 이력 조회 (마이페이지)
router.get("/historys", authenticateAccessToken, handleGetUserRelayHistory);

// 미션 받아오기
router.get("/mission", aiController.getMission);

// 미션 완료 여부 검증
router.post(
  "/mission/complete",
  multerMiddleware.singleImage,
  aiController.missionComplete
);

// 이미지 설명
router.post(
  "/explain",
  multerMiddleware.singleImage,
  aiController.explainImage
);

export default router;
