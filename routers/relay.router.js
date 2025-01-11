import express from "express";
import * as aiController from "../controllers/relays/gpt.relays.controller.js";
//import validate from "../middleware/validate";
import {
  getRelayHistory,
  handleGetUserRelayHistory,
  handleUserCurrentRelayGet,
} from "../controllers/relays/check.relays.controller.js";
import { authenticateAccessToken } from "../middleware/authenticate.jwt.js";
import { handleCreateNewRelay } from "../controllers/relays/create.relays.controller.js";

import * as multerMiddleware from "../middleware/upload/multer.image.js";

const router = express.Router();

// 현재 진행 중인 릴레이를 조회 후 반환
router.get("/current", authenticateAccessToken, handleUserCurrentRelayGet);

// 릴레이 생성하기 - 현재 진행중인 릴레이가 없어야 함
router.post("/create", authenticateAccessToken, handleCreateNewRelay);

// 개인의 릴레이 이력 조회 -> 이건 프로필로 가야하는거 아닌가?
router.get("/history/user", authenticateAccessToken, handleGetUserRelayHistory);

// 릴레이의 과거 이력 조회 -> 과거가 앞에 있습니다
router.get(
  "/history/relay",
  // authenticateAccessToken,
  getRelayHistory
);

// 릴레이 생성 시 - mission 받아오기
router.get("/mission", aiController.getMission);

// 릴레이 진행 중 - mission 완료 처리하기
router.post(
  "/mission/complete",
  multerMiddleware.singleImage,
  aiController.missionComplete
);

// OpenAI test - 이미지를 설명해달라고 요구하기
router.post(
  "/explain",
  multerMiddleware.singleImage,
  aiController.explainImage
);

export default router;
