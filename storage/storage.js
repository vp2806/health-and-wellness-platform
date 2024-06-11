const cloudinary = require("cloudinary").v2;
const { config } = require("dotenv");
config({ path: `.env` });
const path = require("path");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

async function uploadWeeklyReportToCloud(fileBuffer, fileName) {
  try {
    const uploadReport = await new Promise((resolve) => {
      cloudinary.uploader
        .upload_stream(
          {
            public_id: `health-and-wealth-management-platform/${fileName}`,
            resource_type: "auto",
            folder: "health-and-wellness-management",
          },
          (error, result) => {
            return resolve(result);
          }
        )
        .end(fileBuffer);
    });
    return uploadReport;
  } catch (error) {
    console.error("Error Uploading an report to cloud", error);
    return false;
  }
}

module.exports = uploadWeeklyReportToCloud;
