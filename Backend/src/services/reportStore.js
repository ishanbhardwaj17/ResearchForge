import fs from "fs";
import path from "path";
import mongoose from "mongoose";
import { Report } from "../models/Report.js";

const dataDir = path.resolve(process.cwd(), "data");
const reportsPath = path.join(dataDir, "reports.json");

function ensureReportsFile() {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  if (!fs.existsSync(reportsPath)) {
    fs.writeFileSync(reportsPath, JSON.stringify({ reports: [] }, null, 2));
  }
}

function readReports() {
  ensureReportsFile();
  return JSON.parse(fs.readFileSync(reportsPath, "utf8"));
}

function writeReports(payload) {
  ensureReportsFile();
  fs.writeFileSync(reportsPath, JSON.stringify(payload, null, 2));
}

export async function saveReport(report) {
  const payload = readReports();
  payload.reports.push({
    ...report,
    createdAt: new Date().toISOString(),
  });
  writeReports(payload);

  try {
    if (mongoose.connection.readyState === 1) {
      await Report.create(report);
    }
  } catch (error) {
    console.warn("Skipping MongoDB report persistence:", error.message);
  }
}
