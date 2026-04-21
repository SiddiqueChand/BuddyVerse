const express = require("express");
const router = new express.Router();
const Admin = require("../models/admin");
const Bud = require("../models/Bud");
const Buddy = require("../models/Buddy");
const Pair = require("../models/Pair");
const adminAuth = require("../middleware/adminAuth");
const Event = require("../models/eventsSchema");
const fs = require('fs');
const path = require('path');
const { json } = require("body-parser");
const dirName = require("../dirName");


// Dashboard \\
router.get("/admin-dashboard",adminAuth,async(req,res)=>{
  // Buds Count
  const countBud = await Bud.countDocuments();
  const BudsBCom = await Bud.countDocuments({ BudStream: "BCom" });
  const BudsBAF = await Bud.countDocuments({ BudStream: "BAF" });
  const BudsBBI = await Bud.countDocuments({ BudStream : "BBI" });
  const BudsBFM = await Bud.countDocuments({ BudStream : "BFM" });
  const BudsBMS = await Bud.countDocuments({ BudStream: "BMS" });
  const BudsBA = await Bud.countDocuments({ BudStream: "BA" });
  const BudsBAMMC = await Bud.countDocuments({ BudStream : "BAMMC" });
  const BudsBAFTNMP = await Bud.countDocuments({ BudStream : "BAFTNMP" });
  const BudsBSc = await Bud.countDocuments({ BudStream: "BSc" });
  const BudsBScBiotech = await Bud.countDocuments({ BudStream: "BSc(Biotechnology)" });
  const BudsBScCS = await Bud.countDocuments({ BudStream : "BSc(CS)" });
  const BudsBScIT = await Bud.countDocuments({ BudStream : "BSc(IT)" });
  const BudsBScDS = await Bud.countDocuments({ BudStream: "BSc(Data Science & BA)" });
  const BudsBVocSp = await Bud.countDocuments({ BudStream : "BVoc(Sports & Entertainment Management)" });
  const BudsBVocWeb = await Bud.countDocuments({ BudStream : "BVoc(Web Technologies)" });
  const BudsFY = await Bud.countDocuments({ BudYear: "FY" });
  const BudsSY = await Bud.countDocuments({ BudYear: "SY" });
  const BudsTY = await Bud.countDocuments({ BudYear: "TY" });

  // Buddy Count
  const countBuddy = await Buddy.countDocuments();
  const BuddyBCom = await Buddy.countDocuments({ BuddyStream: "BCom" });
  const BuddyBAF = await Buddy.countDocuments({ BuddyStream: "BAF" });
  const BuddyBBI = await Buddy.countDocuments({ BuddyStream : "BBI" });
  const BuddyBFM = await Buddy.countDocuments({ BuddyStream : "BFM" });
  const BuddyBMS = await Buddy.countDocuments({ BuddyStream: "BMS" });
  const BuddyBA = await Buddy.countDocuments({ BuddyStream: "BA" });
  const BuddyBAMMC = await Buddy.countDocuments({ BuddyStream : "BAMMC" });
  const BuddyBAFTNMP = await Buddy.countDocuments({ BuddyStream : "BAFTNMP" });
  const BuddyBSc = await Buddy.countDocuments({ BuddyStream: "BSc" });
  const BuddyBScBiotech = await Buddy.countDocuments({ BuddyStream: "BSc(Biotechnology)" });
  const BuddyBScCS = await Buddy.countDocuments({ BuddyStream : "BSc(CS)" });
  const BuddyBScIT = await Buddy.countDocuments({ BuddyStream : "BSc(IT)" });
  const BuddyBScDS = await Buddy.countDocuments({ BuddyStream: "BSc(Data Science & BA)" });
  const BuddyBVocSp = await Buddy.countDocuments({ BuddyStream : "BVoc(Sports & Entertainment Management)" });
  const BuddyBVocWeb = await Buddy.countDocuments({ BuddyStream : "BVoc(Web Technologies)" });
  const BuddyFY = await Buddy.countDocuments({ BuddyYear: "FY" });
  const BuddySY = await Buddy.countDocuments({ BuddyYear: "SY" });
  const BuddyTY = await Buddy.countDocuments({ BuddyYear: "TY" });

  res.render("Admin/adminDashboard", {
    adminUsername: req.user.adminUsername,
    countBud, BudsBScIT, BudsBMS, BudsBAMMC, BudsBAFTNMP, BudsBCom, 
    BudsBAF, BudsBBI,BudsBFM, BudsBA, BudsBSc, BudsBScBiotech, BudsBScCS,
    BudsBScDS, BudsBVocSp, BudsBVocWeb, BudsFY, BudsSY, BudsTY,
    countBuddy, BuddyBScIT, BuddyBMS, BuddyBAMMC, BuddyBAFTNMP, BuddyBCom, 
    BuddyBAF, BuddyBBI,BuddyBFM, BuddyBA, BuddyBSc, BuddyBScBiotech, BuddyBScCS,
    BuddyBScDS, BuddyBVocSp, BuddyBVocWeb, BuddyFY, BuddySY, BuddyTY
  });
})
// Dashboard ends \\

// Admin Profile \\
router.get("/admin-profile",adminAuth, async (req, res) => {
  res.render("Admin/adminProfile",{adminUsername:req.user.adminUsername,adminNumber:req.user.adminNumber
    ,adminEmail:req.user.adminEmail,adminStream:req.user.adminStream});
});

