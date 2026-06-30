#!/usr/bin/env node
import { existsSync } from 'node:fs';
import { mkdir, stat } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import { join } from 'node:path';
import sharp from 'sharp';

const imageOutputDirectory = join(process.cwd(), 'public/images');
const videoOutputDirectory = join(process.cwd(), 'public/videos');
const posterWorkDirectory = join(process.cwd(), 'output/curated-video-posters');
const galleryWidths = [480, 560, 800, 1024, 1200];
const modalWidths = [800, 1200, 1600];

const images = [
  { slug: 'textile-corridor', input: '/Users/quentinthiessen/Downloads/Image.png' },
  { slug: 'corridor-touch', input: '/Users/quentinthiessen/Library/Mobile Documents/com~apple~CloudDocs/gaaang.png' },
  { slug: 'patterned-hallway', input: '/Users/quentinthiessen/Library/Mobile Documents/com~apple~CloudDocs/Ferdigupscalefav/1nasssstyyyyyyg1-gigapixel321-redefine-realistic-4x.jpeg' },
  { slug: 'green-motel-wall', input: '/Users/quentinthiessen/Library/Mobile Documents/com~apple~CloudDocs/Ferdigupscalefav/1nasssstyyyyyyg5-gigapixel321-redefine-realistic-4x.jpeg' },
  { slug: 'motel-feet', input: '/Users/quentinthiessen/Library/Mobile Documents/com~apple~CloudDocs/Ferdigupscalefav/1nasssstyyyyyywhoamstyle_photorealistic_first-person_photograph_inside_a_decaying_motel_hallway_at_3am_viewer_stan_3a68e0a5-8a6b-4f52-8053-8da37a70af5f-gigapixel321-redefine-realistic-4x.jpeg' },
  { slug: 'night-bus', input: '/Users/quentinthiessen/Library/Mobile Documents/com~apple~CloudDocs/Ferdigupscalefav/123buss 1-gigapixel321-high fidelity v3-2x.jpeg' },
  { slug: 'color-flood-hallway', input: '/Users/quentinthiessen/Library/Mobile Documents/com~apple~CloudDocs/Ferdigupscalefav/1nasssstyyyyyywhoamstyle_photorealistic_documentary_photograph_of_a_narrow_old_motel_hallway_at_3am_patterned_carp_e3aaabc4-e25c-4d20-b5d6-48dae872abb3-gigapixel321-redefine-realistic-4x.jpeg' },
  { slug: 'living-floor', input: '/Users/quentinthiessen/Downloads/@m.jpeg' },
  { slug: 'coffee-cup', input: '/Users/quentinthiessen/Downloads/_43c92b49-ae5c-4269-8786-35a4bcad3da6.png' },
  { slug: 'leg-prism', input: '/Users/quentinthiessen/Library/Mobile Documents/com~apple~CloudDocs/woowbein.png' },
  { slug: 'drain-bloom', input: '/Users/quentinthiessen/Library/Mobile Documents/com~apple~CloudDocs/ooo.png' },
  { slug: 'mushroom-offering', input: '/Users/quentinthiessen/Downloads/top-down_close-up_pov_of_a_tattooed_hand_holding_a_single_dried_psilocybe_mushroom_on_the_open_palm__dbe07e42-13c4-45b3-bf34-8d6ff6e51c53.png' },
  { slug: 'mycelial-hand', input: '/Users/quentinthiessen/Library/Mobile Documents/com~apple~CloudDocs/magichand.png' },
  { slug: 'fractal-palm', input: '/Users/quentinthiessen/Downloads/_hyper-photorealistic_macro_of_a_human_palm_with_fingers_spread_the_deep_life-line_and_heart-line_cr_818a427d-1477-4057-8fc6-8cf477962f93.png' },
  { slug: 'phone-portal', input: '/Users/quentinthiessen/Downloads/_8ou6i3aw655h92gbk1rz_0.png' },
  { slug: 'mirror-wanderer', input: '/Users/quentinthiessen/Library/Mobile Documents/com~apple~CloudDocs/wandere.png' },
  { slug: 'fingernail-portal', input: '/Users/quentinthiessen/Library/Mobile Documents/com~apple~CloudDocs/realgirl nail.png' },
  { slug: 'soft-mushroom-hand', input: '/Users/quentinthiessen/Downloads/shromi.png' },
  { slug: 'forensic-hand-mouth', input: '/Users/quentinthiessen/Library/Mobile Documents/com~apple~CloudDocs/Ferdigupscalefav/1nasssstyyyyyywhoamstyle_photorealistic_forensic_phone-flash_photograph_of_a_single_handmade_practical-effects_ana_dfe50e20-4570-4fbd-a65e-3f376944134d-gigapixel321-standard-max-4x.jpeg' },
  { slug: 'open-hand-mouth', input: '/Users/quentinthiessen/Library/Mobile Documents/com~apple~CloudDocs/Ferdigupscalefav/1nasssstyyyyyyejkll-gigapixel321-redefine-creative-2x.jpeg' },
  { slug: 'handpose-mouth', input: '/Users/quentinthiessen/Library/Mobile Documents/com~apple~CloudDocs/handpose.png' },
  { slug: 'nasty-food-still', input: '/Users/quentinthiessen/Library/Mobile Documents/com~apple~CloudDocs/ekkelmat.png' },
  { slug: 'sink-organism', input: '/Users/quentinthiessen/Library/Mobile Documents/com~apple~CloudDocs/nastysinkb.png' },
  { slug: 'raw-sink-study', input: '/Users/quentinthiessen/Library/Mobile Documents/com~apple~CloudDocs/dbfdd.webp' },
  { slug: 'tongue-terrain', input: '/Users/quentinthiessen/Downloads/t4.png' },
  { slug: 'tongue-crater', input: '/Users/quentinthiessen/Downloads/t2.png' },
  { slug: 'tongue-soft', input: '/Users/quentinthiessen/Downloads/t1.png' },
  { slug: 'tongue-close', input: '/Users/quentinthiessen/Downloads/t3.png' },
  { slug: 'threshold-witness', input: '/Users/quentinthiessen/Library/Mobile Documents/com~apple~CloudDocs/marvinbadmonster.png' },
];

