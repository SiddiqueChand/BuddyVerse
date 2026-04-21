const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const adminSchema = new mongoose.Schema({
  adminUsername: { type: String, required: true, unique: true, trim: true },
  adminPassword: { type: String, required: true, trim: true, minlength: 8 },
  adminNumber: { type: Number, required: true, trim: true, unique: true, maxlength: 10 },
  adminEmail: { type: String, required: true, unique: true, trim: true },
  adminStream: { type: String, required: true, trim: true },
  profilePic: { type: Buffer },
  tokens: [{ token: { type: String, required: true } }]
});

// Hash password before saving
adminSchema.pre("save", async function (next) {
  if (!this.isModified("adminPassword")) return next();
  const salt = await bcrypt.genSalt(10);
  this.adminPassword = await bcrypt.hash(this.adminPassword, salt);
  next();
});

// Find admin by credentials (NoSQL injection proof)
adminSchema.statics.findByCredentials = async function (username, password) {
  const admin = await this.findOne({ adminUsername: { $eq: username } });
  if (!admin) throw new Error("Invalid username or password");

  const isMatch = await bcrypt.compare(password, admin.adminPassword);
  if (!isMatch) throw new Error("Invalid username or password");

  return admin;
};

// Generate JWT Token
adminSchema.methods.generateAuthToken = async function () {
  const token = jwt.sign({ _id: this._id.toString() }, "yourSecretKey", { expiresIn: "1h" });
  this.tokens = this.tokens.concat({ token });
  await this.save();
  return token;
};

const Admin = mongoose.model("Admin", adminSchema);
module.exports = Admin;
