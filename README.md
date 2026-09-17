# Brainrot Quiz

Offline-first Flutter quiz game: **How cooked are you?**

## Run locally

From this folder:

```powershell
.\.flutter-sdk\bin\flutter.bat pub get
.\.flutter-sdk\bin\flutter.bat run -d web-server --web-hostname 0.0.0.0 --web-port 4175
```

Open [http://localhost:4175](http://localhost:4175). Port 4173 is used by another local app in the workspace.

## Real character media

The intro, home hero, daily card, and image questions use bundled references of Tralalero Tralala, Bombardiro Crocodilo, Tung Tung Tung Sahur, and Brr Brr Patapim. Source and rights notes are in [THIRD_PARTY_MEDIA.md](THIRD_PARTY_MEDIA.md).

## Checks

```powershell
.\.flutter-sdk\bin\flutter.bat analyze
.\.flutter-sdk\bin\flutter.bat test
.\.flutter-sdk\bin\flutter.bat build web --release
```
