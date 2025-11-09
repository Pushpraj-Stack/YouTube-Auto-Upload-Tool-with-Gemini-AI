# YouTube-Auto-Upload-Tool-with-Gemini-AI
An automated tool that splits long videos into parts, generates SEO-optimized titles, descriptions, and tags using Gemini AI, and uploads them to YouTube with automatic scheduling.
# 🎬 YouTube Auto Upload Tool with Gemini AI

An intelligent automation tool that:
- Divides long videos into multiple parts based on custom seconds.
- Uses **Gemini AI (Google Generative Language API)** to generate **SEO-optimized titles, descriptions, and tags** for each part.
- Automatically uploads videos to YouTube using the **YouTube Data API v3**.
- Schedules uploads at specific times: `5:00 AM`, `12:00 PM`, and `5:00 PM`.
- Handles multiple videos — each new day automatically schedules 3 videos at those time slots.

---

## 🚀 Features

✅ Split any long video into multiple clips.  
✅ Automatically generate unique and relevant metadata (Title, Description, Tags).  
✅ Upload videos to YouTube with progress tracking in the terminal.  
✅ Schedule uploads automatically based on time and date.  
✅ Works seamlessly with Gemini 2.5 Flash AI model.  

---

YOUTUBE_CLIENT_ID=396305385866-111ifuesfa6daq9mqelibg9b2cq2r8ag.apps.googleusercontent.com
YOUTUBE_CLIENT_SECRET=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
YOUTUBE_REFRESH_TOKEN=1//0g-6TeDsN2G4qCgYIARAAGBASNwF-L9Ir869lLG3BwpEI9NwrzDMX5nozbcjC37O2d0qM2OVNJYwcdnr-Q0-0_tdAHdLwgHdRr_Y
GEMINI_API_KEY=AIzaSyDZinM2bSIqnklmwt1d3H-mLYVlU3QkH4Q


## 🧠 How It Works

1. You provide a **long video file** and a **topic** (e.g. “Ancient Indian Temples”).
2. The script:
   - Splits the video into parts using FFmpeg.
   - Sends the topic + clip number to Gemini AI.
   - Gets title, description, and tags in JSON format.
3. Each part is uploaded to YouTube with the generated data.
4. Uploads are **scheduled** automatically:
   - Day 1 → 3 videos at `5 AM`, `12 PM`, `5 PM`
   - Day 2 → next 3 videos at same time slots
   - and so on…

---

## ⚙️ Installation

### 1️⃣ Clone the repository
```bash
git clone https://github.com/Pushpraj-Stack/YouTube-Auto-Upload-Tool-with-Gemini-AI.git
cd youtube-ai-upload
