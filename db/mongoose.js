const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

mongoose.connect('mongodb://127.0.0.1:27017/BudPortalDB', {
  serverSelectionTimeoutMS: 30000 // 30 seconds timeout
})
  .then(() => console.log("Connected to MongoDB"));
//let db = mongoose.connection;

// // Check connection
// db.once("open", () => {
//   console.log("Connected to mongodb");
// });

