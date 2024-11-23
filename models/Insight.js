const mongoose = require("mongoose");

const InsightSchema = new mongoose.Schema({
  url: { type: String, required: true },
  wordCount: { type: Number, required: true },
  media: {
    images: [String],
    videos: [String],
  },
  isFavorite: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Insight", InsightSchema);
