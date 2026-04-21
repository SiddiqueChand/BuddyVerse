// models/Pair.js
const mongoose = require("mongoose");

const pairSchema = new mongoose.Schema({
  buddy: {
    BuddyID: { type: String, required: true },
    BuddyName: { type: String, required: true }
  },
  buds: [
    {
      BudID: { type: String, required: true },
      BudName: { type: String, required: true }
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Pair = mongoose.model("Pair", pairSchema);
module.exports = Pair;
