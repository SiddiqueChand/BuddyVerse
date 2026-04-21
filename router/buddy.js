const express = require("express");
const router = new express.Router();
const Buddy = require("../models/Buddy");
const adminAuth = require("../middleware/adminAuth");
const BuddyAuth = require("../middleware/buddyAuth");
const multer = require("multer");
const Event = require("../models/eventsSchema");
const Registration = require('../models/registration'); 
const PDF = require("../models/pdf");
const Bud = require("../models/Bud");

// Buddy Homepage \\
router.get("/home-Buddy", BuddyAuth, async(req, res) => {
  try {
      const files = await Event.find({});
      res.render("Buddy/buddyHomePage",{
      BuddyName: req.user.BuddyName, files
      });
  } catch (error) {
      req.flash("error", error.toString());
      res.redirect("/");
  }
});

// Event Details Page \\
router.get("/ed-Buddy/:id", BuddyAuth, async (req, res) => {
  try {
    const eventId = req.params.id;
    const event = await Event.findById(eventId);

    if (!event) {
      req.flash("error", "Event not found.");
      return res.redirect("/home-buddy");
    }

    // Add BuddyName to the rendered template
    res.render("Buddy/eventDetails", { 
      event,
      BuddyName: req.user.BuddyName 
    });

  } catch (error) {
    console.error("Error fetching event details:", error);
    req.flash("error", "An error occurred while fetching event details.");
    res.redirect("/home-buddy");
  }
});

// Buddy About Us \\
router.get("/aboutus-Buddy", BuddyAuth, async(req, res) => {
  try {
      const files = await Event.find({});
      res.render("Buddy/buddyAboutUS",{
        BuddyName: req.user.BuddyName, files
      });
  } catch (error) {
      req.flash("error", error.toString());
      res.redirect("/");
  }
});

const Pair = require("../models/Pair"); // Import Pair model

router.get("/profile-Buddy", BuddyAuth, async (req, res) => {
    try {
        // Find the pair where the logged-in Buddy is assigned
        const pair = await Pair.findOne({ "buddy.BuddyID": req.user.BuddyID }).lean();

        if (!pair) {
            return res.render("Buddy/buddyProfile1", {
                BuddyName: req.user.BuddyName,
                BuddyID: req.user.BuddyID,
                BuddyStream: req.user.BuddyStream,
                BuddyYear: req.user.BuddyYear,
                BuddyContactNumber: req.user.BuddyContactNumber,
                BuddyEmail: req.user.BuddyEmail,
                AssignedBuds: [] // No assigned buds found
            });
        }

        res.render("Buddy/buddyProfile1", {
            BuddyName: req.user.BuddyName,
            BuddyID: req.user.BuddyID,
            BuddyStream: req.user.BuddyStream,
            BuddyYear: req.user.BuddyYear,
            BuddyContactNumber: req.user.BuddyContactNumber,
            BuddyEmail: req.user.BuddyEmail,
            AssignedBuds: pair.buds // Pass assigned buds from pair collection
        });
    } catch (error) {
        console.error("Error fetching buddy profile:", error);
        res.status(500).send("Error fetching profile");
    }
});


router.get("/buddy-redirect-to-stream", BuddyAuth, async (req, res) => {
  try {
    // Read stream from authenticated user
    let stream = req.user.BuddyStream; // Example: "BSc (IT)"
    
    // Clean the stream to match your page URL
    stream = stream.replace(/\s|\(|\)/g, "").toUpperCase(); // → "BSCIT"
    
    // Redirect to correct study material page
    return res.redirect(`/Buddy-${stream}`);
  } catch (error) {
    console.error("Error redirecting", error);
    res.status(500).send("Error redirecting");
  }
});

router.get("/Buddy-:stream", BuddyAuth, async (req, res) => {
  const stream = req.params.stream;
  try {
    const files = await PDF.find(); // Optional: filter by stream
    res.render(`Buddy/Studymaterial/Buddy-${stream}`, {  
      BuddyName: req.user.BuddyName,
      files
    });
  } catch (error) {
    console.error("Error finding stream", error);
    res.status(500).send("Error finding stream");
  }
});
// Study Material Page
router.get("/Buddy-BSCIT", BuddyAuth, async (req, res) => {
  try {
    const files = await PDF.find(); // Fetch all PDFs from MongoDB
    res.render("Buddy/Studymaterial/Buddy-BSCIT", { 
      BuddyName: req.user.BuddyName,
      files,
    });
  } catch (error) {
    console.error("Failed to load files", error);
    res.status(500).send("Error finding BSCIT");
  }
});

