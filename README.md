# Live Poll

![Live Poll](https://img.shields.io/badge/Live%20Poll-Real--time%20Audience%20Polling-blue)
![React](https://img.shields.io/badge/React-19.x-61dafb)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6)
![Vite](https://img.shields.io/badge/Vite-7.x-646cff)

A real-time audience polling system that enables hosts to create polls and participants to vote with instant, visualized results.

---

## 📋 Table of Contents

- [Features](#-features)
- [Architecture](#-architecture)
- [Project Structure](#-project-structure)
- [Workflow](#-workflow)
- [Technology Stack](#-technology-stack)
- [Setup & Installation](#-setup--installation)
- [Environment Variables](#-environment-variables)
- [API Documentation](#-api-documentation)
- [Development](#-development)
- [License](#-license)

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🎯 Real-time Polling | Host creates polls with custom questions and options |
| 📱 QR Code Join | Participants scan QR code or enter URL to join |
| 📊 Live Vote Count | Real-time updates showing total votes cast |
| 📈 Visual Results | Beautiful bar chart visualization of results |
| 🌐 Multi-device | Works on desktop, tablet, and mobile devices |
| 🎨 Modern UI | Dark-themed interface with glassmorphism effects |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           Live Poll System                              │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌─────────────────────┐         ┌──────────────────────┐               │
│  │   Frontend (React)  │         │    Backend API       │               │
│  │  (Vite + TypeScript)│ ◄─────► │   (FastAPI/Python)   │               │
│  └─────────────────────┘         └──────────────────────┘               │
│         │                                │                              │
│         │                                │                              │
│  ┌──────┴──────┐                  ┌──────┴───────┐                      │
│  │             │                  │              │                      │
│  ▼             ▼                  ▼              ▼                      │
│  Host Flow  Participant Flow  PostgreSQL    Redis (Cache)               │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 📁 Project Structure

```
livepoll-frontend/
│
├── public/
│   └── vite.svg                    # Favicon and logo
│
├── src/
│   ├── api.ts                      # API endpoint configuration
│   ├── App.tsx                     # Main app router configuration
│   ├── main.tsx                    # React entry point
│   ├── index.css                   # Global styles & theme
│   └── vite-env.d.ts               # Vite type definitions
│
│   └── pages/                      # Page components
│       ├── HostCreate.tsx          # Create new poll (Host)
│       ├── HostActive.tsx          # Active poll with QR code (Host)
│       ├── HostResults.tsx         # Visualized results chart (Host)
│       ├── ParticipantVote.tsx     # Vote interface (Participant)
│       └── ParticipantSuccess.tsx  # Vote confirmation (Participant)
│
├── index.html                      # HTML template
├── package.json                    # Dependencies & scripts
├── tsconfig.json                   # TypeScript configuration
├── vite.config.ts                  # Vite configuration
└── README.md                       # Project documentation
```

---

## 🔄 Workflow

### Host Workflow

```
┌───────────────────────────────────────────────────────────────────────────┐
│                            Host Flow                                      │
├───────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  1. Create Poll            2. Poll Active            3. End Poll          │
│  ┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐  │
│  │  /              │       │  /poll/:id/     │       │  /poll/:id/     │  │
│  │  HostCreate     │  ──►  │  active         │  ──►  │  results        │  │
│  │  - Question     │       │  - QR Code      │       │  - Chart        │  │
│  │  - Options      │       │  - Live vote    │       │  - Results      │  │
│  └─────────────────┘       │  - Real-time    │       └─────────────────┘  │
│                            └─────────────────┘                            │
│                                                                           │
└───────────────────────────────────────────────────────────────────────────┘
```

### Participant Workflow

```
┌───────────────────────────────────────────────────────────────────────────┐
│                          Participant Flow                                 │
├───────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  1. Join Poll              2. Cast Vote              3. Confirmation      │
│  ┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐  │
│  │  /join/:id      │  ──►  │  /join/:id      │  ──►  │  /join/:id/     │  │
│  │  ParticipantVote│       │  (Vote page)    │       │  thanks         │  │
│  │  - View poll    │       │  - Select       │       │  Participant    │  │
│  │  - Select opt   │       │  - Submit vote  │       │  Success        │  │
│  └─────────────────┘       └─────────────────┘       └─────────────────┘  │
│                                                                           │
└───────────────────────────────────────────────────────────────────────────┘
```

### Complete System Workflow

```
┌────────────────────────────────────────────────────────────────────────────┐
│                        Complete System Flow                                │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│  HOST SIDE:                                  PARTICIPANT SIDE:             │
│                                                                            │
│  1. Create Poll (POST /polls)          2. Join Poll (GET /polls/:id)       │
│     ┌────────────┐                             ┌─────────────┐             │
│     │  /polls    │ ──────────────────────────► │  /join/:id  │             │
│     └──────┬─────┘                             └──────┬──────┘             │
│            │                                          │                    │
│            ▼                                          ▼                    │
│  3. Display QR/URL                   4. View Poll (GET /polls/:id)         │
│     ┌────────────┐                             ┌─────────────┐             │
│     │ /polls/:id │ ◄────────────────────────── │  /join/:id  │             │
│     └──────┬─────┘                             └──────┬──────┘             │
│            │                                          │                    │
│            ▼                                          ▼                    │
│  5. Participant Votes (POST /polls/:id/vote)                               │
│     ┌──────────────────┐            6. Real-time Sync (Every 2s)           │
│     │ /polls/:id/vote  │ ◄────────┐  ┌─────────────────┐                   │
│     └──────────────────┘          │  │ /polls/:id      │                   │
│                                   └─►└─────────────────┘                   │
│                                                                            │
│  7. End Poll (POST /polls/:id/end)      8. View Results (GET /polls/:id)   │
│     ┌──────────────────┐              ┌────────────────────┐               │
│     │ /polls/:id/end   │ ──────────►  │ /polls/:id/results │               │
│     └──────────────────┘              └────────────────────┘               │
│                                                                            │
└────────────────────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Technology Stack

### Frontend

| Technology | Version | Description |
|------------|---------|-------------|
| React | ^19.2.14 | UI library |
| TypeScript | ~5.9.3 | Type-safe JavaScript |
| Vite | ^7.3.1 | Build tool & dev server |
| React Router DOM | ^7.13.1 | Client-side routing |
| Axios | ^1.13.5 | HTTP client |
| Recharts | ^3.7.0 | Chart visualization |
| QRCode.react | ^4.2.0 | QR code generation |

### Backend (Assumed)

| Technology | Description |
|------------|-------------|
| FastAPI | Python web framework |
| PostgreSQL | Database |
| Redis | Caching layer |

---

## 🚀 Setup & Installation

### Prerequisites

- Node.js 18+ 
- npm, pnpm, or bun

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/mochiyaki/livepoll.git
   cd livepoll-frontend/livepoll-frontend-git
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   # or
   bun install
   ```

3. **Configure environment variables** (optional)

   Create a `.env.local` file in the project root:
   ```env
   VITE_API_URL=http://localhost:8000
   ```

4. **Start the development server**
   ```bash
   npm run dev
   # or
   pnpm dev
   # or
   bun dev
   ```

   The application will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
# or
pnpm build
# or
bun run build
```

### Preview Production Build

```bash
npm run preview
# or
pnpm preview
# or
bun run preview
```

---

## ⚙️ Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_API_URL` | `http://localhost:8000` | Backend API endpoint |

When the frontend is served from a different origin (e.g., deployed), the API URL will automatically default to the current origin.

---

## 📡 API Documentation

### Host Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/polls` | Create a new poll |
| `GET` | `/polls/:id` | Get poll details |
| `POST` | `/polls/:id/end` | End the poll |
| `GET` | `/polls/:id/results` | Get poll results |

### Participant Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/polls/:id` | Get poll for voting |
| `POST` | `/polls/:id/vote` | Submit a vote |

### Request/Response Examples

#### Create Poll

**Request:**
```http
POST /polls
Content-Type: application/json

{
  "question": "What's your favorite programming language?",
  "options": ["JavaScript", "Python", "TypeScript", "Go"]
}
```

**Response:**
```json
{
  "id": "abc123"
}
```

#### Get Poll

**Request:**
```http
GET /polls/abc123
```

**Response:**
```json
{
  "id": "abc123",
  "question": "What's your favorite programming language?",
  "is_active": true,
  "options": [
    {"id": 1, "text": "JavaScript", "votes": 15},
    {"id": 2, "text": "Python", "votes": 23},
    {"id": 3, "text": "TypeScript", "votes": 8},
    {"id": 4, "text": "Go", "votes": 4}
  ]
}
```

#### Submit Vote

**Request:**
```http
POST /polls/abc123/vote
Content-Type: application/json

{
  "option_id": 2
}
```

---

## 🎨 Theme

The application features a dark-themed interface with:

- **Primary Colors**: Violet gradient (#8b5cf6, #6366f1)
- **Background**: Dark (#0a0e1a) with subtle radial gradients
- **Cards**: Glassmorphism effect with backdrop blur
- **Borders**: Semi-transparent white

---

## 📝 Development

### Running Lint

```bash
npx tsc --noEmit
```

### File Structure Guidelines

- **Pages**: Each page component in `src/pages/`
- **Components**: Reusable UI components in `src/components/` (if needed)
- **API**: All API-related code in `src/api.ts`
- **Styles**: Global styles in `src/index.css`

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [Vite](https://vitejs.dev/) for the blazing fast build tool
- [React](https://react.dev/) for the UI library
- [Recharts](https://recharts.org/) for the charting library

---

<p align="center">
  Made with ❤️ for real-time audience engagement
</p>