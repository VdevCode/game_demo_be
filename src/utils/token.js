const { v4: uuidv4 } = require("uuid");

function generateString() {
  let string = uuidv4();
  string.substring(0, 32);
  return string;
}
function isTokenExpired(token) {
  // Lấy thời gian hiện tại
  const currentTime = new Date();
  // Lấy thời gian tạo token dưới dạng số mili-giây từ epoch
  const tokenCreationTime = new Date(token.created_at).getTime();
  // Tính thời gian đã trôi qua kể từ khi tạo token
  const elapsedTime = currentTime - tokenCreationTime;
  // Xác định xem đã qua 24 giờ hay chưa
  const twentyFourHoursInMilliseconds = 24 * 60 * 60 * 1000;
  return elapsedTime >= twentyFourHoursInMilliseconds;
}

module.exports = { isTokenExpired, generateString };
