# Support Dashboard Web Part
An advanced SharePoint Framework (SPFx) custom web part tailored for Wahl Industries. The Support Dashboard acts as a centralized operational hub, allowing users to interact with critical support tools, visualize team statuses, and directly trigger automated backend workflows via the Power Platform.

🚀 Features
Instant Power Automate Integration: Built-in HTTP trigger client to execute direct workflows safely from the modern SharePoint canvas.

Microsoft Graph-Powered: Deep integration with the Microsoft Graph API for fetching user profiles, avatars, and context-aware organization data.

Modern Fluent UI Design: Built using React and Fluent UI components to ensure a seamless, native look and feel within the SharePoint modern experience.

Real-time State Management: Responsive React lifecycle hooks handle seamless dashboard updates without full-page refreshes.

🏗️ Architecture Overview
The web part operates as a client-side application running inside the modern SharePoint page environment (sp-pages-assembly).

[ SharePoint Modern Page ]
        │
        ├──> [ Support Dashboard Web Part (React) ]
                 │
                 ├── (GET Profile Data) ──> [ Microsoft Graph API ]
                 │
                 └── (POST Payload Data) ──> [ Power Automate HTTP Trigger ]
                                                      │
                                                      └──> [ Enterprise Workflow Execution ]
🛠️ Tech Stack
Frontend: React, TypeScript, SharePoint Framework (SPFx)

Styling & UI: Fluent UI / Office UI Fabric Icons

API Connectivity: Microsoft Graph API Client, native Http 

Client for Power Platform integration

Backend Automation: Power Automate (Workflows API)

⚙️ Getting Started & Installation
Prerequisites
Ensure you have the following installed in your development environment:
Node.js (Recommended version matching your SPFx target)

Gulp CLI (npm install --global gulp-cli)

Yeoman (npm install --global yo)

Installation Steps
Clone the repository:

git clone https://github.com/support-dashboard.git
cd support-dashboard

Install dependencies:
npm install

Configure the Flow Endpoint:
Locate your environment configuration or the specific web part property pane settings, and map the target Power Automate workflow endpoint:

Code snippet
FLOW_TRIGGER_URL=https://<environment>.api.powerplatform.com/powerautomate/automations/direct/workflows/<workflow-id>/triggers/manual/paths/invoke

Trust the dev certificate (First-time setup):
gulp trust-dev-cert

Run the local workbench:
gulp serve