const videos = [
  { slug: 'corridor-wall-touch', posterSlug: 'corridor-wall-touch-poster', input: '/Users/quentinthiessen/Library/Mobile Documents/com~apple~CloudDocs/Ferdigupscalefav/ferdighd.mp4' },
  { slug: 'corridor-master', posterSlug: 'corridor-master-poster', input: '/Users/quentinthiessen/Library/Mobile Documents/com~apple~CloudDocs/Ferdigupscalefav/ferdig video/corridooor.mp4' },
  { slug: 'cup-object-study', posterSlug: 'cup-object-study-poster', input: '/Users/quentinthiessen/Library/Mobile Documents/com~apple~CloudDocs/ .mp4' },
  { slug: 'cup-coffee', posterSlug: 'cup-coffee-poster', input: '/Users/quentinthiessen/Library/Mobile Documents/com~apple~CloudDocs/Ferdigupscalefav/ferdig video/cupcoffe.mp4' },
  { slug: 'rug-field', posterSlug: 'rug-field-poster', input: '/Users/quentinthiessen/Library/Mobile Documents/com~apple~CloudDocs/Ferdigupscalefav/ferdig video/tepppe.mp4' },
  { slug: 'living-floor-video', posterSlug: 'living-floor-video-poster', input: '/Users/quentinthiessen/Downloads/donefloor.mp4' },
  { slug: 'magic-hand-motion', posterSlug: 'magic-hand-motion-poster', input: '/Users/quentinthiessen/Library/Mobile Documents/com~apple~CloudDocs/grok1.mp4' },
  { slug: 'tattooed-mushroom', posterSlug: 'tattooed-mushroom-poster', input: '/Users/quentinthiessen/Library/Mobile Documents/com~apple~CloudDocs/Ferdigupscalefav/ferdig video/Tattooed Hand Mushroom OEV Final.mp4' },
  { slug: 'mushroom-motion', posterSlug: 'mushroom-motion-poster', input: '/Users/quentinthiessen/Downloads/ffffff.mp4' },
  { slug: 'body-sink-companion', posterSlug: 'body-sink-companion-poster', input: '/Users/quentinthiessen/Library/Mobile Documents/com~apple~CloudDocs/Ferdigupscalefav/ferdig video/føtterferdig.mp4' },
  { slug: 'ecological-hand-study', posterSlug: 'ecological-hand-study-poster', input: '/Users/quentinthiessen/Library/Mobile Documents/com~apple~CloudDocs/Ferdigupscalefav/ferdig video/test.mp4' },
  { slug: 'face-performance', posterSlug: 'face-performance-poster', input: '/Users/quentinthiessen/Library/Mobile Documents/com~apple~CloudDocs/jennyv1.mp4' },
  { slug: 'tongue-study', posterSlug: 'tongue-study-poster', input: '/Users/quentinthiessen/Downloads/Video 2.mp4' },
  { slug: 'dark-figure-sequence', posterSlug: 'dark-figure-sequence-poster', input: '/Users/quentinthiessen/Library/Mobile Documents/com~apple~CloudDocs/grok-video-277740b5-88ba-4747-be7c-7ba89c0c4b44.mp4' },
  { slug: 'eye-hood-study', posterSlug: 'eye-hood-study-poster', input: '/Users/quentinthiessen/Library/Mobile Documents/com~apple~CloudDocs/0427(1).mp4' },
  { slug: 'bark-material', posterSlug: 'bark-material-poster', input: '/Users/quentinthiessen/Library/Mobile Documents/com~apple~CloudDocs/bark bark 60.mp4' },
  { slug: 'void-spiral', posterSlug: 'void-spiral-poster', input: '/Users/quentinthiessen/Library/Mobile Documents/com~apple~CloudDocs/Ferdigupscalefav/ferdig video/Video.mp4' },
];

