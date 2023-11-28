const mongoose = require("mongoose");

let connect = async () => {
  try {
    const url = process.env.DB_CONNECT_LINK;
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: "flappybee",
    });
    console.log("Database connection has been complete!");
  } catch (error) {
    console.log(error);
    console.log("Failed to connection database!!!");
  }
};

module.exports = { connect };
