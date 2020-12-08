import sharp from 'sharp';

sharp.cache(false);

async function resizeFile(path, size) {
  const buffer = await sharp(path)
    .resize(size)
    .jpeg({ quality: 50 })
    .toBuffer();
  return sharp(buffer).toFile(path);
}

async function reduceQualityFile(path, quality) {
  const buffer = await sharp(path)
    .jpeg({ quality, force: false })
    .png({ quality, force: false })
    .toBuffer();
  return sharp(buffer).toFile(path);
}

export { resizeFile, reduceQualityFile };
