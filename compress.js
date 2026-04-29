const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const os = require('os');

const INPUT_DIR = path.join(__dirname, 'images');
const OUTPUT_DIR = path.join(__dirname, 'comp-images');
const CACHE_DIR = path.join(os.homedir(), 'comp-images');

const IMG_EXTS = new Set(['.jpg', '.jpeg', '.png']);

function kb(b) { return (b / 1024).toFixed(0) + ' KB'; }
function saved(orig, comp) { return (((orig - comp) / orig) * 100).toFixed(1) + '%'; }

async function run() {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  fs.mkdirSync(CACHE_DIR, { recursive: true });

  const files = fs.readdirSync(INPUT_DIR)
    .filter(f => IMG_EXTS.has(path.extname(f).toLowerCase()));

  if (files.length === 0) {
    console.log('No images found in images/');
    return;
  }

  let totalOrig = 0, totalComp = 0;

  for (const file of files) {
    const srcPath   = path.join(INPUT_DIR, file);
    const outPath   = path.join(OUTPUT_DIR, file);
    const cachePath = path.join(CACHE_DIR, file);
    const origSize  = fs.statSync(srcPath).size;
    totalOrig += origSize;

    if (fs.existsSync(cachePath)) {
      fs.copyFileSync(cachePath, outPath);
      const compSize = fs.statSync(outPath).size;
      totalComp += compSize;
      console.log(`  ↩  ${file.padEnd(30)} ${kb(origSize).padStart(8)} → ${kb(compSize).padStart(8)}  (${saved(origSize, compSize)} saved) [from cache]`);
      continue;
    }

    const ext = path.extname(file).toLowerCase();
    if (ext === '.png') {
      await sharp(srcPath).png({ compressionLevel: 9, adaptiveFiltering: true }).toFile(outPath);
    } else {
      await sharp(srcPath).jpeg({ quality: 85, progressive: true, mozjpeg: true }).toFile(outPath);
    }

    fs.copyFileSync(outPath, cachePath);
    const compSize = fs.statSync(outPath).size;
    totalComp += compSize;
    console.log(`  ✓  ${file.padEnd(30)} ${kb(origSize).padStart(8)} → ${kb(compSize).padStart(8)}  (${saved(origSize, compSize)} saved)`);
  }

  const line = '─'.repeat(62);
  console.log(`\n${line}`);
  console.log(`  Total: ${kb(totalOrig)} → ${kb(totalComp)}  (${saved(totalOrig, totalComp)} saved overall)`);
  console.log(line);
}

run().catch(err => { console.error(err); process.exit(1); });
