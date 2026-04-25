# 📊 Project Flow Diagram

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT BROWSER                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────┐           │
│  │ Home Page   │  │ Wedding Card │  │  Admin Panel │           │
│  │             │  │              │  │              │           │
│  │ - QR Gen    │  │ - Couple     │  │ - Dashboard  │           │
│  │ - QR Scan   │  │ - Events     │  │ - Stats      │           │
│  │ - Features  │  │ - Gallery    │  │ - RSVP List  │           │
│  │             │  │ - Guest Info │  │ - Messages   │           │
│  │             │  │ - Guestbook  │  │              │           │
│  │             │  │ - RSVP       │  │              │           │
│  │             │  │ - Gifts      │  │              │           │
│  └─────────────┘  └──────────────┘  └──────────────┘           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                              ▲
                              │ HTTP Requests/Responses
                              │
┌─────────────────────────────────────────────────────────────────┐
│                    EXPRESS.JS SERVER                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ ROUTES (server/routes/wedding.js)                      │   │
│  ├─────────────────────────────────────────────────────────┤   │
│  │ GET  /                    → Home page                  │   │
│  │ GET  /wedding/:id         → Wedding card              │   │
│  │ GET  /admin               → Admin dashboard           │   │
│  │ GET  /api/qrcode/generate → QR code generation        │   │
│  │ POST /api/messages/add    → Add message               │   │
│  │ GET  /api/messages        → Get messages              │   │
│  │ POST /api/rsvp/submit     → Submit RSVP               │   │
│  │ GET  /api/rsvp/list       → Get RSVP list             │   │
│  │ GET  /api/gifts           → Get gifts                 │   │
│  │ GET  /api/statistics      → Get statistics            │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ CONTROLLERS (server/controllers/WeddingController.js)   │  │
│  ├──────────────────────────────────────────────────────────┤  │
│  │ Handles business logic:                                 │  │
│  │ - getWeddingCard()       → Render wedding card         │  │
│  │ - generateQRCode()       → Create QR code              │  │
│  │ - addMessage()           → Process message             │  │
│  │ - submitRSVP()           → Process RSVP                │  │
│  │ - getStatistics()        → Calculate stats             │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ MODELS (server/models/WeddingModel.js)                 │  │
│  ├──────────────────────────────────────────────────────────┤  │
│  │ Data access layer:                                      │  │
│  │ - getData()       → Read from wedding.json              │  │
│  │ - saveData()      → Write to wedding.json               │  │
│  │ - getCouple()     → Get couple data                     │  │
│  │ - getGallery()    → Get photos                          │  │
│  │ - addMessage()    → Add to messages array               │  │
│  │ - addRSVP()       → Add to RSVP array                   │  │
│  └──────────────────────────────────────────────────────────┘  │
│                              │                                  │
└──────────────────────────────┼──────────────────────────────────┘
                               │
                               │ Read/Write JSON
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                    DATA STORAGE                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  📁 data/wedding.json                                          │
│  ├── couple: { brideName, groomName, story, ... }             │
│  ├── event: { ceremony, reception }                           │
│  ├── gallery: [ { id, title, image, ... } ]                   │
│  ├── messages: [ { id, guestName, message, ... } ]            │
│  ├── rsvpList: [ { id, guestName, attendance, ... } ]         │
│  └── gifts: [ { id, name, price, image, ... } ]               │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Request/Response Flow

```
USER ACTION                    REQUEST                 RESPONSE

Home Page
┌─────────────┐
│ Click QR    │ ──GET──> /api/qrcode/generate ──> { qrCode, url }
│ Generate    │
└─────────────┘

┌─────────────┐
│ Scan QR     │ ──CAMERA──> Parse & Navigate ──> /wedding/:id
│ Code        │
└─────────────┘

Wedding Card Page
┌─────────────┐
│ Enter Name  │ ──POST──> /api/messages/add ──> { success, data }
│ Send Message│
└─────────────┘

┌─────────────┐
│ Fill RSVP   │ ──POST──> /api/rsvp/submit ──> { success, data }
│ Form        │
└─────────────┘

┌─────────────┐
│ Load Page   │ ──GET──> /api/statistics ──> { stats }
│             │
└─────────────┘

Admin Panel
┌─────────────┐
│ View RSVPs  │ ──GET──> /api/rsvp/list ──> { data: [ rsvps ] }
│             │
└─────────────┘

┌─────────────┐
│ View Messages│ ──GET──> /api/messages ──> { data: [ messages ] }
│             │
└─────────────┘
```

