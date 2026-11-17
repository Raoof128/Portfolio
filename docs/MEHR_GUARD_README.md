# Mehr Guard

> **On-Device QR & Link Security for the Privacy-Conscious**

Mehr Guard is a **privacy-first QR code and URL security scanner** built with Kotlin Multiplatform. It detects phishing attacks, brand impersonation, and malicious redirects with **on-device analysis**: scanned URLs are never sent anywhere. The Android app checks for rule updates at startup.

## 🚀 Core Features
- **On-Device Analysis**: scanned URLs are never sent anywhere.
- **Cross-Platform**: Android, iOS, Desktop (JVM), Web (JS/Wasm).
- **Phishing Detection**: 25 heuristics plus a small hand-set scoring model (weights set by hand, not trained). CI measures 90.7% F1 (precision 84.5%, recall 98.0%) on the repository's 100 author-written URLs, which is not a held-out benchmark; 9 of the 50 legitimate sites are flagged.
- **Latency**: tests assert a 99th-percentile analysis time under 50 ms per URL.

## 🏗️ Architecture
All security-critical logic lives in `common/`. Platform modules handle camera/UI.

## 🔗 Links
- [Demo Video](https://youtu.be/n8bheouj4jM)
- [Web Demo](https://raoufabedini.dev/projects/mehr-guard)
