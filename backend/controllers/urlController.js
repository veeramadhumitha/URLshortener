const Url = require("../models/Url");
const validator = require("validator");
const generateCode = require("../utils/generateCode");

// Create Short URL
const createUrl = async (req, res) => {
  try {
    const {
      originalUrl,
      customAlias,
      expiryDays,
    } = req.body;

    // URL Validation
    if (
      !validator.isURL(originalUrl, {
        require_protocol: true,
      })
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Please enter a valid URL including https://",
      });
    }

    let shortCode;

    // Custom Alias
    if (customAlias && customAlias.trim() !== "") {
      const existingAlias = await Url.findOne({
        shortCode: customAlias,
      });

      if (existingAlias) {
        return res.status(400).json({
          success: false,
          message: "Alias already exists",
        });
      }

      shortCode = customAlias;
    } else {
      shortCode = generateCode();
    }

    // Expiry Date
    let expiresAt = null;

    if (expiryDays) {
      expiresAt = new Date();

      expiresAt.setDate(
        expiresAt.getDate() +
          Number(expiryDays)
      );
    }

    const url = await Url.create({
      originalUrl,
      shortCode,
      customAlias,
      expiresAt,
      userId: req.user.id,
    });

    res.status(201).json({
      success: true,
      data: url,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Redirect URL
const redirectUrl = async (req, res) => {
  try {
    const { shortCode } = req.params;

    const url = await Url.findOne({
      shortCode,
    });

    if (!url) {
      return res.status(404).json({
        success: false,
        message: "URL not found",
      });
    }

    // Expiry Check
    if (
      url.expiresAt &&
      new Date() > url.expiresAt
    ) {
      return res.status(410).json({
        success: false,
        message: "This link has expired",
      });
    }

    url.clicks += 1;

    url.lastVisited = new Date();
   const userAgent =
  req.headers["user-agent"] || "";

let browser = "Unknown";

if (userAgent.includes("Chrome"))
  browser = "Chrome";

if (userAgent.includes("Firefox"))
  browser = "Firefox";

if (userAgent.includes("Edg"))
  browser = "Edge";

let device = "Desktop";

if (
  /Android|iPhone|iPad|Mobile/i.test(
    userAgent
  )
) {
  device = "Mobile";
}
    url.visitHistory.push({
      timestamp: new Date(),
      browser,
      device,
    });

    await url.save();

    return res.redirect(url.originalUrl);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get User URLs
const getMyUrls = async (req, res) => {
  try {
    const urls = await Url.find({
      userId: req.user.id,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: urls.length,
      data: urls,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete URL
const deleteUrl = async (req, res) => {
  try {
    const url = await Url.findById(
      req.params.id
    );

    if (!url) {
      return res.status(404).json({
        success: false,
        message: "URL not found",
      });
    }

    if (
      url.userId.toString() !==
      req.user.id
    ) {
      return res.status(401).json({
        success: false,
        message: "Not authorized",
      });
    }

    await Url.findByIdAndDelete(
      req.params.id
    );

    res.status(200).json({
      success: true,
      message:
        "URL deleted successfully",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const updateUrl = async (req, res) => {
  try {
    const { originalUrl } = req.body;

    const url = await Url.findById(req.params.id);

    if (!url) {
      return res.status(404).json({
        success: false,
        message: "URL not found",
      });
    }

    if (
      url.userId.toString() !==
      req.user.id
    ) {
      return res.status(401).json({
        success: false,
        message: "Not authorized",
      });
    }

    url.originalUrl = originalUrl;

    await url.save();

    res.status(200).json({
      success: true,
      message: "URL updated successfully",
      data: url,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// Analytics
const getAnalytics = async (
  req,
  res
) => {
  try {
    const url = await Url.findById(
      req.params.id
    );

    if (!url) {
      return res.status(404).json({
        success: false,
        message: "URL not found",
      });
    }

    res.status(200).json({
      success: true,
      data: {
        originalUrl:
          url.originalUrl,
        shortCode:
          url.shortCode,
        clicks: url.clicks,
        lastVisited:
          url.lastVisited,
        visitHistory:
          url.visitHistory,
        expiresAt:
          url.expiresAt,
        createdAt:
          url.createdAt,
      },
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const getPublicStats = async (req, res) => {
  try {
    const url = await Url.findOne({
      shortCode: req.params.shortCode,
    });

    if (!url) {
      return res.status(404).json({
        success: false,
        message: "URL not found",
      });
    }

    res.status(200).json({
      success: true,
      data: url,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
module.exports = {
  createUrl,
  redirectUrl,
  getMyUrls,
  deleteUrl,
  getAnalytics,
  updateUrl,
  getPublicStats,
};