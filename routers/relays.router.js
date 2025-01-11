import express from "express";
import {
    newAssign,
    assignConfirm,
    nextCountry,
    countryConfirm
} from "../controllers/relays/assign.relays.controller.js";
import { authenticateAccessToken } from "../middleware/authenticate.jwt.js";

const router = express.Router();

// 릴레이 배정
router.get("/", authenticateAccessToken, newAssign);

// 릴레이 배정 확정
router.post("/current", authenticateAccessToken, assignConfirm);

// 가능한 다음 국가 띄우기
router.get("/:relay_id/next/contries", authenticateAccessToken, nextCountry);

// 다음 국가 선택
router.post("/:relay_id/next", authenticateAccessToken, countryConfirm);

export default router;