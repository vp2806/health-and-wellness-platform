const db = require("../models");
const { medication_report } = db;

async function createMedicationReport(medicationReportPayLoad) {
  try {
    const newMedicationReport = await medication_report.create(
      medicationReportPayLoad
    );
    return newMedicationReport;
  } catch (error) {
    console.error("Error creating a medication report", error);
    throw error;
  }
}

async function getMedicationReports(options) {
  try {
    const getAllMedicationReports = await medication_report.findAll(options);
    return getAllMedicationReports;
  } catch (error) {
    console.error("Error getting a medication report", error);
    throw error;
  }
}

module.exports = { createMedicationReport, getMedicationReports };