---

## Database Schema (JSON Structure)

```json
{
  "couple": {
    "id": "wedding-001",
    "brideName": "string",
    "groomName": "string",
    "story": "string",
    "profileImage": "string (url)",
    "weddingDate": "YYYY-MM-DD"
  },
  
  "event": {
    "ceremony": {
      "name": "string",
      "date": "YYYY-MM-DD",
      "time": "HH:MM",
      "location": "string",
      "address": "string"
    },
    "reception": {
      "name": "string",
      "date": "YYYY-MM-DD",
      "time": "HH:MM",
      "location": "string",
      "address": "string"
    }
  },
  
  "gallery": [
    {
      "id": "number",
      "title": "string",
      "image": "string (url)",
      "category": "string (engagement|prewedding)"
    }
  ],
  
  "messages": [
    {
      "id": "number",
      "guestName": "string",
      "message": "string",
      "timestamp": "ISO 8601"
    }
  ],
  
  "rsvpList": [
    {
      "id": "number",
      "guestName": "string",
      "attendance": "string (yes|no|maybe)",
      "guestCount": "number",
      "dietary": "string",
      "submittedDate": "YYYY-MM-DD"
    }
  ],
  
  "gifts": [
    {
      "id": "number",
      "name": "string",
      "description": "string",
      "image": "string (url)",
      "price": "string",
      "purchased": "boolean"
    }
  ]
}
```

---

## File Structure with Dependencies

```
📁 Marry/
│
├── 📄 package.json              (Dependencies: express, ejs, qrcode, etc.)
├── 📄 .env                      (Environment variables)
├── 📄 .gitignore               (Git ignore patterns)
│
├── 📂 server/
│   ├── 📄 app.js                (Imports routes, middleware)
│   │                             ↓
│   ├── 📂 routes/
│   │   └── 📄 wedding.js         (Maps to controllers)
│   │                             ↓
│   ├── 📂 controllers/
│   │   └── 📄 WeddingController.js (Uses models)
│   │                             ↓
│   ├── 📂 models/
│   │   └── 📄 WeddingModel.js    (Reads/writes data/wedding.json)
│   │
│   └── 📂 middleware/           (Optional)
│
├── 📂 views/                    (EJS templates - rendered by controllers)
│   ├── 📄 index.ejs             (Home page - uses /js/main.js)
│   ├── 📄 wedding-card.ejs      (Wedding - uses /js/wedding-card.js)
│   ├── 📄 admin.ejs             (Admin - uses /js/admin.js)
│   └── 📄 error.ejs             (Error page)
│
├── 📂 public/                   (Static frontend assets)
│   ├── 📂 css/
│   │   ├── 📄 style.css                  (Global styles)
│   │   ├── 📄 wedding-card.css          (Wedding card styles)
│   │   └── 📄 admin.css                 (Admin styles)
│   │
│   ├── 📂 js/
│   │   ├── 📄 main.js                   (Home page logic)
│   │   ├── 📄 wedding-card.js           (Wedding logic)
│   │   ├── 📄 admin.js                  (Admin logic)
│   │   ├── 📄 qrcode.min.js             (QR library)
│   │   └── 📄 jsQR.js                   (Scanner library - CDN)
│   │
│   └── 📂 images/
│       ├── couple.jpg
│       ├── photo1.jpg
│       ├── photo2.jpg
│       ├── photo3.jpg
│       ├── photo4.jpg
│       └── ... (user images)
│
├── 📂 data/
│   └── 📄 wedding.json          (Local JSON database)
│
└── 📄 Documentation
    ├── README.md                (Full documentation)
    ├── QUICK_START.md          (Quick reference)
    ├── PROJECT_STRUCTURE.md    (Architecture details)
    └── ARCHITECTURE.md         (This file)
```

---

## Component Interaction Diagram

