#!/usr/bin/env python3
import os
import sys
from yt_dlp import YoutubeDL

def print_progress(d):
    if d['status'] == 'downloading':
        percent = d.get('_percent_str', '').strip()
        speed = d.get('_speed_str', '')
        eta = d.get('eta', 0)
        sys.stdout.write(f"\r⬇️ Downloading: {percent} at {speed} ETA: {eta}s ")
        sys.stdout.flush()
    elif d['status'] == 'finished':
        print(f"\n✅ Download complete: {d['filename']}")

def download_video(url, output_path='downloads', audio_only=False):
    os.makedirs(output_path, exist_ok=True)

        ydl_opts = {
        'cookiesfrombrowser': ('edge',),
        'format': 'bestvideo[ext=mp4]+bestaudio[ext=m4a]/mp4',
        'merge_output_format': 'mp4',
    }


    if audio_only:
        # केवल ऑडियो डाउनलोड करने के लिए
        ydl_opts.update({
            'format': 'bestaudio/best',
            'postprocessors': [{
                'key': 'FFmpegExtractAudio',
                'preferredcodec': 'mp3',
                'preferredquality': '192',
            }],
        })
    else:
        # वीडियो + ऑडियो साथ में
        ydl_opts.update({'format': 'bv*+ba/b'})

    with YoutubeDL(ydl_opts) as ydl:
        ydl.download([url])

if __name__ == '__main__':
    # 🎯 यहां अपना YouTube URL डालें
    url = "https://www.youtube.com/watch?v=-YlmnPh-6rE&list=RD-YlmnPh-6rE"

    # 📂 डाउनलोड सेव करने का फोल्डर
    output_folder = "downloads"

    # 🔊 सिर्फ ऑडियो डाउनलोड करना हो तो True करें
    audio_only = False  # True = MP3 only, False = full video

    try:
        download_video(url, output_folder, audio_only)
    except Exception as e:
        print(f"\n❌ Error: {e}")

