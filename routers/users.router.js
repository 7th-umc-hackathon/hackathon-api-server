import express from "express";
import * as authMiddleware from "../middleware/authenticate.jwt.js";
import * as profileController from "../controllers/users/profile.users.controller.js";

const router = express.Router();

router.get("/", (req, res) => res.success({ message: "Good To Go" }));

// 사용자 프로필 조회
router.get(
  "/profile",
  authMiddleware.authenticateAccessToken,
  profileController.userProfile
);

router.get(
  "/rank/user",
  authMiddleware.authenticateAccessToken,
  profileController.userRank
);

router.get(
  "/rank/country",
  authMiddleware.authenticateAccessToken,
  profileController.countryRank
);

// 리워드 수령
router.patch("/:relay_id/claim-reward", authMiddleware.authenticateAccessToken);

export default router;
