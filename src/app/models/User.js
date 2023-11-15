const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Joi = require("joi");

const userSchema = new mongoose.Schema(
  {
    email: { type: String, default: "Trống" },
    name: { type: String, default: "Không xác định" },
    school: { type: String, default: "Trống" },
    phone: { type: String, default: "" },
    highestScore: { type: Number, default: 0 },
    history: { type: Array, default: [] },
    isValidAccount: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Validator
const phoneRegex = /^(0[1-9])+([0-9]{8})\b/;
const validate = (user) => {
  const Schema = Joi.object({
    phone: Joi.string().pattern(phoneRegex),
    name: Joi.string(),
    email: Joi.allow(),
    school: Joi.allow(),
  });
  return Schema.validate(user);
};

// Create Model
const User = mongoose.model("User", userSchema);

// Export
module.exports = { User, validate };
