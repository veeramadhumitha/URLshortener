const express = require("express");
const cors = require("cors");

const {
  redirectUrl,
} = require("./controllers/urlController");

const authRoutes = require("./routes/authRoutes");
const urlRoutes = require("./routes/urlRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "URL Shortener API Running",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/url", urlRoutes);

app.get("/:shortCode", redirectUrl);

module.exports = app;