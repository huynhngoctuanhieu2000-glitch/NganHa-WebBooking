/**
 * Upload all images from public/images/ to imgBB
 * One-off script - delete after use
 */
const fs = require('fs');
const path = require('path');

const API_KEY = process.env.IMGBB_API_KEY || '190a729cfc10315776921e25c45e9547';
const BASE_DIR = path.join(__dirname, '..', 'public', 'images');

// Collect all image files recursively
const collectImages = (dir, prefix = '') => {
  const results = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const relativePath = prefix ? `${prefix}/${entry.name}` : entry.name;
    if (entry.isDirectory()) {
      results.push(...collectImages(fullPath, relativePath));
    } else if (/\.(png|jpg|jpeg|webp|gif)$/i.test(entry.name)) {
      results.push({ fullPath, relativePath });
    }
  }
  return results;
};

const uploadToImgBB = async (filePath, fileName) => {
  const base64 = fs.readFileSync(filePath, { encoding: 'base64' });
  const nameWithoutExt = path.basename(fileName, path.extname(fileName));

  const formBody = new URLSearchParams();
  formBody.append('key', API_KEY);
  formBody.append('image', base64);
  formBody.append('name', nameWithoutExt);

  const res = await fetch('https://api.imgbb.com/1/upload', {
    method: 'POST',
    body: formBody,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Upload failed for ${fileName}: ${res.status} ${text}`);
  }

  const json = await res.json();
  return {
    url: json.data.url,
    display_url: json.data.display_url,
    delete_url: json.data.delete_url,
  };
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const main = async () => {
  const images = collectImages(BASE_DIR);
  console.log(`Found ${images.length} images to upload.\n`);

  const results = {};
  let success = 0;
  let failed = 0;

  for (const img of images) {
    const localPath = `/images/${img.relativePath}`;
    console.log(`Uploading: ${localPath}...`);

    try {
      const result = await uploadToImgBB(img.fullPath, img.relativePath);
      results[localPath] = result.display_url;
      console.log(`  ✅ ${result.display_url}`);
      success++;
    } catch (err) {
      console.error(`  ❌ ${err.message}`);
      results[localPath] = `ERROR: ${err.message}`;
      failed++;
    }

    // Rate limit: wait 1.5s between uploads
    await sleep(1500);
  }

  // Save mapping to file
  const outputPath = path.join(__dirname, 'imgbb-mapping.json');
  fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));

  console.log(`\n========================================`);
  console.log(`Done! ${success} succeeded, ${failed} failed.`);
  console.log(`Mapping saved to: ${outputPath}`);
  console.log(`========================================\n`);

  // Print the mapping for easy copy
  console.log('MAPPING:');
  for (const [local, remote] of Object.entries(results)) {
    console.log(`  ${local} => ${remote}`);
  }
};

main().catch(console.error);
