const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Joi = require("joi");

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true },
    name: { type: String, default: "" },
    address: { type: String, default: "" },
    school: { type: String, default: "" },
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
    email: Joi.string().email().required(true),
    phone: Joi.string().pattern(phoneRegex).required(),
    name: Joi.string().required(true),
    school: Joi.string().required(),
    address: Joi.string().required(),
  });
  return Schema.validate(user);
};

// Create Model
const User = mongoose.model("User", userSchema);

// Export
module.exports = { User, validate };
