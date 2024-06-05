const cloudinary = require("cloudinary").v2;
const { config } = require("dotenv");
config({ path: `.env` });
const path = require("path");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

async function uploadWeeklyReportToCloud(fileName) {
  try {
    const localWeeklyReportPath = path.resolve(
      __dirname,
      "../uploads",
      fileName
    );
    await cloudinary.uploader.upload(localWeeklyReportPath, {
      public_id: `health-and-wealth-management-platform/${localWeeklyReportPath}`,
      resource_type: "auto",
      folder: "health-and-wellness-management",
    });
    return true;
  } catch (error) {
    console.error("Error Uploading an report to cloud", error);
    return false;
  }
}

module.exports = uploadWeeklyReportToCloud;
