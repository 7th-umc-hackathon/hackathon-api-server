import express from "express";

const router = express.Router();

router.get("/", (req, res) => res.success({ message: "Good To Go" }));

export default router;
