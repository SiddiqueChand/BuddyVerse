const express = require("express");
const router = new express.Router();
const Bud = require("../models/Bud");
const adminAuth = require("../middleware/adminAuth");
const BudAuth = require("../middleware/budAuth");
const multer = require("multer");
const Event= require("../models/eventsSchema");
const PDF = require("../models/pdf");
const Buddy = require("../models/Buddy");


// Bud Homepage \\
router.get("/home-Bud", BudAuth, async(req, res) => {
  try {
      const files = await Event.find({});
      res.render("Bud/budHomePage",{
        BudName: req.user.BudName, files
      });
  } catch (error) {
      req.flash("error", error.toString());
      res.redirect("/");
  }
});

// Event Details Page \\
router.get("/ed-Bud/:id", BudAuth, async (req, res) => {
  try {
    const eventId = req.params.id;
    const event = await Event.findById(eventId);

    if (!event) {
      req.flash("error", "Event not found.");
      return res.redirect("/home-bud");
    }

    // Add BudName to the rendered template
    res.render("Bud/eventDetails", { 
      event,
      BudName: req.user.BudName 
    });

  } catch (error) {
    console.error("Error fetching event details:", error);
    req.flash("error", "An error occurred while fetching event details.");
    res.redirect("/home-bud");
  }
});


// Bud Get About Us Page \\
router.get("/aboutus-Bud", BudAuth, async(req, res) => {
  try {
      const files = await Event.find({});
      res.render("Bud/budAboutUS",{
        BudName: req.user.BudName, files
      });
  } catch (error) {
      req.flash("error", error.toString());
      res.redirect("/");
  }
});


const Pair = require("../models/Pair"); // Import Pair model

router.get("/profile-Bud", BudAuth, async (req, res) => {
    try {
        // Find the pair where the logged-in Bud is assigned
        const pair = await Pair.findOne({ "buds.BudID": req.user.BudID }).lean();

        if (!pair) {
            return res.render("Bud/budProfile", {
                BudName: req.user.BudName,
                BudID: req.user.BudID,
                BudStream: req.user.BudStream,
                BudYear: req.user.BudYear,
                BudContactNumber: req.user.BudContactNumber,
                BudEmail: req.user.BudEmail,
                AssignedBuddy: null // No assigned buddy found
            });
        }

        res.render("Bud/budProfile", {
            BudName: req.user.BudName,
            BudID: req.user.BudID,
            BudStream: req.user.BudStream,
            BudYear: req.user.BudYear,
            BudContactNumber: req.user.BudContactNumber,
            BudEmail: req.user.BudEmail,
            AssignedBuddy: pair.buddy // Pass assigned Buddy details
        });
    } catch (error) {
        console.error("Error fetching Bud profile:", error);
        res.status(500).send("Error fetching profile");
    }
});

router.get("/bud-redirect-to-stream", BudAuth, async (req, res) => {
  try {
    // Read stream from authenticated user
    let stream = req.user.BudStream; // Example: "BSc (IT)"
    
    // Clean the stream to match your page URL
    stream = stream.replace(/\s|\(|\)/g, "").toUpperCase(); // → "BSCIT"
    
    // Redirect to correct study material page
    return res.redirect(`/Bud-${stream}`);
  } catch (error) {
    console.error("Error redirecting", error);
    res.status(500).send("Error redirecting");
  }
});

router.get("/Bud-:stream", BudAuth, async (req, res) => {
  const stream = req.params.stream;
  try {
    const files = await PDF.find(); // Optional: filter by stream
    res.render(`Bud/Studymaterial/Bud-${stream}`, {  
      BudName: req.user.BudName,
      files
    });
  } catch (error) {
    console.error("Error finding stream", error);
    res.status(500).send("Error finding stream");
  }
});
// Study Material Page
router.get("/Bud-BSCIT", BudAuth, async (req, res) => {
  try {
    const files = await PDF.find(); // Fetch all PDFs from MongoDB
    res.render("Bud/Studymaterial/Bud-BSCIT", { 
      BudName: req.user.BudName,
      files,
    });
  } catch (error) {
    console.error("Failed to load files", error);
    res.status(500).send("Error finding BSCIT");
  }
});

router.get("/Bud-BCOM", BudAuth, async (req, res) => {
  try {
    const files = await PDF.find(); // Fetch all PDFs from MongoDB
    res.render("Bud/Studymaterial/Bud-BCOM", { 
      BudName: req.user.BudName,
      files,
    });
  } catch (error) {
    console.error("Failed to load files", error);
    res.status(500).send("Error finding BCOM");
  }
});

