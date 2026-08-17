#!/usr/bin/env node
/**
 * Batch-generates creature portrait images and uploads them to Firebase Storage.
 *
 * Usage:
 *   IMAGE_API_KEY=sk-... npm run generate-portraits -- --from 1 --to 100
 *
 * Requires GOOGLE_APPLICATION_CREDENTIALS or Firebase emulator for Storage upload.
 */

import { createWriteStream, existsSync, mkdirSync, readFileSync, unlinkSync } from 'node:fs';
import { resolve } from 'node:path';
import { pipeline } from 'node:stream/promises';
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getStorage } from 'firebase-admin/storage';
import { generatedCreatures } from '../functions/src/seed/creatures.generated';

const ROOT = resolve(__dirname, '..');
const TMP_DIR = resolve(ROOT, '.tmp/creature-portraits');
const RATE_LIMIT_MS = 4000;

interface CliOptions {
  from: number;
  to: number;
  dryRun: boolean;
}

function parseArgs(): CliOptions {
  const args = process.argv.slice(2);
  let from = 1;
  let to = generatedCreatures.length;
  let dryRun = false;
  for (let i = 0; i < args.length; i += 1) {
    if (args[i] === '--from') {
      from = Number(args[i + 1]);
      i += 1;
    } else if (args[i] === '--to') {
      to = Number(args[i + 1]);
      i += 1;
    } else if (args[i] === '--dry-run') {
      dryRun = true;
    }
  }
  return { from, to, dryRun };
}

function creatureIndex(id: string): number {
  const match = id.match(/^creature_(\d+)_/);
  return match ? Number(match[1]) : 0;
}

function promptFor(creature: (typeof generatedCreatures)[number]): string {
  return [
    `Square game avatar portrait of ${creature.name}, ${creature.type},`,
    'Viking fantasy style, stylized 2D illustration, dark nordic palette,',
    'centered bust, no text, clean background suitable for a mobile game UI.',
  ].join(' ');
}

async function sleep(ms: number): Promise<void> {
  await new Promise((resolveSleep) => setTimeout(resolveSleep, ms));
}

async function downloadImage(url: string, destination: string): Promise<void> {
  const response = await fetch(url);
  if (!response.ok || !response.body) {
    throw new Error(`Failed to download image: ${response.status}`);
  }
  await pipeline(response.body as unknown as NodeJS.ReadableStream, createWriteStream(destination));
}

async function generateImage(apiKey: string, prompt: string, destination: string): Promise<void> {
  const response = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-image-1',
      prompt,
      size: '1024x1024',
    }),
  });
  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Image API failed (${response.status}): ${body}`);
  }
  const payload = (await response.json()) as {
    data?: Array<{ b64_json?: string; url?: string }>;
  };
  const entry = payload.data?.[0];
  if (entry?.b64_json) {
    const buffer = Buffer.from(entry.b64_json, 'base64');
    await pipeline(
      (async function* () {
        yield buffer;
      })(),
      createWriteStream(destination),
    );
    return;
  }
  if (entry?.url) {
    await downloadImage(entry.url, destination);
    return;
  }
  throw new Error('Image API returned no image data');
}

function initFirebaseAdmin(): ReturnType<typeof getStorage> {
  if (getApps().length === 0) {
    const serviceAccountPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
    if (serviceAccountPath && existsSync(serviceAccountPath)) {
      initializeApp({
        credential: cert(JSON.parse(readFileSync(serviceAccountPath, 'utf8')) as object),
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      });
    } else {
      process.env.FIREBASE_STORAGE_EMULATOR_HOST =
        process.env.FIREBASE_STORAGE_EMULATOR_HOST ?? '127.0.0.1:9199';
      process.env.GCLOUD_PROJECT = process.env.GCLOUD_PROJECT ?? 'vikings-war-dev';
      initializeApp({
        projectId: process.env.GCLOUD_PROJECT,
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET ?? `${process.env.GCLOUD_PROJECT}.appspot.com`,
      });
    }
  }
  return getStorage();
}

async function uploadPortrait(
  storage: ReturnType<typeof getStorage>,
  creatureId: string,
  localPath: string,
): Promise<void> {
  const storagePath = `creatures/${creatureId}.webp`;
  const bucket = storage.bucket();
  const file = bucket.file(storagePath);
  const [exists] = await file.exists();
  if (exists) {
    console.log(`Skipping ${creatureId} — already in Storage`);
    return;
  }
  await bucket.upload(localPath, {
    destination: storagePath,
    metadata: {
      contentType: 'image/webp',
      cacheControl: 'public,max-age=31536000,immutable',
    },
  });
  await file.makePublic();
  console.log(`Uploaded ${storagePath}`);
}

async function main(): Promise<void> {
  const { from, to, dryRun } = parseArgs();
  const apiKey = process.env.IMAGE_API_KEY;
  if (!apiKey && !dryRun) {
    throw new Error('IMAGE_API_KEY is required unless running with --dry-run');
  }
  mkdirSync(TMP_DIR, { recursive: true });
  const storage = dryRun ? null : initFirebaseAdmin();
  const batch = generatedCreatures.filter((creature) => {
    const index = creatureIndex(creature.id);
    return index >= from && index <= to;
  });

  for (const creature of batch) {
    const prompt = promptFor(creature);
    const localPath = resolve(TMP_DIR, `${creature.id}.webp`);
    console.log(`Generating ${creature.id} (${creature.name})`);
    if (dryRun) {
      console.log(`DRY RUN prompt: ${prompt}`);
      continue;
    }
    if (!existsSync(localPath)) {
      await generateImage(apiKey!, prompt, localPath);
      await sleep(RATE_LIMIT_MS);
    }
    await uploadPortrait(storage!, creature.id, localPath);
    unlinkSync(localPath);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
