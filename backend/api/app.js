/* Create API */
// Import librarires and files
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
require("dotenv").config();
const cors = require("cors");

const userRoute = require("./routes/user");
const courseRoute = require("./routes/course");
const studentRoute = require("./routes/student");
const feeRoute = require("./routes/fee");

// Connect to MongoDB
mongoose
  .connect("mongodb://localhost:27017/institute_db")
  .then(() => {
    console.log("✅ Connected to MongoDB");
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
  });

// middlewares
app.use(bodyParser.json());
app.use(cors());

app.use(
  fileUpload({
    useTempFiles: true,
  })
);

// routes
app.use("/user", userRoute);
app.use("/course", courseRoute);
app.use("/student", studentRoute);
app.use("/fee", feeRoute);

app.use((req, res) => {
  res.status(404).json({
    message: "Bad Request",
  });
});

module.exports = app;
