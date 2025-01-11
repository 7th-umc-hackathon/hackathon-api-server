import express from "express";
//import validate from "../middleware/validate";
import { handleUserCurrentRelayGet } from "../controllers/relays/check.relays.controller.js";

const router = express.Router();

//사용자가 현재 진행중인 릴레이 (메인화면)
router.get("/current",authenticateToken,handleUserCurrentRelayGet);

export default router;