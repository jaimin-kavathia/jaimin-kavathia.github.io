#!/usr/bin/env node

// Simple script to debug deployment issues
console.log('🔍 Deployment Debug Information');
console.log('================================');

console.log('\n📦 Environment Variables:');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('VITE_EMAILJS_SERVICE_ID:', process.env.VITE_EMAILJS_SERVICE_ID ? '✅ Set' : '❌ Missing');
console.log('VITE_EMAILJS_TEMPLATE_ID:', process.env.VITE_EMAILJS_TEMPLATE_ID ? '✅ Set' : '❌ Missing');
console.log('VITE_EMAILJS_PUBLIC_KEY:', process.env.VITE_EMAILJS_PUBLIC_KEY ? '✅ Set' : '❌ Missing');
console.log('VITE_EMAILJS_PRIVATE_KEY:', process.env.VITE_EMAILJS_PRIVATE_KEY ? '✅ Set' : '❌ Missing');

console.log('\n🏗️ Build Information:');
console.log('Platform:', process.platform);
console.log('Node Version:', process.version);
console.log('Working Directory:', process.cwd());

console.log('\n📁 Checking dist folder...');
const fs = require('fs');
const path = require('path');

const distPath = path.join(process.cwd(), 'dist');
if (fs.existsSync(distPath)) {
  console.log('✅ dist folder exists');
  const files = fs.readdirSync(distPath);
  console.log('📄 Files in dist:', files.join(', '));
  
  // Check for index.html
  if (files.includes('index.html')) {
    console.log('✅ index.html found');
  } else {
    console.log('❌ index.html missing');
  }
  
  // Check for assets folder
  if (files.includes('assets')) {
    console.log('✅ assets folder found');
    const assetsPath = path.join(distPath, 'assets');
    const assetFiles = fs.readdirSync(assetsPath);
    console.log('📄 Assets:', assetFiles.slice(0, 5).join(', '), assetFiles.length > 5 ? '...' : '');
  } else {
    console.log('❌ assets folder missing');
  }
} else {
  console.log('❌ dist folder does not exist');
}

console.log('\n✅ Debug complete');