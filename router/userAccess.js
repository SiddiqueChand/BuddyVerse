const express = require("express");
const router = new express.Router();
const path = require("path");
const fs = require("fs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const multer = require("multer");
const excelToJson = require("convert-excel-to-json");
const Bud = require("../models/Bud");
const Buddy = require("../models/Buddy");
const adminAuth = require("../middleware/adminAuth");
const BudAuth = require("../middleware/budAuth");
const BuddyAuth = require("../middleware/buddyAuth");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

// router.use(bodyParser.urlencoded({ extended: false }));

//**************************************************Single Registration Starts*************************************/

//**************************************************Bud Registration Starts*************************************/

router.get("/register-Bud",adminAuth,async(req,res)=>{
  const formData = req.session.formData || {}; // Get form data from session
  req.session.formData = null; // Clear after rendering (optional)

  res.render("Admin/UserAccess/Register/BudRegister", {
      adminUsername: req.user.adminUsername,
      formData,
  });
});

//***********************Post Request:- Bud Registration******************/
router.post("/register-Bud", async (req, res) => {
  const bud = new Bud(req.body);
  req.session.formData = req.body; // Save form input in session

  try {
    await bud.save();
    req.flash("success", "Registered successfully");    
    req.session.formData = null; // Clear form data
    res.redirect("/register-Bud");
  } catch (e) {
    req.flash("error", e.message || "Something went wrong");

    // Optional: Store error message in session too (if needed elsewhere)
    req.session.errorMsg = e.message;

    res.redirect("/register-Bud");
}
});


//*******************************************Bud Registration Ends********************************************/


//**************************************************Buddy Registration Starts*************************************/

router.get("/register-Buddy", adminAuth, async (req, res) => {
  const formData = req.session.formData || {}; // Get form data from session
  req.session.formData = null; // Clear after rendering (optional)

  res.render("Admin/UserAccess/Register/BuddyRegister", {
      adminUsername: req.user.adminUsername,
      formData,
  });
});

//Post Request:- Buddy Registration*/
router.post("/register-Buddy", async (req, res) => {
  const buddy = new Buddy(req.body);
  req.session.formData = req.body; // Save form input in session

  try {
      await buddy.save();
      req.flash("success", "Registered successfully");
      req.session.formData = null; // Clear form data
      res.redirect("/register-Buddy");
  } catch (e) {
      req.flash("error", e.message || "Something went wrong");

      // Optional: Store error message in session too (if needed elsewhere)
      req.session.errorMsg = e.message;

      res.redirect("/register-Buddy");
  }
});
//**************************************************Buddy Registration Ends*************************************/


//**************************************************Single Registration Ends*************************************/



//**************************************************Multiple Registration Starts*************************************/

//******************Multiple Buds Registration******************//
router.post(
  "/multiple-Buds-register",
  upload.single("uploadfile"),
  async (req, res) => {
    const filePath = "public/uploads/" + req.file.filename;
    const excelData = excelToJson({
      source: fs.readFileSync(filePath),
      sheets: [{ name: "Sheet1", header: { rows: 1 }, columnToKey: {"*": "{{columnHeader}}"}}]
    });
    const BudsData = excelData.Sheet1;
    var finalBudsData = [];
    BudsData.forEach((BudData) => {
      const finalObj = {
        BudName: BudData.budName,
        BudEmail: BudData.budEmail,
        BudContactNumber: BudData.budContactNumber,
        BudStream: BudData.budStream,
        BudYear: BudData.budYear,
        BudID: BudData.budID,
        BudPassword: BudData.budPassword
      };
      finalBudsData.push(finalObj);
    });

    try {
      await Bud.insertMany(finalBudsData, { ordered: true });
      req.flash("success", "Registered successfully");
      res.redirect("/register-Bud");
    } catch (e) {
      req.flash("error", e.toString());
      res.redirect("/register-Bud");
    }

    fs.unlinkSync(filePath);
  }
);

//******************Multiple Buds Registration End******************//

//******************Multiple  Registration******************//
router.post(
  "/multiple-Buddy-register",
  upload.single("uploadfile"),
  async (req, res) => {
    const filePath = "public/uploads/" + req.file.filename;
    const excelData = excelToJson({
      source: fs.readFileSync(filePath),
      sheets: [
        {
          name: "Sheet1",
          header: { rows: 1 },
          columnToKey: { "*": "{{columnHeader}}" },
        },
      ],
    });
    const BuddyData = excelData.Sheet1;
    var finalBuddyData = [];
    BuddyData.forEach((BuddyData) => {
      const finalObj = {
        BuddyName: BuddyData.buddyName,
        BuddyEmail: BuddyData.buddyEmail,
        BuddyContactNumber: BuddyData.buddyContactNumber,
        BuddyStream: BuddyData.buddyStream,
        BuddyYear: BuddyData.buddyYear,
        BuddyID: BuddyData.buddyID,
        BuddyPassword: BuddyData.buddyPassword,
      };

      finalBuddyData.push(finalObj);
    });

    try {
      await Buddy.insertMany(finalBuddyData, { ordered: true });
      req.flash("success", "Registered successfully");
      res.redirect("/register-Buddy");
    } catch (e) {
      req.flash("error", e.toString());
      res.redirect("/register-Buddy");
    }

    fs.unlinkSync(filePath);
  }
);
//******************Multiple Buddy Registration End******************//


//**************************************************Multiple Registration Ends*************************************/




//**************************************************Bud Unregistration Starts*************************************/
router.get("/unregister-Bud",adminAuth,async (req, res) => {
  res.render("Admin/UserAccess/Unregister/BudDelete",{adminUsername:req.user.adminUsername});
});

router.post("/unregister-Bud",async(req,res)=>{
  try{
    const bud = await Bud.findOneAndDelete({BudID:req.body.BudID})
    req.flash("success", "Deleted successfully");
    res.redirect("/unregister-Bud")
  }catch(e){
    req.flash("error", e.toString());
    res.redirect("/unregister-Bud")
  }
  
})
//*******************************************Bud Unregistration Ends********************************************/

//**************************************************Buddy Unregistration Starts*************************************/
router.get("/unregister-Buddy",adminAuth,async (req, res) => {
    res.render("Admin/UserAccess/Unregister/BuddyDelete",{adminUsername:req.user.adminUsername});
  });

router.post("/unregister-Buddy",async(req,res)=>{
  try{
    const buddy = await Buddy.findOneAndDelete({BuddyID:req.body.BuddyID})
    req.flash("success", "Deleted successfully");
    res.redirect("/unregister-Buddy")
  }catch(e){
    req.flash("error", e.toString());
    res.redirect("/unregister-Buddy");
  }
})
//**************************************************Buddy Unregistration Ends*************************************/

module.exports = router;