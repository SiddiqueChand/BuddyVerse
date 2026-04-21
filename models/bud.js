const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const budSchema = new mongoose.Schema({
  BudName: { type: String, required: true },
  BudEmail: { type: String, required: true, unique: true },
  BudContactNumber: { type: String, required: true, trim: true, maxlength: 10 },
  BudStream: { type: String, required: true },
  BudYear: { type: String, required: true },
  BudID: { type: String, required: true, unique: true },
  BudPassword: { type: String, required: true, trim: true, minlength: 8 },
  BudProfile_pic: { type: Buffer },
  AssignedBuddy: { type: mongoose.Schema.Types.ObjectId, ref: "Buddy" },
  tokens: [{ token: { type: String, required: true } }]
});

// Hash password before saving
budSchema.pre("save", async function (next) {
  if (!this.isModified("BudPassword")) return next();
  const salt = await bcrypt.genSalt(10);
  this.BudPassword = await bcrypt.hash(this.BudPassword, salt);
  next();
});

// Find Bud by Credentials
budSchema.statics.findByCredentials = async function (username, password) {
  const bud = await this.findOne({ BudID: { $eq: username } });
  if (!bud) throw new Error("Invalid username or password");

  const isMatch = await bcrypt.compare(password, bud.BudPassword);
  if (!isMatch) throw new Error("Invalid username or password");

  return bud;
};

// Generate Token
budSchema.methods.generateAuthToken = async function () {
  const token = jwt.sign({ _id: this._id.toString() }, "yourSecretKey", { expiresIn: "1h" });
  this.tokens = this.tokens.concat({ token });
  await this.save();
  return token;
};

const Bud = mongoose.model("Bud", budSchema);
module.exports = Bud;