async function ensureDirectories() {
  await Promise.all([
    mkdir(imageOutputDirectory, { recursive: true }),
    mkdir(videoOutputDirectory, { recursive: true }),
    mkdir(posterWorkDirectory, { recursive: true }),
  ]);
}

async function writeResponsiveImages(input, slug) {
  const source = sharp(input, { animated: false });

  for (const width of galleryWidths) {
    await writeImagePair(source, join(imageOutputDirectory, `${slug}-${width}`), width);
  }

  for (const width of modalWidths) {
    await writeImagePair(source, join(imageOutputDirectory, `${slug}-modal-${width}`), width);
  }
}

async function writeImagePair(source, basePath, width) {
  if (existsSync(`${basePath}.webp`) && existsSync(`${basePath}.avif`)) {
    return;
  }

  const resized = source.clone().resize(width, null, { fit: 'inside', withoutEnlargement: false });

  await Promise.all([
    resized.clone().webp({ quality: 72, effort: 6 }).toFile(`${basePath}.webp`),
    resized.clone().avif({ quality: 50, effort: 6 }).toFile(`${basePath}.avif`),
  ]);
}

function runCommand(command, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { stdio: ['ignore', 'ignore', 'pipe'] });
    const stderr = [];

    child.stderr.on('data', (chunk) => stderr.push(chunk));
    child.on('error', reject);
    child.on('close', (code) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(new Error(`${command} exited ${code}: ${Buffer.concat(stderr).toString('utf8')}`));
    });
  });
}

async function writePoster(video) {
  const posterPath = join(posterWorkDirectory, `${video.posterSlug}.jpg`);

  if (!existsSync(posterPath)) {
    await runCommand('ffmpeg', [
      '-y',
      '-ss',
      '00:00:02',
      '-i',
      video.input,
      '-frames:v',
      '1',
      '-q:v',
      '2',
      posterPath,
    ]);
  }

  await writeResponsiveImages(posterPath, video.posterSlug);
}

async function writeVideo(video) {
  const outputPath = join(videoOutputDirectory, `${video.slug}.mp4`);

  if (existsSync(outputPath)) {
    return;
  }

  await runCommand('ffmpeg', [
    '-y',
    '-i',
    video.input,
    '-map',
    '0:v:0',
    '-an',
    '-vf',
    "scale='min(720,iw)':-2",
    '-c:v',
    'libx264',
    '-profile:v',
    'high',
    '-pix_fmt',
    'yuv420p',
    '-preset',
    'slow',
    '-crf',
    '28',
    '-movflags',
    '+faststart',
    outputPath,
  ]);
}

async function assertInputExists(entry) {
  if (!existsSync(entry.input)) {
    throw new Error(`Missing source asset: ${entry.input}`);
  }
}

async function main() {
  await ensureDirectories();

  for (const image of images) {
    await assertInputExists(image);
    await writeResponsiveImages(image.input, image.slug);
  }

  for (const video of videos) {
    await assertInputExists(video);
    await writePoster(video);
    await writeVideo(video);
  }

  const imageFiles = await Promise.all(
    images.map((image) => stat(join(imageOutputDirectory, `${image.slug}-800.webp`))),
  );
  const videoFiles = await Promise.all(
    videos.map((video) => stat(join(videoOutputDirectory, `${video.slug}.mp4`))),
  );

  console.log(
    JSON.stringify(
      {
        images: imageFiles.length,
        videos: videoFiles.length,
        imageBytes: imageFiles.reduce((sum, file) => sum + file.size, 0),
        videoBytes: videoFiles.reduce((sum, file) => sum + file.size, 0),
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
