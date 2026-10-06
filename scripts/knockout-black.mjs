import sharp from "sharp";

/** Turn near-black RGB into transparency, keeping colored pixels. */
async function knockOutBlack(input, output, threshold = 28) {
  const { data, info } = await sharp(input)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    if (r <= threshold && g <= threshold && b <= threshold) {
      data[i + 3] = 0;
    }
  }

  await sharp(data, {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .webp({ quality: 92 })
    .toFile(output.replace(/\.png$/, ".webp"));

  await sharp(data, {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .png()
    .toFile(output);

  const st = await sharp(output).stats();
  console.log(
    output,
    `${info.width}x${info.height}`,
    "meanA",
    st.channels[3].mean.toFixed(1),
  );
}

await knockOutBlack("public/images/parts/bg-wash.png", "public/images/parts/floral-frame.png", 30);
await knockOutBlack("public/images/parts/raw/Frame-38-svg-1.png", "public/images/parts/faint-vine.png", 20);
