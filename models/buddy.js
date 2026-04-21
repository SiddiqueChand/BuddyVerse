const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const buddySchema = new mongoose.Schema({
  BuddyName: { type: String, required: true },
  BuddyEmail: { type: String, required: true, unique: true },
  BuddyContactNumber: { type: String, required: true, trim: true, maxlength: 10 },
  BuddyStream: { type: String, required: true },
  BuddyYear: { type: String, required: true },
  BuddyID: { type: String, required: true, unique: true },
  BuddyPassword: { type: String, required: true, trim: true, minlength: 8 },
  BuddyProfile_pic: { type: Buffer },
  AssignedBuds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Bud" }],
  tokens: [{ token: { type: String, required: true } }]
});

// Hash password before saving
buddySchema.pre("save", async function (next) {
  if (!this.isModified("BuddyPassword")) return next();
  const salt = await bcrypt.genSalt(10);
  this.BuddyPassword = await bcrypt.hash(this.BuddyPassword, salt);
  next();
});

// Find Buddy by Credentials
buddySchema.statics.findByCredentials = async function (username, password) {
  const buddy = await this.findOne({ BuddyID: { $eq: username } });
  if (!buddy) throw new Error("Invalid username or password");

  const isMatch = await bcrypt.compare(password, buddy.BuddyPassword);
  if (!isMatch) throw new Error("Invalid username or password");

  return buddy;
};

// Generate Token
buddySchema.methods.generateAuthToken = async function () {
  const token = jwt.sign({ _id: this._id.toString() }, "yourSecretKey", { expiresIn: "1h" });
  this.tokens = this.tokens.concat({ token });
  await this.save();
  return token;
};

const Buddy = mongoose.model("Buddy", buddySchema);
module.exports = Buddy;
