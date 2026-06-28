#!/usr/bin/env node
import { readdir, stat } from 'node:fs/promises';
import { basename, dirname, join } from 'node:path';
import sharp from 'sharp';

const imageDirectory = join(process.cwd(), 'public/images');
const avifQuality = 48;

async function getRootWebpFiles() {
  const entries = await readdir(imageDirectory, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isFile() && entry.name.endsWith('.webp'))
    .map((entry) => join(imageDirectory, entry.name));
}

async function writeAvif(inputPath) {
  const outputPath = join(dirname(inputPath), `${basename(inputPath, '.webp')}.avif`);
  await sharp(inputPath)
    .avif({
      effort: 6,
      quality: avifQuality,
    })
    .toFile(outputPath);

  const [inputStats, outputStats] = await Promise.all([stat(inputPath), stat(outputPath)]);
  return {
    inputPath,
    outputPath,
    inputBytes: inputStats.size,
    outputBytes: outputStats.size,
  };
}

async function main() {
  const files = await getRootWebpFiles();
  const results = [];

  for (const file of files) {
    results.push(await writeAvif(file));
  }

  const inputBytes = results.reduce((sum, result) => sum + result.inputBytes, 0);
  const outputBytes = results.reduce((sum, result) => sum + result.outputBytes, 0);

  console.log(
    JSON.stringify(
      {
        generated: results.length,
        inputBytes,
        outputBytes,
        savedBytes: inputBytes - outputBytes,
      },
      null,
      2,
    ),
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
