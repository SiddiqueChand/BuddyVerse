const mongoose = require("mongoose");

const downloadLogSchema = new mongoose.Schema({
  pdfId: { type: mongoose.Schema.Types.ObjectId, ref: "Pdf" },
  pdfTitle: String,
  filename: String,
  downloadedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.models.DownloadLog || mongoose.model("DownloadLog", downloadLogSchema);
