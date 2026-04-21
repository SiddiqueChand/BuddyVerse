const express = require("express");
const router = new express.Router();
const Admin = require("../models/admin");
const Buddy = require("../models/Buddy");
const Bud = require("../models/Bud");
const adminAuth = require("../middleware/adminAuth");
const BuddyAuth = require("../middleware/buddyAuth");
const BudAuth = require("../middleware/budAuth")
const Event = require("../models/eventsSchema");
const Registration = require('../models/registration');
const multer = require("multer");
const fs = require('fs');
const path = require('path');
const { json } = require("body-parser");
const dirName = require("../dirName");
const { error } = require("console");



//Configuration for Multer
const multerStorage  = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads');
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now());
    }
});   

//Calling the "multer" Function
const upload = multer({
    storage: multerStorage,
});
  
// ************** Admin ************** \\
// Add New Event \\
router.get("/admin-add-new-event",adminAuth,async(req,res)=>{
    res.render("Admin/Event/adminAddNewEvent",{adminUsername:req.user.adminUsername});
});

router.post("/admin-add-new-event", upload.array("myFile", 2), async(req, res) => {
    try {
      const event = await Event.create({
        eventID: req.body.eventID,
        eventName: req.body.eventName,
        eventStartDate: req.body.eventStartDate,
        eventEndDate: req.body.eventEndDate,
        eventType: req.body.eventType,
        eventLocation: req.body.eventLocation,
        eventAbout: req.body.eventAbout,
        eventBgPhoto: {
          data: fs.readFileSync(path.join(dirName + '/uploads/' + req.files[0].filename)),
          contentType: 'image/png'
        },
        eventHeroPhoto: {
          data: fs.readFileSync(path.join(dirName + '/uploads/' + req.files[1].filename)),
          contentType: 'image/png'
        },
      });
      req.flash("success", "Event Created Successfully");
      res.redirect("/admin-add-new-event");
    } catch (error) {
      req.flash("error", error.toString());
      res.redirect("/admin-add-new-event");
    }
  });


// View All Event \\
router.get("/admin-view-all-events", adminAuth ,async(req,res)=>{
    try {
        const files = await Event.find({});
        res.render("Admin/Event/adminViewAllEvent",{  
            adminUsername:req.user.adminUsername, files
        });
    } catch (error) {
        req.flash("error", error.toString());
        res.redirect("Admin/Event/adminViewAllEvent");
    }
});

router.post("/admin-delete-events",async(req,res)=> {
    try{
        const event = await Event.findOneAndDelete({eventID:req.body.eventID})
        req.flash("success", "Deleted successfully");
        res.redirect("/admin-view-all-events")
    }catch(error){
        req.flash("error", error.toString());
        res.redirect("/admin-view-all-events")
    }
})


// ************** Buddy ************** \\

// View All Events \\
router.get("/Buddy-view-all-events", BuddyAuth, async (req, res) => {
    try {
        const files = await Event.find({});
        res.render("Buddy/Event/buddyViewAllEvent",{  
            BuddyName: req.user.BuddyName, files
        });
    } catch (error) {
        req.flash("error", error.toString());
        res.redirect("/");
    }
});
  

// ************** Bud ************** \\

// View All Events \\
router.get("/Bud-view-all-events",BudAuth,async(req,res)=>{
    try {
        const files = await Event.find({});
        res.render("Bud/Event/budViewAllEvent",{
            BudName:req.user.BudName, files
        });
    } catch (error) {
        req.flash("error", error.toString());
        res.redirect("/");
    }
});

router.get("/admin-view-registrations", adminAuth, async (req, res) => {
    try {
      const eventName = req.query.eventName;
      const registrations = await Registration.find({ event: eventName });
      res.render("Admin/Event/adminViewRegistrations", {
        adminUsername: req.user.adminUsername,
        eventName,
        registrations
      });
    } catch (error) {
      req.flash("error", error.toString());
      res.redirect("/admin-view-all-events");
    }
  });

module.exports = router;
