const express = require("express");
const multer = require("multer");
const pdf = require("../models/pdf");
const router = express.Router();

const storage = multer.memoryStorage(); // Store in memory before saving to DB
const upload = multer({ storage });

router.get("/upload", (req, res) => {
    res.render("upload");
  });  

// ✅ Upload a PDF file
router.post("/upload", upload.single("pdf"), async (req, res) => {
  try {
    const newPDF = new pdf({
      filename: req.file.originalname,
      data: req.file.buffer,
      contentType: req.file.mimetype,
    });

    await newPDF.save();
    req.flash( "success", "File uploaded successfully!");
    res.redirect("/file-upload");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const Pdf = require("../models/pdf");
const DownloadLog = require("../models/downloadLog");

router.get("/download/file/:filename", async (req, res) => {
  try {
    const file = await Pdf.findOne({ filename: req.params.filename });
    if (!file) return res.status(404).json({ message: "File not found" });

    // Increment total downloads
    file.totalDownloads += 1;
    await file.save();  

    // Save download log
    const log = new DownloadLog({
      pdfId: file._id,
      pdfTitle: file.pdfTitle,
      filename: file.filename
    });
    await log.save();

    // Send file
    res.set("Content-Type", file.contentType);
    res.set("Content-Disposition", `attachment; filename="${file.filename}"`);
    res.send(file.data);
  } catch (err) {
    console.error("Download error:", err);
    res.status(500).json({ error: "Download error" });
  }
});


module.exports = router;
