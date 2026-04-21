const express = require("express");
const router = express.Router();
const Admin = require("../models/admin");
const Buddy = require("../models/Buddy");
const Bud = require("../models/Bud");

// Render login page
router.get("/", async (req, res) => {
  res.render("login");
});

router.get("/login", (req, res) => {
  res.render("login");
});

// Unified Login Route with NoSQL Injection Prevention
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      req.flash("error", "Username and password are required");
      return res.redirect("/login");
    }

    let user = null;
    let token = null;
    let role = "";

    // Try Admin login
    try {
      user = await Admin.findByCredentials(username, password);
      token = await user.generateAuthToken();
      res.cookie("admin_token", token, { httpOnly: true, secure: true });
      return res.redirect("/admin-dashboard");
    } catch (adminErr) {}

    // Try Buddy login
    try {
      user = await Buddy.findByCredentials(username, password);
      token = await user.generateAuthToken();
      res.cookie("Buddy_token", token, { httpOnly: true, secure: true });
      return res.redirect("/home-buddy");
    } catch (buddyErr) {}

    // Try Bud login
    try {
      user = await Bud.findByCredentials(username, password);
      token = await user.generateAuthToken();
      res.cookie("Bud_token", token, { httpOnly: true, secure: true });
      return res.redirect("/home-bud");
    } catch (budErr) {}

    // If no user was authenticated
    req.flash("error", "Invalid username or password");
    return res.redirect("/login");

  } catch (error) {
    console.error("Login Error:", error.message);
    req.flash("error", "Something went wrong. Please try again.");
    res.redirect("/login");
  }
});

module.exports = router;
