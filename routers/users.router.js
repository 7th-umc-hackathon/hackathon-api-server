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

router.get("/rank/user/list", profileController.userRankList);

router.get(
  "/rank/user/country",
  authMiddleware.authenticateAccessToken,
  profileController.myCountryRanking
);

router.get("/rank/country", profileController.countryRankingList);

// 리워드 수령
router.get("/:relay_user_id/claim-reward", authMiddleware.authenticateAccessToken,profileController.claimRewared);

export default router;
