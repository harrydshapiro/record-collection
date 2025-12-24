# Record Collection - Project Summary

## Purpose

Record Collection is a web-based music player application that provides a modern interface for controlling and browsing a personal music library managed by MPD (Music Player Daemon). It allows users to:

- Browse their music library by album with cover art
- Control playback (play, pause, next, previous)
- Manage playback queue
- Receive real-time updates when playback state changes
- Sort albums by artist, recently added, or shuffle

## Architecture Overview

The project is a **TypeScript monorepo** with three main components:

```
┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│   React     │  HTTP   │   Express   │  TCP    │     MPD     │
│   Client    │◄───────►│   Server    │◄───────►│   (Music    │
│             │   SSE   │             │         │   Player    │
│             │◄────────│             │         │   Daemon)   │
└─────────────┘         └─────────────┘         └─────────────┘
```

1. **Client** (`packages/client`) - React SPA that provides the user interface
2. **Server** (`packages/server`) - Express API that bridges the client and MPD
3. **MPD** - External music player daemon that manages the actual music library and playback

### Communication Flow

- **Client ↔ Server**: REST API for commands, Server-Sent Events (SSE) for real-time state updates
- **Server ↔ MPD**: TCP connection using the MPD protocol via `mpc-js` library
- **Event Flow**: MPD state changes → Server broadcasts via SSE → Client updates UI reactively

## Tech Stack

### Client
- **React 18** - UI framework
- **TypeScript** - Type safety
- **React Context + useReducer** - State management
- **Axios** - HTTP client
- **EventSource** - SSE connection for real-time updates
- **SCSS** - Styling
- **react-router-dom** - Routing

### Server
- **Node.js + Express** - Web server
- **TypeScript** - Type safety
- **mpc-js** - MPD protocol client library
- **RxJS** - Reactive state management and event streaming
- **file-system-cache** - Persistent disk-based caching
- **lodash** - Utility functions (memoization)

### Infrastructure
- **Yarn Workspaces** - Monorepo management
- **Docker** - Containerization (Dockerfile and compose.yaml available)
- **Heroku** - Deployment target (scripts configured)

## Key Dependencies

### MPD Integration
- **mpc-js** (v1.3.2) - JavaScript client for Music Player Daemon protocol
  - Provides TCP connection to MPD
  - Exposes playback control, queue management, and database query APIs
  - Emits events for MPD subsystem changes

### Caching & Performance
- **file-system-cache** (v2.4.7) - Disk-based caching
  - Used for expensive album list queries
  - Implements "stale-while-revalidate" pattern
- **lodash** (v4.17.21) - Utility library
  - Used for memoizing track queries

### Real-time Communication
- **RxJS** (v7.8.1) - Reactive programming
  - Manages MPD event stream
  - Broadcasts updates to multiple SSE clients
- **EventSource** (browser native) - Client-side SSE connection

## Project Structure

```
record-collection/
├── packages/
│   ├── client/              # React web application
│   │   ├── src/
│   │   │   ├── api/         # API client and SSE connection
│   │   │   ├── components/  # React components
│   │   │   ├── pages/       # Page components
│   │   │   ├── state/       # Context providers for state management
│   │   │   └── App.tsx      # Root component
│   │   └── package.json
│   │
│   └── server/              # Express backend
│       ├── src/
│       │   ├── routes/      # API endpoints (player, library, sse)
│       │   ├── services/    # Business logic (MPC, cache, library)
│       │   ├── types/       # TypeScript type definitions
│       │   └── index.ts     # Express app setup
│       └── package.json
│
├── .cache/                  # File-system cache (gitignored)
├── .claude/                 # Project documentation for AI assistance
├── docker-compose.yaml      # Docker orchestration
├── Dockerfile               # Container definition
└── package.json             # Root workspace config
```

## Development Workflow

### Prerequisites
- Node.js (version specified in `.nvmrc`)
- Yarn package manager
- MPD installed and configured locally or via Docker
- Music library accessible to MPD

### Setup
```bash
# Install dependencies
yarn install

# Set environment variables
# Create .env file with:
# - PORT (server port, default 4000)
# - MPD_PORT (MPD TCP port, default 6600)
# - REACT_APP_BACKEND_URL (API endpoint for client)
```

