const express = require("express");
const router = express.Router();

const GiftController = require("../app/controllers/GiftController");

router.get("/", GiftController.getAll);
router.patch("/addOwner/:id", GiftController.updateOwner);
router.get("/getGiftUpdate", GiftController.getDataUpdate);
router.patch("/update", GiftController.updateGift);
router.get("/download", GiftController.exportFileXlsx);
// Export
module.exports = router;
