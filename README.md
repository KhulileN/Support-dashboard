# 🚀 Support Dashboard Web Part

An advanced **SharePoint Framework (SPFx)** custom web part built for **Wahl Industries**. The Support Dashboard serves as a centralized operational hub, enabling users to access critical support tools, visualize team status, and trigger automated backend workflows through the Microsoft Power Platform.

---

## ✨ Features

### ⚡ Power Automate Integration
- Execute Power Automate workflows directly from SharePoint using secure HTTP triggers.
- Seamlessly launch backend automation from the dashboard.

### 👤 Microsoft Graph Integration
- Retrieve user profile information.
- Display user avatars.
- Access Microsoft 365 organizational context.

### 🎨 Modern Fluent UI Experience
- Built with **React** and **Fluent UI**.
- Native SharePoint Modern UI look and feel.
- Responsive and accessible user interface.

### 🔄 Real-Time Dashboard Updates
- React state management provides dynamic updates.
- No page refresh required for user interactions.

---

# 🏗️ Architecture

The web part runs entirely client-side within the SharePoint Modern page.

```text
SharePoint Modern Page
│
└── Support Dashboard Web Part (React)
    │
    ├── GET User Profile
    │      │
    │      └── Microsoft Graph API
    │
    └── POST Workflow Request
           │
           └── Power Automate HTTP Trigger
                  │
                  └── Enterprise Workflow Execution
```

---

# 🛠️ Technology Stack

| Category | Technology |
|----------|------------|
| Framework | SharePoint Framework (SPFx) |
| Language | TypeScript |
| Frontend | React |
| UI Components | Fluent UI |
| Icons | Office UI Fabric Icons |
| Microsoft 365 Integration | Microsoft Graph API |
| HTTP Client | SPFx HttpClient |
| Backend Automation | Microsoft Power Automate |

---

# ⚙️ Getting Started

## Prerequisites

Install the following before running the project:

- Node.js (compatible with your SPFx version)
- Gulp CLI

```bash
npm install -g gulp-cli
```

- Yeoman

```bash
npm install -g yo
```

---

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/support-dashboard.git
cd support-dashboard
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure the Power Automate endpoint

Update the workflow trigger URL in your environment configuration or web part properties.

```text
FLOW_TRIGGER_URL=https://<environment>.api.powerplatform.com/powerautomate/automations/direct/workflows/<workflow-id>/triggers/manual/paths/invoke
```

### 4. Trust the development certificate

(Required for first-time SPFx development)

```bash
gulp trust-dev-cert
```

### 5. Start the local workbench

```bash
gulp serve
```

---

# 📂 Project Structure

```text
src/
├── webparts/
│   └── supportDashboard/
│       ├── components/
│       ├── services/
│       ├── hooks/
│       ├── interfaces/
│       ├── assets/
│       ├── SupportDashboard.tsx
│       └── SupportDashboardWebPart.ts
├── common/
└── index.ts
```

---

# 🔐 Integrations

The Support Dashboard integrates with:

- Microsoft Graph API
- SharePoint Framework APIs
- Power Automate HTTP Trigger endpoints
- Microsoft 365 authentication context

---

# 🚀 Development Commands

Install dependencies:

```bash
npm install
```

Serve locally:

```bash
gulp serve
```

Build the project:

```bash
gulp build
```

Bundle for production:

```bash
gulp bundle --ship
```

Package the solution:

```bash
gulp package-solution --ship
```

---

# 📋 Requirements

- SharePoint Online
- SharePoint Framework (SPFx)
- Microsoft 365 Tenant
- Power Automate Premium (HTTP Trigger)
- Microsoft Graph permissions configured

---

# 👨‍💻 Built With

- SharePoint Framework (SPFx)
- React
- TypeScript
- Fluent UI
- Microsoft Graph
- Microsoft Power Automate

---

## 📄 License

This project is proprietary software developed for **Wahl Industries**.
All rights reserved.
