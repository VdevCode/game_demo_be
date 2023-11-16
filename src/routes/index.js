const giftRoutes = require("./gift");
const userRoutes = require("./user");

function route(app) {
  app.use("/api/user", userRoutes);
  app.use("/api/gift", giftRoutes);
}

module.exports = route;
