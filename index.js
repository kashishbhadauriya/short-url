const express = require("express");
const mongoose = require("mongoose");
const shortId = require("shortid");

const app = express();
const PORT = 8003;

app.use(express.json());

mongoose.connect("mongodb://localhost:27017/short-url")
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("MongoDB connection error:", err));

const urlSchema = new mongoose.Schema({
  shortId: String,
  redirectURL: String,
  visitHistory: [{ timestamp: Number }],
});

const URL = mongoose.model("URL", urlSchema);

app.post("/url", async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: "URL is required" });
  }

  const id = shortId.generate();

  try {
    await URL.create({
      shortId: id,
      redirectURL: url,
      visitHistory: [],
    });
    res.json({ id });
  } catch (error) {
    res.status(600).json({ error: "Server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