router.get("/Bud-BAF", BudAuth, async (req, res) => {
  try {
    const files = await PDF.find(); // Fetch all PDFs from MongoDB
    res.render("Bud/Studymaterial/Bud-BAF", { 
      BudName: req.user.BudName,
      files,
    });
  } catch (error) {
    console.error("Failed to load files", error);
    res.status(500).send("Error finding BAF");
  }
});

router.get("/Bud-BBI", BudAuth, async (req, res) => {
  try {
    const files = await PDF.find(); // Fetch all PDFs from MongoDB
    res.render("Bud/Studymaterial/Bud-BBI", { 
      BudName: req.user.BudName,
      files,
    });
  } catch (error) {
    console.error("Failed to load files", error);
    res.status(500).send("Error finding BBI");
  }
});

router.get("/Bud-BFM", BudAuth, async (req, res) => {
  try {
    const files = await PDF.find(); // Fetch all PDFs from MongoDB
    res.render("Bud/Studymaterial/Bud-BFM", { 
      BudName: req.user.BudName,
      files,
    });
  } catch (error) {
    console.error("Failed to load files", error);
    res.status(500).send("Error finding BFM");
  }
});

router.get("/Bud-BMS", BudAuth, async (req, res) => {
  try {
    const files = await PDF.find(); // Fetch all PDFs from MongoDB
    res.render("Bud/Studymaterial/Bud-BMS", { 
      BudName: req.user.BudName,
      files,
    });
  } catch (error) {
    console.error("Failed to load files", error);
    res.status(500).send("Error finding BMS");
  }
});

router.get("/Bud-BA", BudAuth, async (req, res) => {
  try {
    const files = await PDF.find(); // Fetch all PDFs from MongoDB
    res.render("Bud/Studymaterial/Bud-BA", { 
      BudName: req.user.BudName,
      files,
    });
  } catch (error) {
    console.error("Failed to load files", error);
    res.status(500).send("Error finding BA");
  }
});

router.get("/Bud-BAMMC", BudAuth, async (req, res) => {
  try {
    const files = await PDF.find(); // Fetch all PDFs from MongoDB
    res.render("Bud/Studymaterial/Bud-BAMMC", { 
      BudName: req.user.BudName,
      files,
    });
  } catch (error) {
    console.error("Failed to load files", error);
    res.status(500).send("Error finding BAMMC");
  }
});

router.get("/Bud-BAFTNMP", BudAuth, async (req, res) => {
  try {
    const files = await PDF.find(); // Fetch all PDFs from MongoDB
    res.render("Bud/Studymaterial/Bud-BAFTNMP", { 
      BudName: req.user.BudName,
      files,
    });
  } catch (error) {
    console.error("Failed to load files", error);
    res.status(500).send("Error finding BAFTNMP");
  }
});

router.get("/Bud-BSC", BudAuth, async (req, res) => {
  try {
    const files = await PDF.find(); // Fetch all PDFs from MongoDB
    res.render("Bud/Studymaterial/Bud-BSC", { 
      BudName: req.user.BudName,
      files,
    });
  } catch (error) {
    console.error("Failed to load files", error);
    res.status(500).send("Error finding BSC");
  }
});

router.get("/Bud-BSCBIOTECH", BudAuth, async (req, res) => {
  try {
    const files = await PDF.find(); // Fetch all PDFs from MongoDB
    res.render("Bud/Studymaterial/Bud-BSCBIOTECH", { 
      BudName: req.user.BudName,
      files,
    });
  } catch (error) {
    console.error("Failed to load files", error);
    res.status(500).send("Error finding BSCBIOTECH");
  }
});

router.get("/Bud-BSCCS", BudAuth, async (req, res) => {
  try {
    const files = await PDF.find(); // Fetch all PDFs from MongoDB
    res.render("Bud/Studymaterial/Bud-BSCCS", { 
      BudName: req.user.BudName,
      files,
    });
  } catch (error) {
    console.error("Failed to load files", error);
    res.status(500).send("Error finding BSCCS");
  }
});

router.get("/Bud-BSCDS&BA", BudAuth, async (req, res) => {
  try {
    const files = await PDF.find(); // Fetch all PDFs from MongoDB
    res.render("Bud/Studymaterial/Bud-BSCDS&BA", { 
      BudName: req.user.BudName,
      files,
    });
  } catch (error) {
    console.error("Failed to load files", error);
    res.status(500).send("Error finding BSCDS&BA");
  }
});

