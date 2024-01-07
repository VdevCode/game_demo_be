const express = require("express");
const router = express.Router();
const UserController = require("../app/controllers/UserController");

router.get("/checkExist/:phone", UserController.login);
router.post("/sendOTP", UserController.sendOTP);
router.post("/register", UserController.register);
router.patch("/major/:phone", UserController.addMajorByPhone);
router.post("/saveHistory/:phone", UserController.addHistoryByPhone);
router.get("/ranking", UserController.getRanking);
router.get("/myRanking/:phone", UserController.getMyRanking);
router.get("/download", UserController.exportFileXlsx);
router.get("/getDataForAdmin", UserController.getDataByAdmin);
router.patch("/editUserByPhone/:phone", UserController.editUserByPhone);
router.delete("/deleteUserByPhone/:phone", UserController.deleteUserByPhone);

// Export
module.exports = router;
