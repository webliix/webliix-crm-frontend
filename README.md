# Webliix CRM Enterprise Frontend (`webliix-crm-frontend`)

Official Enterprise Web Application Frontend for **Webliix ERP & CRM SaaS Platform**.

## 🚀 Overview

Webliix CRM Frontend is a modern, high-performance React application built with **TypeScript**, **Vite**, **Material UI (MUI)**, **Redux Toolkit**, and **React Query**. It provides a complete management suite for enterprise operations, including lead tracking, customer relationship management, public blog authoring with Cloudinary CDN & Google AdSense monetization, an interactive notification center, and a control-rich 5-tab user profile management center.

## 🛠️ Tech Stack

- **Framework**: React 19 + TypeScript
- **Build Tool**: Vite 8 (HMR, Rollup bundling)
- **UI & Styling**: Material UI (MUI 6), Custom Tokenized System, Responsive Layout Drawer
- **State Management**: Redux Toolkit (Session & Auth Bootstrap) + React Query (Server State)
- **HTTP Client**: Axios with automatic JWT Authorization bearer interceptors
- **Media CDN**: Cloudinary Media Suite (Dual local file upload + direct remote image URL insertion)
- **Monetization**: Google AdSense Integration (Top, Mid-Content, and Bottom Banner placements)

## ✨ Core Features & Modules

1. **Enterprise Dashboard Layout & Sidebar**:
   - Responsive mobile drawer navigation with persistent desktop sidebar.
   - Live header bell notification drawer with unread counter badges and tab filters.
   - Official Webliix brand logo integration across header, sidebar, and authentication screens.

2. **Blog & Knowledge Base CRM Editor**:
   - Semantic HTML tag editor with visual live HTML preview mode.
   - Dual image upload system: Upload local image files to Cloudinary CDN (up to 50MB) or insert remote image URLs directly.
   - Google AdSense monetization controls per article (`auto`, `horizontal`, `rectangle`, `fluid`).
   - Unified article slug / numeric ID reader resolution with unread guest likes and threaded comments.

3. **5-Tab Profile & Security Control Center**:
   - **Personal Details**: First/Last Name, Email, Phone, Job Title, Department, Bio, Timezone, Language.
   - **Security & 2FA**: Password change strength meter, Two-Factor Authentication (2FA) TOTP setup modal, Session Timeout selector.
   - **Notification Preferences**: Real-time switches for Email, Push, Lead Activity, Comment, and Security Alerts.
   - **API Tokens & Webhooks**: Create, copy, and revoke persistent API Keys with custom scopes (`Read-Only` / `Full Admin`).
   - **Sessions & Audit Logs**: Active authenticated device session management with 1-click token revocation.

## ⚙️ Getting Started

### Prerequisites

- Node.js (v18.0.0 or higher)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/webliix/webliix-crm-frontend.git
cd webliix-crm-frontend

# Install dependencies
npm install
```

### Running Development Server

```bash
npm run dev
```

The application will start on `http://localhost:5173`.

### Building for Production

```bash
npm run build
```

The production output will be generated in the `dist/` directory.

## 🔗 Repository Information

- **Repository**: [https://github.com/webliix/webliix-crm-frontend.git](https://github.com/webliix/webliix-crm-frontend.git)
- **Branch**: `main`

## 📄 License

© Webliix Hub Platform. All rights reserved.
