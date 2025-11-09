import fs from 'fs';
import path from 'path';
import axios from 'axios';
import { google } from 'googleapis';
import dotenv from 'dotenv';
import inquirer from 'inquirer';
import cliProgress from 'cli-progress';

dotenv.config();
const __dirname = path.resolve();
const videosDir = path.join(__dirname, 'videos');
if (!fs.existsSync(videosDir)) fs.mkdirSync(videosDir);

// 🧠 Gemini Metadata Generator
async function generateMetadata(topic, videoName) {
  const prompt = `Generate a YouTube title, description, and 10 SEO-friendly tags for a short video related to "${topic}". Respond only in JSON like:
{"title":"...","description":"...","tags":["..."]}`;

  try {
    const res = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      { contents: [{ parts: [{ text: prompt }] }] }
    );

    let text = res.data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";
    text = text.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(text);

    if (!parsed.title || parsed.title.trim() === "") throw new Error("Empty title");

    console.log(`\n🧠 Gemini Metadata for "${videoName}":`);
    console.log(`📌 Title: ${parsed.title}`);
    console.log(`📝 Description: ${parsed.description.slice(0, 180)}...`);
    console.log(`🏷️ Tags: ${parsed.tags.join(', ')}`);

    return parsed;
  } catch (err) {
    console.error(`❌ Gemini error for "${videoName}":`, err.message);
    return null;
  }
}

// ⏰ Schedule Time Calculator (5 AM, 12 PM, 5 PM daily)
function getNextSchedule(index, startDate = new Date()) {
  const slots = ['05:00', '12:00', '17:00']; // 24hr format
  const dayOffset = Math.floor(index / 3);
  const slot = slots[index % 3];
  const [hour, minute] = slot.split(':').map(Number);

  const schedule = new Date(startDate);
  schedule.setDate(schedule.getDate() + dayOffset);
  schedule.setHours(hour, minute, 0, 0);

  if (schedule < new Date()) schedule.setDate(schedule.getDate() + 1);
  return schedule;
}

// 🎥 Upload to YouTube with Progress + Schedule
async function uploadToYouTube(videoPath, metadata, scheduleTime) {
  const oauth2Client = new google.auth.OAuth2(
    process.env.YOUTUBE_CLIENT_ID,
    process.env.YOUTUBE_CLIENT_SECRET
  );
  oauth2Client.setCredentials({ refresh_token: process.env.YOUTUBE_REFRESH_TOKEN });
  const youtube = google.youtube({ version: 'v3', auth: oauth2Client });

  const fileSize = fs.statSync(videoPath).size;
  const fileStream = fs.createReadStream(videoPath);

  const bar = new cliProgress.SingleBar(
    {
      format: '🚀 Uploading [{bar}] {percentage}% | ETA: {eta}s | {value}/{total} bytes',
      hideCursor: true,
    },
    cliProgress.Presets.shades_classic
  );

  bar.start(fileSize, 0);
  let uploaded = 0;
  fileStream.on('data', (chunk) => {
    uploaded += chunk.length;
    bar.update(uploaded);
  });

  console.log(`\n📤 Uploading ${path.basename(videoPath)} to YouTube...`);
  console.log(`⏰ Scheduled for: ${scheduleTime.toLocaleString()}`);

  const res = await youtube.videos.insert({
    part: 'snippet,status',
    requestBody: {
      snippet: {
        title: metadata.title,
        description: metadata.description,
        tags: metadata.tags,
        categoryId: '22', // People & Blogs
      },
      status: {
        privacyStatus: 'private', // 👈 private first
        publishAt: scheduleTime.toISOString(), // 👈 Scheduled publish time
        selfDeclaredMadeForKids: false,
      },
    },
    media: { body: fileStream },
  });

  bar.stop();
  console.log(`✅ Uploaded Successfully (scheduled): https://youtu.be/${res.data.id}\n`);
}

// 🧩 Main logic
async function main() {
  const { topic } = await inquirer.prompt([
    { name: 'topic', message: '🎯 Enter video topic for AI titles:' },
  ]);

  const videos = fs.readdirSync(videosDir).filter((f) => f.endsWith('.mp4'));
  if (videos.length === 0) {
    console.log('❌ No .mp4 videos found in "videos" folder!');
    return;
  }

  console.log(`\n📁 Found ${videos.length} video(s) in folder: ${videosDir}\n`);
  const startDate = new Date();

  for (let i = 0; i < videos.length; i++) {
    const video = videos[i];
    const videoPath = path.join(videosDir, video);

    console.log(`🎬 Processing: ${video}`);
    const metadata = await generateMetadata(topic, video);
    if (!metadata) {
      console.log(`⚠️ Skipping ${video} (metadata missing)\n`);
      continue;
    }

    const scheduleTime = getNextSchedule(i, startDate);
    try {
      await uploadToYouTube(videoPath, metadata, scheduleTime);
    } catch (err) {
      console.error(`❌ Upload failed for ${video}:`, err.message, '\n');
    }
  }

  console.log('🎉 All uploads completed (scheduled)!');
}

main();
