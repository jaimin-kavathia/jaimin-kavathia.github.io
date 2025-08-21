#!/usr/bin/env node

import fs from "fs";
import path from "path";
import process from "process";

console.log("🔍 Deployment Debug Information");
console.log("================================");

console.log("\n📦 Environment Variables:");
console.log("NODE_ENV:", process.env.NODE_ENV || "undefined");
console.log(
  "VITE_FIREBASE_API_KEY:",
  process.env.VITE_FIREBASE_API_KEY ? "✅ Set" : "❌ Missing"
);
console.log(
  "VITE_FIREBASE_AUTH_DOMAIN:",
  process.env.VITE_FIREBASE_AUTH_DOMAIN ? "✅ Set" : "❌ Missing"
);
console.log(
  "VITE_FIREBASE_PROJECT_ID:",
  process.env.VITE_FIREBASE_PROJECT_ID ? "✅ Set" : "❌ Missing"
);
console.log(
  "VITE_FIREBASE_STORAGE_BUCKET:",
  process.env.VITE_FIREBASE_STORAGE_BUCKET ? "✅ Set" : "❌ Missing"
);
console.log(
  "VITE_FIREBASE_MESSAGING_SENDER_ID:",
  process.env.VITE_FIREBASE_MESSAGING_SENDER_ID ? "✅ Set" : "❌ Missing"
);
console.log(
  "VITE_FIREBASE_APP_ID:",
  process.env.VITE_FIREBASE_APP_ID ? "✅ Set" : "❌ Missing"
);
console.log(
  "VITE_FIREBASE_MEASUREMENT_ID:",
  process.env.VITE_FIREBASE_MEASUREMENT_ID ? "✅ Set" : "❌ Missing"
);

console.log("\n🏗️ Build Information:");
console.log("Platform:", process.platform);
console.log("Node Version:", process.version);
console.log("Working Directory:", process.cwd());

console.log("\n📁 Checking dist folder...");
const distPath = path.join(process.cwd(), "dist");

if (fs.existsSync(distPath)) {
  console.log("✅ dist folder exists");
  const files = fs.readdirSync(distPath);
  console.log("📄 Files in dist:", files.join(", "));

  if (files.includes("index.html")) {
    console.log("✅ index.html found");
  } else {
    console.log("❌ index.html missing");
  }

  if (files.includes("assets")) {
    console.log("✅ assets folder found");
    const assetsPath = path.join(distPath, "assets");
    const assetFiles = fs.readdirSync(assetsPath);
    console.log(
      "📄 Assets:",
      assetFiles.slice(0, 5).join(", "),
      assetFiles.length > 5 ? "..." : ""
    );
  } else {
    console.log("❌ assets folder missing");
  }
} else {
  console.log("❌ dist folder does not exist");
}

console.log("\n✅ Debug complete");
