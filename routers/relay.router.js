import express from "express";
//import validate from "../middleware/validate";
import { handleGetUserRelayHistory, handleUserCurrentRelayGet } from "../controllers/relays/check.relays.controller.js";
import { authenticateAccessToken } from "../middleware/authenticate.jwt.js";
import { handleCreateNewRelay } from "../controllers/relays/create.relays.controller.js";

const router = express.Router();

//사용자가 현재 진행중인 릴레이 (메인화면)
router.get("/current",authenticateAccessToken,handleUserCurrentRelayGet);

//사용자의 릴레이 이력 조회 (마이페이지)
router.get("/historys",authenticateAccessToken,handleGetUserRelayHistory);

//새로운 릴레이 생성
router.post("/create",authenticateAccessToken,handleCreateNewRelay);

export default router;