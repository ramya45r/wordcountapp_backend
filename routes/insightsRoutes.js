const express = require("express");
const router = express.Router();
const axios = require("axios");
const cheerio = require("cheerio");
const Insight = require("../models/Insight");

// POST- Get insights
router.post("/", async (req, res) => {
  const { url } = req.body;
  console.log(url);
  
  if (!url || !/^https?:\/\/[^\s]+$/i.test(url)) {
    return res.status(400).json({ error: "Invalid or missing URL format." });
}

  try {
    const response = await axios.get(url, {
        headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        },
    });
        const $ = cheerio.load(response.data);
console.log(response)

    const wordCount = $("body").text().split(/\s+/).length;
    const images = $("img").map((_, el) => $(el).attr("src")).get();
    const videos = $("video").map((_, el) => $(el).attr("src")).get();

    const newInsight = new Insight({ url, wordCount, media: { images, videos } });
    await newInsight.save();

    res.status(200).json(newInsight);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch website data." });
  }
});

// GET- List all insights
router.get("/", async (req, res) => {
  try {
    const insights = await Insight.find().sort({ createdAt: -1 });
    res.status(200).json(insights);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch insights." });
  }
});

// DELETE- Remove insight
router.delete("/:id", async (req, res) => {
  try {
    await Insight.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Insight removed successfully." });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete insight." });
  }
});

// PUT- Mark as favorite
router.put("/:id/favorite", async (req, res) => {
  const { isFavorite } = req.body;
  try {
    const updatedInsight = await Insight.findByIdAndUpdate(
      req.params.id,
      { isFavorite },
      { new: true }
    );
    res.status(200).json(updatedInsight);
  } catch (error) {
    res.status(500).json({ error: "Failed to update insight." });
  }
});

module.exports = router;
