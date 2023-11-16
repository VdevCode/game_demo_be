const mongoose = require("mongoose");

const giftSchema = new mongoose.Schema(
  {
    name: { type: String, default: "" },
    total: { type: Number, default: 0 },
    owners: { type: Array, default: [] },
  },
  { timestamps: true }
);

// Create Model
const Gift = mongoose.model("Gift", giftSchema);

// Export
module.exports = { Gift };
