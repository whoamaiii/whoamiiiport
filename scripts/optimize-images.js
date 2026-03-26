#!/usr/bin/env node
/**
 * Image Optimization Script
 * Generates responsive variants from source assets using Sharp
 * 
 * Profiles:
 * - hero: 960/1440/1920w variants for hero section
 * - gallery: 480/800/1200w variants for gallery cards
 */

import sharp from 'sharp';
import { existsSync, mkdirSync, statSync } from 'fs';
import { join } from 'path';

// Source image configurations
const SOURCES = [
  { 
    input: './src/assets/joetrip2.webp', 
    slug: 'joetrip2', 
    profile: 'hero',
    alt: 'Hero artwork - psychedelic portrait',
    quality: 65,
  },
  { 
    input: './src/assets/jennysnøøø.webp', 
    slug: 'jennysno', 
    profile: 'gallery',
    alt: 'Where Snow Holds Time',
    quality: 65,
    modalWidth: 1600,
  },
  { 
    input: './src/assets/8a dimensiontripp.webp', 
    slug: 'dimensiontripp', 
    profile: 'gallery',
    alt: 'The Eighth Interior',
    quality: 52,
    modalWidth: 1600,
  },
  { 
    input: './src/assets/loongdrive.png', 
    slug: 'loongdrive', 
    profile: 'gallery',
    alt: 'Where the World Glides',
    quality: 65,
    modalWidth: 1200,
  },
  { 
    input: './src/assets/reimagine_the_provided_reference_image_with_the_same_exact_composition_pose_framing_perspective_and_gyoc3bo6ylr6lsber9q7_1.jpeg', 
    slug: 'eye-figure', 
    profile: 'gallery',
    alt: 'The One Who Looks Back',
    quality: 65,
    modalWidth: 1600,
  },
];

// Output directory
const OUTPUT_DIR = './public/images';

// Size variants by profile
const PROFILES = {
  hero: [960, 1440, 1920],
  gallery: [480, 800, 1200],
};

const DEFAULT_QUALITY = 65;

async function optimizeImage(source) {
  const { input, slug, profile, alt } = source;
  const quality = source.quality ?? DEFAULT_QUALITY;
  const modalWidth = source.modalWidth ?? 1600;
  
  console.log(`\n📷 Processing: ${slug} (${profile})`);
  console.log(`   Source: ${input}`);
  console.log(`   Alt: ${alt}`);

  if (!existsSync(input)) {
    console.error(`   ❌ Source file not found: ${input}`);
    return false;
  }

  // Get base sizes for this profile
  const sizes = PROFILES[profile];
  
  const image = sharp(input);
  const metadata = await image.metadata();
  
  console.log(`   Original: ${metadata.width}x${metadata.height}`);

  const results = [];

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
          quality,
          effort: 6, // Compression effort (0-6, higher = smaller file)
        })
        .toFile(outputPath);

      // Get file size
      const { statSync } = await import('fs');
      const stats = statSync(outputPath);
      const sizeKB = (stats.size / 1024).toFixed(1);

      console.log(`   ✅ ${outputFilename} (${sizeKB} KB)`);
      results.push({ width, filename: outputFilename, sizeKB });
    } catch (error) {
      console.error(`   ❌ Failed to generate ${width}w:`, error.message);
    }
  }

  if (profile === 'gallery') {
    if (metadata.width && modalWidth > metadata.width) {
      console.log(`   ⏭️  Skipping modal ${modalWidth}w (larger than original)`);
      return results;
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
      results.push({ width: modalWidth, filename: modalFilename, sizeKB, modal: true });
    } catch (error) {
      console.error(`   ❌ Failed to generate modal ${modalWidth}w:`, error.message);
    }
  }

  return results;
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

  for (const source of SOURCES) {
    const results = await optimizeImage(source);
    if (results && results.length > 0) {
      successCount++;
    } else {
      failCount++;
    }
  }

  console.log('\n' + '='.repeat(50));
  console.log('✨ Optimization complete!');
  console.log(`   Success: ${successCount}/${SOURCES.length}`);
  console.log(`   Failed: ${failCount}/${SOURCES.length}`);
  console.log('='.repeat(50));
}

main().catch(error => {
  console.error('💥 Fatal error:', error);
  process.exit(1);
});