router.get("/Bud-BVOCS&EM", BudAuth, async (req, res) => {
  try {
    const files = await PDF.find(); // Fetch all PDFs from MongoDB
    res.render("Bud/Studymaterial/Bud-BVOCS&EM", { 
      BudName: req.user.BudName,
      files,
    });
  } catch (error) {
    console.error("Failed to load files", error);
    res.status(500).send("Error finding BVOCS&EM");
  }
});

router.get("/Bud-BVOCWT", BudAuth, async (req, res) => {
  try {
    const files = await PDF.find(); // Fetch all PDFs from MongoDB
    res.render("Bud/Studymaterial/Bud-BVOCWT", { 
      BudName: req.user.BudName,
      files,
    });
  } catch (error) {
    console.error("Failed to load files", error);
    res.status(500).send("Error finding BVOCWT");
  }
});

router.get("/registerEvent-Bud", BudAuth, async (req, res) => {
  res.render("Bud/registerEvent", {
    BudName: req.user.BudName,
  });
});
on = require('../models/registration'); // Adjust path if necessary

// POST route to handle form submission
router.post('/submitregi-Bud', BudAuth, async (req, res) => {
  try {
    const registration = new Registration({
      ...req.body,
      bud: req.user._id // Link to logged-in buddy
    });
    
    await registration.save();
    req.flash('success', 'Registration successful!');
    res.redirect('/home-bud');
  } catch (err) {
    req.flash('error', 'Registration failed: ' + err.message);
    res.redirect('back');
  }
});

router.get("/chat-Bud", BudAuth, async (req, res) => {
  try {
    const bud = req.user; // Get the logged-in Bud
    console.log("Logged-in Bud:", bud.BudName, "ID:", bud.BudID); // Debugging log

    // Find the pair where the logged-in Bud is assigned
    const pair = await Pair.findOne({ "buds.BudID": req.user.BudID }).lean();

    if (!pair || !pair.buddy) {
      console.warn("No assigned Buddy found for Bud:", bud.BudName);
      return res.render("Bud/chatBud", {
        Buddy: null,       // Ensuring Buddy is defined
        BuddyID: null,   // Ensuring BuddyID is defined
        BudID: bud.BudID
      });
    }

    console.log("Assigned Buddy:", pair.buddy.BuddyID); // Debugging log

    res.render("Bud/chatBud", { 
      BudID: bud.BudID, 
      Buddy: pair.buddy, 
      BuddyID: pair.buddy.BuddyID
    });

  } catch (error) {
    console.error("Error fetching Buddy:", error);
    res.status(500).send("Internal Server Error");
  }
});


// Bud Profile \\
// router.get("/Bud-profile", BudAuth, async (req, res) => {
//   res.render("Bud/budProfile", {
//     BudName: req.user.BudName,
//     BudID: req.user.BudID,
//     BudYear: req.user.BudYear,
//     BudStream: req.user.BudStream,
//     BudContactNumber: req.user.BudContactNumber,
//     BudEmail: req.user.BudEmail,
//   });
// });

// router.post("/Bud-profile-edit", BudAuth,async (req, res) => {
//   try{
//     const Bud = await Bud.findOneAndUpdate({_id:req.user._id},req.body)
//     // console.log(req.body)
//     await Bud.save();
//     req.flash("success", "Updated Successfully");
//     res.redirect("/Bud-profile");
//   }catch(e){
//     req.flash("error", e.toString());
//     res.redirect("/Bud-profile");
//   }
// });

// router.post("/Bud-profile-password-change",BudAuth,async(req,res)=>{
//   try{
//     req.user.BudPassword = req.body.BudPassword
//     await req.user.save();
//     req.flash("success", "Updated Successfully");
//     res.redirect("/Bud-profile");
//   }catch(e){
//     req.flash("error", e.toString());
//     res.redirect("/Bud-profile");
//   }
// });
// Bud Profile Ends \\

// Bud Logout \\
router.get("/logout-Bud", BudAuth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });
    await req.user.save();
    res.clearCookie("Bud_token");
    req.flash("success", "Logged Out Successfully");
    res.redirect("/login");
  } catch (e) {
    res.status(500).send();
  }
});
// Bud Logout Ends \\

module.exports = router;
