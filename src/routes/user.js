const express = require("express");
const router = express.Router();
const UserController = require("../app/controllers/UserController");

router.post("/sendOTP", UserController.sendOTP);
router.post("/register", UserController.register);
router.patch("/major/:phone", UserController.addMajorByPhone);
router.post("/saveHistory/:phone", UserController.addHistoryByPhone);
router.get("/ranking", UserController.getRanking);
router.get("/myRanking/:phone", UserController.getMyRanking);
router.get("/download", UserController.exportFileXlsx);

// Export
module.exports = router;