router.get("/Buddy-BCOM", BuddyAuth, async (req, res) => {
  try {
    const files = await PDF.find(); // Fetch all PDFs from MongoDB
    res.render("Buddy/Studymaterial/Buddy-BCOM", { 
      BuddyName: req.user.BuddyName,
      files,
    });
  } catch (error) {
    console.error("Failed to load files", error);
    res.status(500).send("Error finding BCOM");
  }
});

router.get("/Buddy-BAF", BuddyAuth, async (req, res) => {
  try {
    const files = await PDF.find(); // Fetch all PDFs from MongoDB
    res.render("Buddy/Studymaterial/Buddy-BAF", { 
      BuddyName: req.user.BuddyName,
      files,
    });
  } catch (error) {
    console.error("Failed to load files", error);
    res.status(500).send("Error finding BAF");
  }
});

router.get("/Buddy-BBI", BuddyAuth, async (req, res) => {
  try {
    const files = await PDF.find(); // Fetch all PDFs from MongoDB
    res.render("Buddy/Studymaterial/Buddy-BBI", { 
      BuddyName: req.user.BuddyName,
      files,
    });
  } catch (error) {
    console.error("Failed to load files", error);
    res.status(500).send("Error finding BBI");
  }
});

router.get("/Buddy-BFM", BuddyAuth, async (req, res) => {
  try {
    const files = await PDF.find(); // Fetch all PDFs from MongoDB
    res.render("Buddy/Studymaterial/Buddy-BFM", { 
      BuddyName: req.user.BuddyName,
      files,
    });
  } catch (error) {
    console.error("Failed to load files", error);
    res.status(500).send("Error finding BFM");
  }
});

router.get("/Buddy-BMS", BuddyAuth, async (req, res) => {
  try {
    const files = await PDF.find(); // Fetch all PDFs from MongoDB
    res.render("Buddy/Studymaterial/Buddy-BMS", { 
      BuddyName: req.user.BuddyName,
      files,
    });
  } catch (error) {
    console.error("Failed to load files", error);
    res.status(500).send("Error finding BMS");
  }
});

router.get("/Buddy-BA", BuddyAuth, async (req, res) => {
  try {
    const files = await PDF.find(); // Fetch all PDFs from MongoDB
    res.render("Buddy/Studymaterial/Buddy-BA", { 
      BuddyName: req.user.BuddyName,
      files,
    });
  } catch (error) {
    console.error("Failed to load files", error);
    res.status(500).send("Error finding BA");
  }
});

router.get("/Buddy-BAMMC", BuddyAuth, async (req, res) => {
  try {
    const files = await PDF.find(); // Fetch all PDFs from MongoDB
    res.render("Buddy/Studymaterial/Buddy-BAMMC", { 
      BuddyName: req.user.BuddyName,
      files,
    });
  } catch (error) {
    console.error("Failed to load files", error);
    res.status(500).send("Error finding BAMMC");
  }
});

router.get("/Buddy-BAFTNMP", BuddyAuth, async (req, res) => {
  try {
    const files = await PDF.find(); // Fetch all PDFs from MongoDB
    res.render("Buddy/Studymaterial/Buddy-BAFTNMP", { 
      BuddyName: req.user.BuddyName,
      files,
    });
  } catch (error) {
    console.error("Failed to load files", error);
    res.status(500).send("Error finding BAFTNMP");
  }
});

router.get("/Buddy-BSC", BuddyAuth, async (req, res) => {
  try {
    const files = await PDF.find(); // Fetch all PDFs from MongoDB
    res.render("Buddy/Studymaterial/Buddy-BSC", { 
      BuddyName: req.user.BuddyName,
      files,
    });
  } catch (error) {
    console.error("Failed to load files", error);
    res.status(500).send("Error finding BSC");
  }
});

router.get("/Buddy-BSCBIOTECH", BuddyAuth, async (req, res) => {
  try {
    const files = await PDF.find(); // Fetch all PDFs from MongoDB
    res.render("Buddy/Studymaterial/Buddy-BSCBIOTECH", { 
      BuddyName: req.user.BuddyName,
      files,
    });
  } catch (error) {
    console.error("Failed to load files", error);
    res.status(500).send("Error finding BSCBIOTECH");
  }
});

router.get("/Buddy-BSCCS", BuddyAuth, async (req, res) => {
  try {
    const files = await PDF.find(); // Fetch all PDFs from MongoDB
    res.render("Buddy/Studymaterial/Buddy-BSCCS", { 
      BuddyName: req.user.BuddyName,
      files,
    });
  } catch (error) {
    console.error("Failed to load files", error);
    res.status(500).send("Error finding BSCCS");
  }
});

router.get("/Buddy-BSCDS&BA", BuddyAuth, async (req, res) => {
  try {
    const files = await PDF.find(); // Fetch all PDFs from MongoDB
    res.render("Buddy/Studymaterial/Buddy-BSCDS&BA", { 
      BuddyName: req.user.BuddyName,
      files,
    });
  } catch (error) {
    console.error("Failed to load files", error);
    res.status(500).send("Error finding BSCDS&BA");
  }
});

