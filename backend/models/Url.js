const mongoose = require("mongoose");

const urlSchema = new mongoose.Schema(
  {
    originalUrl: {
      type: String,
      required: true,
    },

    shortCode: {
      type: String,
      required: true,
      unique: true,
    },

    customAlias: {
      type: String,
      default: null,
    },

    clicks: {
      type: Number,
      default: 0,
    },

    lastVisited: {
      type: Date,
      default: null,
    },
    expiresAt: {
  type: Date,
  default: null,
},
visitHistory: [
  {
    timestamp: {
      type: Date,
      default: Date.now,
    },

    browser: String,

    device: String,
  },
],

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      default: "",
    },

    website: {
      type: String,
      default: "",
    },

    category: {
      type: String,
      default: "Other",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Url", urlSchema);