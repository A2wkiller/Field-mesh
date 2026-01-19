Field Mesh

Offline Disaster, Agriculture & Aid Intelligence System

SmartField is a dual-interface, offline-first mobile application designed for disaster response, agriculture surveys, hospital monitoring, and aid distribution in low-connectivity environments.

The app is built as a single application with role-based access, allowing field survey teams and HQ command teams to operate on the same data ecosystem—without relying on cloud infrastructure.

⚠️ This repository contains a hackathon/demo build using synthetic data only.

🚀 Key Highlights

Single App, Two Interfaces

FieldMesh (PIN: 112233) – Survey & field data collection

SmartField HQ (PIN: 223344) – Command, monitoring & prioritization

Offline-First by Design

No internet required

Local data storage

Works in disaster & rural scenarios

Trust-Aware Data Validation

Simulated AI validation

Heuristic input checks

Peer confirmation logic

Fraud & anomaly detection

Synthetic DigiPin System

Demo-safe, non-real location identifiers

Enables realistic maps & prioritization without privacy risk

Rescue & Aid Intelligence

Rescue Priority Index (RPI)

Hospital & casualty grid

Aid distribution audit (AidMesh)

🧭 App Interfaces
🔹 FieldMesh — Survey Teams (PIN: 112233)

Used by:

Disaster survey teams

Medical field staff

Agriculture officers

Aid distribution staff

Features:

Disaster surveys

Agriculture damage surveys

Aid distribution logging

Camera capture (CameraX)

Trust scoring & peer review

Offline mesh sync (simulated)

🔹 SmartField HQ — Command Center (PIN: 223344)

Used by:

HQ officers

Command centers

Supervisors & decision makers

Features:

Command dashboard

Rescue priority queue

Disaster heatmap

Hospital & casualty monitoring

Aid inventory & audit

Fraud & anomaly alerts

🏗️ Tech Stack

Framework: React Native + Expo (via Rork)

Language: TypeScript

Routing: Expo Router

State/Data: Local storage & simulated sync

Background Tasks: WorkManager-style logic

Camera: CameraX equivalent

AI Logic: Simulated TFLite-style validation

🚫 No Firebase
🚫 No cloud dependency
✅ Fully offline demo build

🧪 Demo & Hackathon Notes

All data is synthetic

All DigiPins are non-real

Mesh sync & AI are simulated

Designed for safe demonstrations

Example synthetic DigiPins:

DP-HACK-A1-001
DP-HACK-A1-002
DP-HACK-B2-010
DP-HACK-C3-020

▶️ How to Run the App
Prerequisites

Node.js (via nvm)

Bun

Expo Go or Rork app on phone

Install & Run
bun install
bun run start


Scan the QR code using:

Expo Go (Android / iOS)

Rork app

🧪 Run on Web (Optional)
bun run start-web


Note: Some native features may be limited in browser preview.

📂 Project Structure
SmartField/
├── app/                    # App screens (Expo Router)
│   ├── (tabs)/             # Tab navigation
│   ├── fieldmesh/          # Field interface
│   ├── hq/                 # HQ interface
│   └── login/              # PIN-based access
├── services/               # Trust scoring, demo data
├── sync/                   # Mesh sync simulation
├── constants/              # App constants
├── assets/                 # Images & icons
└── README.md

🔐 Security & Ethics

No real personal data

No real locations

No cloud transmission

Clear demo disclaimers

SmartField is a decision-support system.
Final operational decisions remain with authorized authorities.

🎯 Intended Use

Hackathons & demos

Disaster response pilots

NGO & government showcases

Research & prototyping

📌 License & Disclaimer

This project is intended for demonstration and pilot use only.
All data used is synthetic and does not represent real individuals or locations.

🌱 Future Scope

Real DigiPin integration

Secure authentication

Real mesh networking

Government backend sync

ISO-grade security compliance
