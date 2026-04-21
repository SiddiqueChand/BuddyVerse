const jwt = require("jsonwebtoken");
const Buddy = require("../models/Buddy");

const BuddyAuth = async (req, res, next) => {
    try {
        const token = req.cookies?.Buddy_token;
        if (!token) throw new Error("No token provided");

        const decoded = jwt.verify(token, "yourSecretKey"); // Use the same secret key as in `generateAuthToken`
        
        const buddy = await Buddy.findOne({ _id: decoded._id, "tokens.token": token });
        if (!buddy) throw new Error("Authentication failed");

        req.user = buddy;
        req.token = token;
        next();
    } catch (error) {
        console.error("Buddy Authentication Error:", error.message);
        res.status(401).json({ error: "Please authenticate!" });
    }
};

module.exports = BuddyAuth;
