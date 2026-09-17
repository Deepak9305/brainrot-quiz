# Brainrot Quiz

Offline-first Flutter quiz game: **How cooked are you?**

The app now ships with a broad local question bank covering modern brainrot slang, meme history, emoji reactions, viral characters, finish-the-meme prompts, quickfire internet culture, a daily mixed challenge, and a harder Impossible mode. Rounds are selected without duplicate questions, and Rush uses a larger unique pool instead of looping a tiny set.

There is no fake voice/sound quiz. Audio-style questions are rejected unless a real bundled audio asset exists.

## Run locally

From this folder:

```powershell
.\.flutter-sdk\bin\flutter.bat pub get
.\.flutter-sdk\bin\flutter.bat run -d web-server --web-hostname 0.0.0.0 --web-port 4175
```

Open [http://localhost:4175](http://localhost:4175). Port 4173 is used by another local app in the workspace.

## Character media

Bundled image questions use references of Tralalero Tralala, Bombardiro Crocodilo, Tung Tung Tung Sahur, and Brr Brr Patapim. Character mode also includes text questions about broader meme characters rather than being Italian-brainrot-only. Source and rights notes are in [THIRD_PARTY_MEDIA.md](THIRD_PARTY_MEDIA.md).

## Checks

```powershell
.\.flutter-sdk\bin\flutter.bat analyze
.\.flutter-sdk\bin\flutter.bat test
.\.flutter-sdk\bin\flutter.bat build web --release
```
