const { User, validate } = require("../models/User");
const excelJs = require("exceljs");
const axios = require("axios");
const tokenUtils = require("../../utils/token");
const CryptoJS = require("crypto-js");

let token = undefined;
async function getToken() {
  if (!token || tokenUtils.isTokenExpired(token)) {
    const session_id = tokenUtils.generateString();
    const data = {
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      scope: "send_brandname_otp send_brandname",
      session_id,
      grant_type: "client_credentials",
    };
    const response = await axios.post(process.env.OTP_CONNECT, data);
    const now = new Date();
    token = {
      access_token: response.data.access_token,
      created_at: now.toLocaleString(),
    };
  }
  return token;
}
class UserController {
  async sendOTP(req, res) {
    token = await getToken();
    const { phone, code } = req.body;
    const session_id = tokenUtils.generateString();
    const plaintext =
      "Chào mừng bạn đến với trò chơi FlappyBee, để xác thực tài khoản vui lòng nhập mã sau: " +
      code;
    const encodedMsg = CryptoJS.enc.Base64.stringify(
      CryptoJS.enc.Utf8.parse(plaintext)
    );
    const data = {
      access_token: token.access_token,
      session_id,
      BrandName: "FPOLY",
      Phone: phone,
      Message: encodedMsg,
      RequestId: "tranID-Core01-987654321",
    };
    const response = await axios.post(
      "https://app.sms.fpt.net/api/push-brandname-otp",
      data
    );
    return res.status(200).send({ data: "Đã gửi tin nhắn thành công" });
  }
  async register(req, res) {
    const data = req.body;
    // Check email & phone
    const isPhoneExist = await User.findOne({ phone: data.phone });
    if (isPhoneExist)
      return res.status(200).send({
        message: "Login Successfull",
        data: isPhoneExist.toObject(),
      });
    // Validate
    const { error } = validate(data);
    if (error)
      return res.status(400).send({ message: error.details[0].message });
    // Saving
    data.isValidAccount = true;
    const newUser = await new User(data).save();
    return res.status(200).send({
      message: "Create successfull",
      data: newUser.toObject(),
    });
  }
  async addHistoryByPhone(req, res) {
    const phone = req.params.phone;
    const data = req.body;
    const user = await User.findOne({ phone: phone });
    if (!user)
      return res.status(404).send({
        message: "Not found your account",
      });
    // Saving
    let newData = user.toObject();
    // Update score
    const newPoints =
      newData.highestScore < data.coins ? data.coins : newData.highestScore;
    newData = { ...newData, highestScore: newPoints };
    // Saving
    const response = await User.findByIdAndUpdate(newData._id, newData);
    return res
      .status(200)
      .send({ message: "Your turn was saved", data: newData });
  }
  async getRanking(req, res) {
    try {
      const data = await User.find().sort({ highestScore: -1 }).limit(5).exec();
      return res.status(200).send({
        message: "Ranking",
        data,
      });
    } catch (error) {
      throw new Error(error);
    }
  }
  async getMyRanking(req, res) {
    try {
      const phone = req.params.phone;
      const users = await User.find()
        .sort({ highestScore: -1 })
        .limit(100)
        .exec();

      let userRank = users.findIndex((user) => user.phone === phone);
      let userData = {};

      if (userRank !== -1) {
        userData = users[userRank];
        userRank += 1;
      } else {
        userRank = "100+";
      }

      return res.status(200).send({
        message: "Ranking",
        userRank,
        userData,
      });
    } catch (error) {
      throw new Error(error);
    }
  }
  async exportFileXlsx(req, res) {
    try {
      const users = await User.find({}).exec();
      const workbook = new excelJs.Workbook();
      const sheet = workbook.addWorksheet("data");
      sheet.columns = [
        { header: "Số thứ tự", key: "idx", width: 25 },
        { header: "Họ và tên", key: "name", width: 25 },
        { header: "Số điện thoại", key: "phone", width: 25 },
        { header: "Email", key: "email", width: 25 },
        { header: "Địa chỉ", key: "address", width: 25 },
        { header: "Tên trường THPT", key: "school", width: 25 },
        { header: "Ngành học quan tâm", key: "major", width: 25 },
      ];
      users.map((user, idx) => {
        sheet.addRow({
          idx: idx + 1,
          name: user.name,
          phone: user.phone,
          email: user.email,
          address: user.address,
          school: user.school,
          major: user.majors[0] ? user.majors[0] : "Không xác định",
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
  async addMajorByPhone(req, res) {
    const major = req.body.major;
    const phone = req.params.phone;
    const user = await User.findOne({ phone });
    if (!user)
      return res.status(404).send({
        message: "Không tim thấy tài khoản của bạn",
      });
    let update = user.toObject();
    const majors = update.majors;
    const isExist = majors.find((item) => item.includes(major)) ? true : false;
    if (!isExist) update.majors.push(major);
    // Saving
    const response = await User.findByIdAndUpdate(update._id, update);
    return res.status(200).send({
      message: "Update was sucessfull",
    });
  }
}

module.exports = new UserController();