### Running Locally
```bash
# Development mode (starts both client and server)
yarn workspace @record-collection/client start  # Port 3000
yarn workspace @record-collection/server dev     # Port 4000

# Production build
yarn build
yarn start
```

### Docker Deployment
```bash
docker compose up
```

## Deployment

### Heroku
The project is configured for Heroku deployment:
- **Buildpacks**: Node.js
- **Procfile**: Uses `yarn start` which runs the production server
- **Post-install hook**: Runs `yarn build` to compile TypeScript and build React app
- **Static serving**: Server serves built client from `packages/client/build`

### Environment Variables
- `PORT` - Server port (Heroku provides this)
- `MPD_PORT` - MPD daemon port (default: 6600)
- `REACT_APP_BACKEND_URL` - Client API endpoint

## Key Features

### Album Library Browsing
- Displays all albums from MPD library with cover art
- Sorts by: A-Z artist, recently added, or shuffle
- Cover art served from filesystem (looks for `cover.jpg/png` in album directory)
- Cached for performance (1-week browser cache, server-side read-through cache)

### Playback Control
- Play, pause, next, previous track controls
- Displays currently playing track with album art
- Real-time updates via SSE when playback changes

### Queue Management
- View upcoming tracks in queue
- Add entire albums to queue by clicking cover art
- Multi-select queue items for removal
- Select all functionality (excludes currently playing track)

### Real-time Synchronization
- SSE connection provides instant UI updates when:
  - Playback state changes (play/pause/stop)
  - Current track changes
  - Queue is modified
- Multiple clients stay synchronized

## Caching Strategy

### Server-Side Caching
- **Album List**: Cached to disk with background refresh
  - First request: Waits for MPD query
  - Subsequent requests: Returns cached data instantly while refreshing in background
- **Track Metadata**: Memoized in memory per album
  - Cleared on library update

### Client-Side Caching
- **Cover Art**: 1-week browser cache via `Cache-Control` headers
- **Album Data**: Stored in React context, refetched on mount

## API Endpoints

### Player Control
- `POST /player/play` - Start playback
- `POST /player/pause` - Pause playback
- `POST /player/next` - Skip to next track
- `POST /player/previous` - Skip to previous track

### Queue Management
- `GET /player/queue` - Get current queue state
- `POST /player/queue/album` - Add album to queue
- `POST /player/queue/track` - Add single track to queue
- `POST /player/queue/remove` - Remove items from queue

### Library
- `GET /library/albums` - Get all albums with metadata
- `GET /library/album/:albumId/cover` - Get album cover art image
- `POST /library/update` - Trigger MPD database rescan

### Real-time Updates
- `GET /sse/stream` - Server-Sent Events stream for player state updates

## Known Issues & TODOs

### From Code Comments
1. **Library.tsx:35-38** - Album hash for memoization is unnecessarily large (~15kb)
   - Should be generated on backend
   - Should be compressed and cached
2. **Home.tsx:24** - Context interaction pattern needs refactoring
   - One context shouldn't need to know about another
   - Consider selector-esque patterns
3. **addTrackToQueue.ts:13** - Bug with response handling
   - Calls both `.json()` and `.sendStatus()`
   - Should be `.status(200).json()`

### Potential Improvements
- Add authentication/multi-user support
- Implement search functionality
- Add playlist management
- Support for artist and track browsing (currently album-only)
- Progress bar for current track
- Volume control
- Metadata editing

## Development Notes

### MPD Quirks
- When current song changes, MPD doesn't emit a `playlist` subsystem event
- Server works around this by sending both player AND queue state on player changes

### Album ID Format
- Format: `album#<albumName>#artist#<artistName>`
- The `#` delimiter is stripped from artist/album names to prevent parsing issues
- URL-encoded when used in API endpoints

### Cover Art Resolution
- Server looks for files matching `/^cover.(jpg|jpeg|png)/i` in album directory
- Falls back to default image if not found
- MIME type detected by reading file stream header

## Support & Maintenance

### Logs
- Server logs to console (stdout/stderr)
- MPD connection events logged (ready, error, socket-end)
- SSE connection events logged (open, error, message handling errors)

### Error Handling
- Route handlers wrap service calls in try-catch
- Return 500 status on errors
- SSE message handling errors logged but don't disconnect client
- Express async errors handled by `express-async-errors` middleware