router.get("/Buddy-BVOCS&EM", BuddyAuth, async (req, res) => {
  try {
    const files = await PDF.find(); // Fetch all PDFs from MongoDB
    res.render("Buddy/Studymaterial/Buddy-BVOCS&EM", { 
      BuddyName: req.user.BuddyName,
      files,
    });
  } catch (error) {
    console.error("Failed to load files", error);
    res.status(500).send("Error finding BVOCS&EM");
  }
});

router.get("/Buddy-BVOCWT", BuddyAuth, async (req, res) => {
  try {
    const files = await PDF.find(); // Fetch all PDFs from MongoDB
    res.render("Buddy/Studymaterial/Buddy-BVOCWT", { 
      BuddyName: req.user.BuddyName,
      files,
    });
  } catch (error) {
    console.error("Failed to load files", error);
    res.status(500).send("Error finding BVOCWT");
  }
});

router.get("/registerEvent-Buddy", BuddyAuth, async (req, res) => {
  res.render("Buddy/registerEvent", {
    BuddyName: req.user.BuddyName,
    successMessage: req.flash("success"),
  });
});
on = require('../models/registration'); // Adjust path if necessary

router.use(express.json()); // Make sure this is at the top

router.post('/submitregi-Buddy', BuddyAuth, async (req, res) => {
  try {
    const registration = new Registration({
      ...req.body,
      buddy: req.user._id
    });
    await registration.save();
    res.status(200).json({ message: 'Registration successful!' });
  } catch (error) {
    // Structure error messages as an object, e.g., { danger: ["Some error message"] }
    res.status(400).json({ 
      errmessages: { 
        danger: [error.message || "Something went wrong"] 
      }
    });
  }
});




router.get("/chat-Buddy", BuddyAuth, async (req, res) => {
  try {
    const buddy = req.user; // Get the logged-in Buddy
    console.log("Logged-in Buddy:", buddy.BuddyName, "ID:", buddy.BuddyID); // Debugging log

    // Find the pair where the logged-in Buddy is assigned
    const pair = await Pair.findOne({ "buddy.BuddyID": req.user.BuddyID }).lean();

    if (!pair || !pair.buds || pair.buds.length === 0) {
      console.warn("No assigned Buds found for Buddy:", buddy.BuddyName);
      return res.render("Buddy/chatBuddy", {
        Buds: [],         // Ensuring Buds is defined as an empty array
        BuddyID: buddy.BuddyID,
      });
    }

    console.log("Assigned Buds:", pair.buds.map(bud => bud.BudID)); // Debugging log

    res.render("Buddy/chatBuddy", { 
      BuddyID: buddy.BuddyID, 
      Buds: pair.buds,
    });

  } catch (error) {
    console.error("Error fetching Buds:", error);
    res.status(500).send("Internal Server Error");
  }
});


// Buddy Profile \\
// router.get("/Buddy-profile", BuddyAuth, async (req, res) => {
//   res.render("Buddy/buddyProfile", {
//     BuddyName: req.user.BuddyName,
//     BuddyID: req.user.BuddyID,
//     BuddyStream: req.user.BuddyStream,
//     BuddyYear: req.user.BuddyYear,
//     BuddyContactNumber: req.user.BuddyContactNumber,
//     BuddyEmail: req.user.BuddyEmail,
//   });
// });

// router.post("/Buddy-profile-edit", BuddyAuth, async (req, res) => {
//   try {
//     const Buddy = await Buddy.findOneAndUpdate(
//       { _id: req.user._id },
//       req.body
//     );
//     console.log(req.body)
//     await Buddy.save();
//     req.flash("success", "Updated Successfully");
//     res.redirect("/Buddy-profile");
//   } catch (e) {
//     req.flash("error", e.toString());
//     res.redirect("/Buddy-profile");
//   }
// });

// router.post(
//   "/Buddy-profile-password-change",
//   BuddyAuth,
//   async (req, res) => {
//     try {
//       req.user.BuddyPassword = req.body.BuddyPassword;
//       await req.user.save();
//       req.flash("success", "Updated Successfully");
//       res.redirect("/Buddy-profile");
//     } catch (e) {
//       req.flash("error", e.toString());
//       res.redirect("/Buddy-profile");
//     }
//   }
// );


// Buddy Logout \\
router.get("/logout-Buddy", BuddyAuth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });
    await req.user.save();
    res.clearCookie("Buddy_token");
    req.flash("success", "Logged Out Successfully");
    res.redirect("/login");
  } catch (e) {
    res.status(500).send(e);
  }
});
// Buddy Logout Ends \\


module.exports = router;
