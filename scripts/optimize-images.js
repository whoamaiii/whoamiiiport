#!/usr/bin/env node
/**
 * Image Optimization Script
 * Generates responsive variants from source assets using Sharp
 * 
 * Profiles:
 * - hero: 720/960/1440w variants for hero section
 * - gallery: 480/560/800/1024/1200w variants for gallery cards
 * - modal: 800/1200/1600w variants for artwork modals
 */

import sharp from 'sharp';
import { existsSync, mkdirSync, statSync } from 'fs';
import { join } from 'path';

// Source image configurations.
// Only slugs with originals under src/assets/ belong here. The current gallery
// artworks (mushroom-offering, mycelial-hand, hand-portal-video-poster,
// skin-terrain-video-poster) and the workflow carousel are manually managed
// runtime assets under public/images/ until their originals are recovered —
// see CLAUDE.md and tests/image-contract.test.ts.
const SOURCES = [
  {
    input: './src/assets/liquid-perception-hero.png',
    slug: 'liquid-perception-hero',
    profile: 'hero',
    alt: 'Liquid psychedelic forest portrait with chrome face distortion and red nails',
    quality: 45,
  },
  {
    input: './src/assets/liquid-perception.jpg',
    slug: 'liquid-perception',
    profile: 'gallery',
    alt: 'Surreal hooded forest portrait with chrome face fragments, red nails, and an electric cellular sky',
    quality: 70,
    qualityByWidth: {
      480: 25,
      560: 45,
    },
  },
];

// Output directory
const OUTPUT_DIR = './public/images';

// Size variants by profile
const PROFILES = {
  hero: [720, 960, 1440],
  gallery: [480, 560, 800, 1024, 1200],
};
const MODAL_WIDTHS = [800, 1200, 1600];

const DEFAULT_QUALITY = 65;

async function optimizeImage(source) {
  const { input, slug, profile, alt } = source;
  const quality = source.quality ?? DEFAULT_QUALITY;
  const qualityByWidth = source.qualityByWidth ?? {};
  const modalWidths = source.modalWidths ?? MODAL_WIDTHS;
  const result = {
    errorCount: 0,
    generatedCount: 0,
  };
  
  console.log(`\n📷 Processing: ${slug} (${profile})`);
  console.log(`   Source: ${input}`);
  console.log(`   Alt: ${alt}`);

  if (!existsSync(input)) {
    console.error(`   ❌ Source file not found: ${input}`);
    result.errorCount++;
    return result;
  }

  // Get base sizes for this profile
  const sizes = PROFILES[profile];
  
  const image = sharp(input);
  let metadata;

  try {
    metadata = await image.metadata();
  } catch (error) {
    console.error(`   ❌ Failed to read source metadata:`, error.message);
    result.errorCount++;
    return result;
  }
  
  console.log(`   Original: ${metadata.width}x${metadata.height}`);

  for (const width of sizes) {
    // Skip if target width is larger than original
    if (metadata.width && width > metadata.width) {
      console.log(`   ⏭️  Skipping ${width}w (larger than original)`);
      continue;
    }

    const outputFilename = `${slug}-${width}.webp`;
    const outputPath = join(OUTPUT_DIR, outputFilename);

    try {
      await image
        .clone()
        .resize(width, null, { 
          withoutEnlargement: true,
          fit: 'inside',
        })
        .webp({ 
          quality: qualityByWidth[width] ?? quality,
          effort: 6, // Compression effort (0-6, higher = smaller file)
        })
        .toFile(outputPath);

      const stats = statSync(outputPath);
      const sizeKB = (stats.size / 1024).toFixed(1);

      console.log(`   ✅ ${outputFilename} (${sizeKB} KB)`);
      result.generatedCount++;
    } catch (error) {
      console.error(`   ❌ Failed to generate ${width}w:`, error.message);
      result.errorCount++;
    }
  }

  if (profile === 'gallery') {
    for (const modalWidth of modalWidths) {
      if (metadata.width && modalWidth > metadata.width) {
        console.log(`   ⏭️  Skipping modal ${modalWidth}w (larger than original)`);
        continue;
      }

      const modalFilename = `${slug}-modal-${modalWidth}.webp`;
      const modalPath = join(OUTPUT_DIR, modalFilename);

      try {
        await image
          .clone()
          .resize(modalWidth, null, {
            withoutEnlargement: true,
            fit: 'inside',
          })
          .webp({
            quality,
            effort: 6,
          })
          .toFile(modalPath);

        const stats = statSync(modalPath);
        const sizeKB = (stats.size / 1024).toFixed(1);

        console.log(`   ✅ ${modalFilename} (${sizeKB} KB)`);
        result.generatedCount++;
      } catch (error) {
        console.error(`   ❌ Failed to generate modal ${modalWidth}w:`, error.message);
        result.errorCount++;
      }
    }
  }

  return result;
}

async function main() {
  console.log('🚀 Starting image optimization...\n');
  console.log(`Output directory: ${OUTPUT_DIR}`);

  // Ensure output directory exists
  if (!existsSync(OUTPUT_DIR)) {
    mkdirSync(OUTPUT_DIR, { recursive: true });
    console.log('Created output directory');
  }

  let successCount = 0;
  let failCount = 0;
  let generatedCount = 0;
  let errorCount = 0;

  for (const source of SOURCES) {
    const result = await optimizeImage(source);
    generatedCount += result.generatedCount;
    errorCount += result.errorCount;

    if (result.generatedCount > 0 && result.errorCount === 0) {
      successCount++;
    } else {
      failCount++;
    }
  }

  console.log('\n' + '='.repeat(50));
  console.log('✨ Optimization complete!');
  console.log(`   Success: ${successCount}/${SOURCES.length}`);
  console.log(`   Failed: ${failCount}/${SOURCES.length}`);
  console.log(`   Generated files: ${generatedCount}`);
  console.log(`   Errors: ${errorCount}`);
  console.log('='.repeat(50));

  if (errorCount > 0) {
    process.exitCode = 1;
  }
}

main().catch(error => {
  console.error('💥 Fatal error:', error);
  process.exit(1);
});