```
┌──────────────────────────────────────────────────────────────────────┐
│                         EXPRESS APPLICATION                          │
└──────────────────────────────────────────────────────────────────────┘

                    app.js (Server Entry Point)
                          │
            ┌─────────────┼─────────────┐
            │             │             │
    wedding.js routes  Middleware   Error Handler
       (Routes)         (CORS,       (404, 500)
            │           JSON)
            │
    ┌─────────────────┐
    │ Controller      │
    │ (Business Logic)│
    └────────┬────────┘
             │
     ┌───────┴────────┐
     │                │
  Model.js         EJS Views
  (Data Access)    (Templates)
     │                │
     │                │
   Read/Write    Render HTML
   wedding.json   + Web Assets
```

---

## Technology Stack Overview

```
┌────────────────────┐
│  CLIENT (Browser)  │
├────────────────────┤
│ HTML (EJS)         │
│ CSS (Responsive)   │
│ JavaScript (Vanilla)
│ - QR Code Lib      │
│ - QR Scanner Lib   │
└────────────────────┘
           ▲
         HTTP│ REST API
           ▼
┌────────────────────┐
│    SERVER (Node)   │
├────────────────────┤
│ Express.js         │
│ EJS Templating     │
│ QRCode npm         │
│ dotenv             │
└────────────────────┘
           ▲
        File │ I/O
           ▼
┌────────────────────┐
│   DATA (JSON)      │
├────────────────────┤
│ wedding.json       │
│ (Local Storage)    │
└────────────────────┘
```

---

## User Journey Map

```
1. USER VISITS HOME PAGE
   ├─ See features
   ├─ Click "Tạo Mã QR" → GET /api/qrcode/generate
   ├─ Download QR code
   └─ Share with guests

2. GUEST SCANS QR CODE
   ├─ Browser accesses decoded URL
   └─ Navigates to /wedding/wedding-001

3. GUEST VIEWS WEDDING CARD
   ├─ Scroll through all sections:
   │  ├─ Couple info
   │  ├─ Events
   │  ├─ Photo gallery
   │  ├─ Guest info
   │  ├─ Guestbook
   │  ├─ RSVP
   │  └─ Gifts
   │
   ├─ Fill RSVP Form
   │  └─ POST /api/rsvp/submit
   │
   ├─ Add Message
   │  └─ POST /api/messages/add
   │
   └─ Auto-load: GET /api/statistics

4. COUPLE VIEWS ADMIN PANEL
   ├─ Navigate to /admin
   └─ View:
      ├─ Dashboard stats
      ├─ RSVP list (GET /api/rsvp/list)
      ├─ Messages (GET /api/messages)
      └─ Statistics (auto-refresh)
```

---

## MVC Pattern Implementation

```
MVC LAYER          FILE(S)                    RESPONSIBILITY
────────────────────────────────────────────────────────────

MODEL              WeddingModel.js            • Read wedding.json
                                              • Write wedding.json
                                              • Data validation
                                              • Data formatting

                        ↓
                   
CONTROLLER         WeddingController.js       • Process requests
                                              • Use MODEL to get data
                                              • Calculate statistics
                                              • Call VIEW with data
                                              • Error handling

                        ↓
                   
VIEW               *.ejs templates            • Render HTML
                   + CSS files                • Display data
                   + JS files                 • User interactions
                                              • Form submissions
```

---

## Error Handling Flow

```
┌──────────────────────────────┐
│   User Request               │
└──────────────────┬───────────┘
                   │
        ┌──────────▼─────────────┐
        │   Route Handler        │
        └──────────┬─────────────┘
                   │
        ┌──────────▼─────────────┐
        │   Controller Logic     │
        │   try/catch blocks     │
        └──────────┬─────────────┘
                   │
        ┌──────────▼─────────────┐
        │   Database/Model Call  │
        │   Data Processing      │
        └──────────┬─────────────┘
                   │
           ┌───────┴────────┐
           │                │
       ✅ SUCCESS      ❌ ERROR
           │                │
        ┌──▼──┐       ┌─────▼──────┐
        │ 200 │       │ 400/500    │
        │ OK  │       │ Error JSON │
        └─────┘       └────────────┘
           │                │
        Send to View    Send Error Response
```

---

*Diagram Version: 1.0 | Created for Marry Wedding Card App*
