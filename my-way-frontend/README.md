# My Way Frontend

React + TypeScript + Vite frontend for the My Way career growth application.

## Features in this iteration

- Dashboard with live metrics from backend
- Auth flow: register/login and protected routes
- Skills management (add, list, delete)
- Career plan management (add, list, delete)
- Training recommendation search by skill category
- Networking page (professional connections CRUD)
- Global style system + local feature styles

## Setup

1. Install dependencies:

```bash
yarn
```

2. Configure API URL (optional if backend runs on default port):

```bash
cp .env.example .env
```

3. Run in development:

```bash
yarn dev
```

App default URL: http://localhost:5173

## Build

```bash
yarn build
```

## Architecture

- src/app: app shell and routes
- src/features: dashboard, skills, career, training pages
- src/shared/api: axios client
- src/shared/types: TypeScript models
- src/index.css: global tokens and layout foundation
- local CSS files: per-feature visual behavior
