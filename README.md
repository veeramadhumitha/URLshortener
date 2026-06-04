# LINKLY - URL Shortener with Analytics

## Overview

LINKLY is a full-stack URL Shortener application that allows users to create short URLs, manage them efficiently, and track detailed analytics such as click counts and visitor activity. The platform provides secure authentication, URL management, QR code generation, custom aliases, expiration dates, and an analytics dashboard.

---

## Features

### Authentication

* User Registration
* Secure Login
* JWT Authentication
* Protected Routes

### URL Management

* Create Short URLs
* Custom Alias Support
* URL Expiration Date
* Edit Existing URLs
* Delete URLs
* Copy Short URLs

### Analytics

* Total Click Tracking
* Click History
* Device Analytics
* Browser Analytics
* Recent Visitor Activity
* Dashboard Statistics

### QR Code Generation

* Generate QR Codes for Short URLs
* Download QR Codes
* Share QR Codes Easily

### User Experience

* Responsive Design
* Modern UI/UX
* Dark Mode & Light Mode
* Mobile Friendly Interface

---

## Tech Stack

### Frontend

* React.js
* Tailwind CSS
* Axios
* React Router

### Backend

* Node.js
* Express.js

### Database

* MongoDB

### Authentication

* JWT (JSON Web Token)
* bcrypt.js

### Additional Libraries

* QRCode Generator
* Chart Libraries for Analytics

---

## Project Structure

```bash
LINKLY/
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   └── package.json
│
└── README.md
```

---

## Setup Instructions

### 1. Clone Repository

```bash
git clone https://github.com/veeramadhumitha/linkly.git
cd linkly
```

### 2. Backend Setup

```bash
cd backend
npm install
```


```

Run Backend:

```bash
npm start
```

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend will run at:

```bash
http://localhost:5173
```

---

## Assumptions Made

1. Users must be authenticated to create and manage URLs.
2. MongoDB is used as the primary database.
3. Each shortened URL is unique.
4. Analytics data is collected whenever a shortened URL is visited.
5. Expired URLs become inaccessible after their expiration date.
6. QR codes are generated for every valid shortened URL.
7. Internet connectivity is available during URL redirection.

---

## AI Planning Document

### Problem Statement

Long URLs are difficult to share and track. Users need a platform that shortens URLs while providing meaningful analytics.

### Solution Approach

1. User authentication and authorization.
2. URL shortening with unique codes.
3. Custom alias support.
4. QR code generation.
5. Analytics tracking for every click.
6. Dashboard for visualizing URL performance.
7. URL management features.

### AI-Assisted Development

AI tools were used for:

* UI/UX brainstorming
* Code optimization
* Debugging assistance
* Architecture planning
* Documentation generation

---

## Architecture Diagram

```text
+-------------+
|   Client    |
| React Front |
+------+------+
       |
       v
+-------------+
| Express API |
|  Node.js    |
+------+------+
       |
       v
+-------------+
|  MongoDB    |
| Database    |
+------+------+
       |
       v
+-------------+
| Analytics   |
| Tracking    |
+-------------+
```

---

## Workflow

```text
User
  |
  v
Register/Login
  |
  v
Dashboard
  |
  v
Create Short URL
  |
  +----> Generate QR Code
  |
  +----> Track Analytics
  |
  v
Manage URLs
```

---

## Demo Video

YouTube Video:




---


---

## Future Enhancements

* Geo-location Analytics
* URL Password Protection
* Team Collaboration
* Advanced Reports
* API Access
* Custom Domains

---

## Author

veeramadhumitha P

---

This project is a part of a hackathon run by https://katomaran.com
