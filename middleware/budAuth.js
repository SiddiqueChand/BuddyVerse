const jwt = require("jsonwebtoken");
const Bud = require("../models/Bud");

const BudAuth = async (req, res, next) => {
    try {
        const token = req.cookies?.Bud_token;
        if (!token) throw new Error("No token provided");

        const decoded = jwt.verify(token, "yourSecretKey"); // Make sure this matches the secret key used in `generateAuthToken`
        
        const bud = await Bud.findOne({ _id: decoded._id, "tokens.token": token });
        if (!bud) throw new Error("Authentication failed");

        req.user = bud;
        req.token = token;
        next();
    } catch (error) {
        console.error("Bud Authentication Error:", error.message);
        res.status(401).json({ error: "Please authenticate!" });
    }
};

module.exports = BudAuth;
