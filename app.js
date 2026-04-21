//Requiring all the installed packages
const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const { MongoClient } = require("mongodb");
const path = require("path");
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
var session = require("express-session");
const flash = require("connect-flash");
const errmessages = require("express-messages");
const Admin = require("./models/admin");
const Bud = require("./models/Bud");
const Buddy = require("./models/Buddy");
const mongoose = require("mongoose");
const multer = require('multer');
const fs = require('fs');
const cloudinary = require('cloudinary').v2;
require('dotenv').config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: "dqkbrfstl",
  api_key: "395296928766943",
  api_secret: "aym1C8-464voNCYzLn_eVdbUcrY",
});

const server = http.createServer(app);
const io = new Server(server);

// Configure Multer storage: files will be stored temporarily in the "uploads" folder.
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Ensure this folder exists in your project root
  },
  filename: function (req, file, cb) {
    // Create a unique filename using a timestamp and the original filename.
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// Serve static files from the "uploads" folder (for temporary access if needed).
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// HTTP endpoint to handle file uploads and send them to Cloudinary.
app.post('/upload', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  try {
    // Upload the file from local storage to Cloudinary under the "chat_uploads" folder.
    const result = await cloudinary.uploader.upload(req.file.path, { folder: 'chat_uploads' });
    const fileUrl = result.secure_url;
    // Optionally remove the file from local storage after upload.
    fs.unlink(req.file.path, (err) => {
      if (err) console.error("Error deleting local file:", err);
    });
    // Return the Cloudinary URL along with the original file name.
    res.json({ fileUrl, fileName: req.file.originalname });
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    res.status(500).json({ error: 'Cloudinary upload failed' });
  }
});

// Express Session Middleware
app.use(session({
    secret: "keyboard cat",
    resave: true,
    saveUninitialized: true,
  })
);

// Express Messages Middleware
app.use(require("connect-flash")());
app.use(function (req, res, next) {
  res.locals.errmessages = req.flash();
  next();
});

// Connect Flash Middleware
app.use(flash());

//Requiring the database
require("./db/mongoose");

const db = mongoose.connection;
// Collection for storing both text and file messages
const messagesCollection = db.collection("private_messages");

// Using express utilities
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.set('view engine','ejs');
app.use(express.static(`${__dirname}/public`));
app.use(express.static(`${__dirname}/router`));

// Setting local variables for templates
app.use("*", async (req, res, next) => {
  if (req.body.adminUsername != undefined) {
    const admin = await Admin.findOne(
      { adminUsername: req.body.adminUsername },
      { tokens: 0 }
    );
    app.locals.adminUser = admin;
    res.locals.adminUser = admin;
  }
  if (req.body.BudID != undefined) {
    const bud = await Bud.findOne(
      { BudID: req.body.BudID },
      { tokens: 0 }
    );
    app.locals.BudUser = bud;
    res.locals.BudUser = bud;
  }
  if (req.body.BuddyID != undefined) {  
    const buddy = await Buddy.findOne(
      { BuddyID: req.body.BuddyID },
      { tokens: 0 }
    );
    app.locals.BuddyUser = buddy;
    res.locals.BuddyUser = buddy;
  }
  next();
});

// WebSocket Connection
io.on("connection", (socket) => {
  console.log("👤 User connected:", socket.id);

  socket.on("register", (userId) => {
      socket.userId = userId;
      console.log(`✅ ${userId} registered with socket ID: ${socket.id}`);
  });

  socket.on("private message", async ({ to, message }) => {
      const from = socket.userId;
      if (!from || !to || !message) return;

      // Save text message with type 'text'
      const messageData = {
        sender: from,
        receiver: to,
        type: "text",
        message: message,
        timestamp: new Date(),
      };
      await messagesCollection.insertOne(messageData);

      const sockets = await io.fetchSockets();
      const targetSocket = sockets.find((s) => s.userId === to);
      if (targetSocket) {
        targetSocket.emit("private message", { sender: from, message });
      }
      socket.emit("private message", { sender: from, message });
  });

  socket.on("get history", async ({ to }) => {
    const from = socket.userId;
    if (!from || !to) return;

    const chatHistory = await messagesCollection
      .find({
        $or: [{ sender: from, receiver: to }, { sender: to, receiver: from }],
      })
      .sort({ timestamp: 1 })
      .toArray();

    socket.emit("chat history", { messages: chatHistory });
  });

  socket.on("private file", async ({ to, fileName, fileData }) => {
      const from = socket.userId;
      if (!from || !to || !fileName || !fileData) return;
      
      // Save file message with type 'file'
      const messageData = {
        sender: from,
        receiver: to,
        type: "file",
        message: fileData, // fileData holds the Cloudinary URL
        fileName: fileName,
        timestamp: new Date(),
      };
      await messagesCollection.insertOne(messageData);

      const sockets = await io.fetchSockets();
      const targetSocket = sockets.find(s => s.userId === to);
      if (targetSocket) {
          targetSocket.emit("private file", { sender: from, fileName, fileData });
      }
      socket.emit("private file", { sender: from, fileName, fileData });
  });

  socket.on("disconnect", () => {
      console.log(`${socket.userId || "User"} disconnected`);
  });
});

//Requiring the routers
const homePageRouter = require("./router/main");
const adminRouter = require("./router/admin");
const BudRouter = require("./router/bud");
const BuddyRouter = require("./router/buddy");
const userAccessRouter = require("./router/userAccess");
const eventsRouter = require("./router/events");
const { json } = require("body-parser");
const { JSONCookie, JSONCookies } = require("cookie-parser");
const pdfRouter = require("./router/smh"); // 🔹 Added PDF Routes

//Using these routers
app.use(homePageRouter);
app.use(adminRouter);
app.use(BudRouter);
app.use(BuddyRouter);
app.use(userAccessRouter);
app.use(eventsRouter);
app.use("/pdf", pdfRouter); // 🔹 Mount PDF Routes

// ADD AS THE LAST MIDDLEWARE
app.use((err, req, res, _next) => {
  console.error(err.stack);
  res.status(500).render('error', {
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

const mainRoutes = require('./router/main');
app.use('/', mainRoutes);

//Setting server to listen on port 3000 locally.
server.listen(3000, async (req, res) => {
    console.log("Server is up and running!");
});
