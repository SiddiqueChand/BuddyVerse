const jwt = require("jsonwebtoken");
const Admin = require("../models/admin");

const adminAuth = async (req, res, next) => {
    try {
        // Check if token exists in cookies
        const token = req.cookies?.admin_token; 
        if (!token) throw new Error("No token provided");

        // Verify JWT
        const decoded = jwt.verify(token, "yourSecretKey"); // Ensure this matches the secret key used in `generateAuthToken`

        // Find Admin in Database
        const admin = await Admin.findOne({ _id: decoded._id, "tokens.token": token });
        if (!admin) throw new Error("Authentication failed");

        // Attach User to Request
        req.user = admin;
        req.token = token;
        next();
    } catch (error) {
        console.error("Authentication Error:", error.message);
        res.status(401).json({ error: "Please authenticate!" });
    }
};

module.exports = adminAuth;