router.post("/admin-profile-edit",adminAuth,async (req, res) => {
  try{
    const admin = await Admin.findOneAndUpdate({_id:req.user._id},req.body)
    await admin.save();
    req.flash("success", "Updated Successfully");
    res.redirect("/admin-profile");
  }catch(e){
    req.flash("error", e.toString());
    res.redirect("/admin-profile");
  }
});

router.post("/admin-profile-password-change",adminAuth,async(req,res)=>{
  try{
    req.user.adminPassword = req.body.adminPassword
    await req.user.save();
    req.flash("success", "Updated Successfully");
    res.redirect("/admin-profile");
  }catch(e){
    req.flash("error", e.toString());
    res.redirect("/admin-profile");
  }
});
// Admin Profile Ends\\

// Logout starts \\
router.get("/admin-logout", adminAuth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });
    await req.user.save();
    res.clearCookie("admin_token");
    req.flash("success", "Logged Out Successfully");
    res.redirect("/login");
  } catch (e) {
    res.status(500).send();
  }
});
// Logout ends \\


// Randomizer Routes
// =======================

// GET route to display the randomizer page
router.get("/randomizer", adminAuth, async (req, res) => {
  try {
    const pairs = await Pair.find({}).populate("buddy").populate("buds");
    res.render("Admin/randomizer", {
      adminUsername: req.user.adminUsername,
      pairs: pairs
    });
  } catch (e) {
    req.flash("error", "Error fetching pairs: " + e.toString());
    res.redirect("/admin-dashboard");
  }
});


// router/admin.js (inside your randomizer routes section)
router.post("/randomizer/shuffle", adminAuth, async (req, res) => {
  try {
    // Fetch all Buds and Buddies
    const buds = await Bud.find({});
    const buddies = await Buddy.find({});

    // Group buds by their course/stream
    const budsByCourse = {};
    buds.forEach(bud => {
      const course = bud.BudStream; // e.g., "BSc(IT)"
      if (!budsByCourse[course]) {
        budsByCourse[course] = [];
      }
      budsByCourse[course].push(bud);
    });

    // Group buddies by their course/stream
    const buddiesByCourse = {};
    buddies.forEach(buddy => {
      const course = buddy.BuddyStream; // e.g., "BSc(IT)"
      if (!buddiesByCourse[course]) {
        buddiesByCourse[course] = [];
      }
      buddiesByCourse[course].push(buddy);
    });

    // Constraint check: for each course, ensure there are at least twice as many buds as buddies
    for (let course in buddiesByCourse) {
      const buddyCount = buddiesByCourse[course].length;
      const budCount = (budsByCourse[course] || []).length;
      if (budCount < buddyCount * 2) {
        req.flash("error", `Not enough Buds in course ${course} to assign two per Buddy.`);
        return res.redirect("/randomizer");
      }
    }

    // Remove any previous pairs
    await Pair.deleteMany({});

    // Helper: Fisher–Yates shuffle
    function shuffle(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    }

    // For each course, assign two buds per buddy
    for (let course in buddiesByCourse) {
      // Get and shuffle the buds for this course
      let courseBuds = shuffle(budsByCourse[course].slice());

      // For each buddy in this course:
      for (let buddy of buddiesByCourse[course]) {
        // Remove the first two buds from the shuffled list
        const bud1 = courseBuds.shift();
        const bud2 = courseBuds.shift();
        if (!bud1 || !bud2) {
          // Should not happen because of the constraint check above
          break;
        }

        // Create a Pair document with embedded buddy and bud details
        const pair = new Pair({
          buddy: {
            BuddyID: buddy.BuddyID,       // e.g., "678a4ffa377f8371e70da732"
            BuddyName: buddy.BuddyName    // e.g., "John Doe"
          },
          buds: [
            {
              BudID: bud1.BudID,          // e.g., "675abd21acd10c01841f9a9c"
              BudName: bud1.BudName       // e.g., "Alice Smith"
            },
            {
              BudID: bud2.BudID,          // e.g., "67a4af44107a600014b4e750"
              BudName: bud2.BudName       // e.g., "Bob Johnson"
            }
          ]
        });
        await pair.save();
      }
    }

    req.flash("success", "Random pairs created successfully.");
    res.redirect("/randomizer");
  } catch (e) {
    req.flash("error", "Error creating pairs: " + e.toString());
    res.redirect("/randomizer");
  }
});

const Pdf = require("../models/pdf");
const DownloadLog = require("../models/downloadLog");

router.get("/insights", adminAuth, async (req, res) => {
  try {
    const pdfs = await Pdf.find({}, "pdfTitle filename totalDownloads");
    const recentDownloads = await DownloadLog.find().sort({ downloadedAt: -1 }).limit(10);
    res.render("Admin/adminInsights", { 
      adminUsername: req.user.adminUsername,
      pdfs, 
      recentDownloads });
  } catch (err) {
    console.error("Insights error:", err);
    res.status(500).render("error", { message: "Failed to load insights." });
  }
});

router.get("/file-upload", adminAuth, (req, res) => {
  res.render("Admin/fileUpload", { adminUsername: req.user.adminUsername });
});




module.exports = router;
