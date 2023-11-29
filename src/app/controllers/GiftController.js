const { Gift } = require("../models/Gift");
const { User } = require("../models/User");
const excelJs = require("exceljs");

class GiftController {
  async updateGift(req, res) {
    const giftsData = req.body.gifts;
    giftsData.map(async (item) => {
      const { _id, total } = item;
      const gift = await Gift.findById(item._id);
      const giftUpdate = gift.toObject();
      giftUpdate.total = total;
      // Saving
      const response = await Gift.findByIdAndUpdate(giftUpdate._id, giftUpdate);
    });
    const gifts = await Gift.find({});
    return res.status(200).send({
      message: "Update was successfull",
      data: gifts,
    });
  }
  async updateOwner(req, res) {
    const _id = req.params.id;
    const data = req.body;
    const user = await User.findOne({ phone: data.phone }).exec();
    const gift = await Gift.findById(_id).exec();
    // Không tồn tại
    if (!user && !gift)
      return res.status(404).send({
        message: "Error your message",
      });
    // Update
    if (user.gift)
      return res.status(404).send({
        messsage: "Maximum collectimes",
      });
    // Update
    let updateUser = user.toObject();
    let updateGift = gift.toObject();
    let giftsOwner = updateGift.owners;
    updateUser.gift = true;
    giftsOwner.push(data);
    updateGift.owners = giftsOwner;
    // Save
    await User.findByIdAndUpdate(updateUser._id, updateUser);
    await Gift.findByIdAndUpdate(updateGift._id, updateGift);

    return res.status(200).send({
      message: "Update gifts",
      data: updateUser,
    });
  }
  async getDataUpdate(req, res) {
    const gifts = await Gift.find({}).exec();
    return res.status(200).send({
      message: "All gift",
      data: gifts,
    });
  }
  async getAll(req, res) {
    // const gifts = await Gift.find({ total: { $gt: 0 } }).exec();
    const gifts = await Gift.find({ total: { $gt: 0 } }).exec();
    return res.status(200).send({
      message: "All gift",
      data: gifts,
    });
  }
  async exportFileXlsx(req, res) {
    try {
      const gifts = await Gift.find({}).exec();
      const workbook = new excelJs.Workbook();
      const sheet = workbook.addWorksheet("data");
      sheet.columns = [
        { header: "Số thứ tự", key: "idx", width: 25 },
        { header: "Họ và tên", key: "name", width: 25 },
        { header: "Số điện thoại", key: "phone", width: 25 },
        { header: "Quà nhận được", key: "gift", width: 25 },
      ];
      gifts.map((gift, idx) => {
        gift.owners.map((owner) => {
          sheet.addRow({
            idx: idx + 1,
            name: owner.name,
            phone: owner.phone,
            gift: gift.name,
          });
        });
      });
      // Thiết lập các header cho phản hồi HTTP
      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.setHeader("Content-Disposition", "data.xlsx");
      workbook.xlsx.write(res);
    } catch (error) {
      throw new Error(error);
    }
  }
}

module.exports = new GiftController();
