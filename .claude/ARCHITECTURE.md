# Record Collection - Technical Architecture

## System Architecture

### High-Level Overview

```
┌──────────────────────────────────────────────────────────────┐
│                        Web Browser                            │
│  ┌─────────────────────────────────────────────────────┐    │
│  │              React Application                       │    │
│  │  ┌──────────────┐  ┌──────────────┐                │    │
│  │  │PlayerContext │  │LibraryContext│                │    │
│  │  │  (useReducer)│  │  (useReducer)│                │    │
│  │  └──────┬───────┘  └──────┬───────┘                │    │
│  │         │                  │                         │    │
│  │  ┌──────▼──────────────────▼───────┐                │    │
│  │  │       Home Page Component       │                │    │
│  │  │  ┌────────┐ ┌────────┐ ┌─────┐ │                │    │
│  │  │  │Library │ │Player  │ │Queue│ │                │    │
│  │  │  │        │ │Control │ │     │ │                │    │
│  │  │  └────────┘ └────────┘ └─────┘ │                │    │
│  │  └────────────┬───────────────┬────┘                │    │
│  └───────────────┼───────────────┼─────────────────────┘    │
│                  │               │                            │
│            HTTP  │               │ SSE                        │
└─────────────────┼───────────────┼────────────────────────────┘
                  │               │
┌─────────────────▼───────────────▼────────────────────────────┐
│                    Express Server                             │
│  ┌─────────────────────────────────────────────────────┐    │
│  │                   Routes Layer                       │    │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐         │    │
│  │  │ /player  │  │ /library │  │   /sse   │         │    │
│  │  │  routes  │  │  routes  │  │  stream  │         │    │
│  │  └─────┬────┘  └─────┬────┘  └─────┬────┘         │    │
│  └────────┼─────────────┼─────────────┼──────────────┘    │
│           │             │             │                      │
│  ┌────────▼─────────────▼─────────────▼──────────────┐    │
│  │              Services Layer                         │    │
│  │  ┌─────────────────────────────────────────┐       │    │
│  │  │         MpcService (Singleton)          │       │    │
│  │  │  ┌──────────────┐  ┌──────────────┐    │       │    │
│  │  │  │ RxJS Subject │  │  MPC Client  │    │       │    │
│  │  │  │ (State Bus)  │  │   (mpc-js)   │    │       │    │
│  │  │  └──────┬───────┘  └──────┬───────┘    │       │    │
│  │  │         │                  │             │       │    │
│  │  │         │                  ▼             │       │    │
│  │  │         │         ┌──────────────┐      │       │    │
│  │  │         └────────►│ Event Loop   │      │       │    │
│  │  │                   └──────────────┘      │       │    │
│  │  └─────────────────────────────────────────┘       │    │
│  │  ┌─────────────┐  ┌──────────────┐               │    │
│  │  │CacheService │  │LibraryService│               │    │
│  │  └─────────────┘  └──────────────┘               │    │
│  └──────────────────────────┬──────────────────────────┘    │
└───────────────────────────┬─┼──────────────────────────────┘
                            │ │
                         TCP│ │File I/O
┌───────────────────────────▼─▼──────────────────────────────┐
│                    Local System                             │
│  ┌──────────────┐           ┌──────────────┐              │
│  │     MPD      │           │  Music Files │              │
│  │  (TCP 6600)  │           │  + Cover Art │              │
│  └──────────────┘           └──────────────┘              │
└─────────────────────────────────────────────────────────────┘
```

---

## Server Architecture

### MpcService - Core Integration (`packages/server/src/services/mpc.service.ts`)

**Purpose**: Singleton service that maintains persistent TCP connection to MPD and manages all music player operations.

#### Connection Lifecycle

**Initialization** (lines 22-37):
```typescript
constructor({ port }: { port: number }) {
  this.initMpc(port).catch(console.error);
}

private async initMpc(port: number) {
  this.mpc = new MPC();
  this.attachConnectionEventListeners();
  this.attachMpdStateListener();
  await this.mpc.connectTCP("0.0.0.0", port);
}
```

**Connection Events**:
- `ready` - Connection established successfully
- `socket-error` - Connection error (logged)
- `socket-end` - MPD closed connection

#### Event-Driven State Management

**Architecture Pattern**: Observer pattern with RxJS Subject as event bus

```
MPD Subsystem Change
        ↓
mpc.on("changed", subsystems)
        ↓
    [dispatcher]
        ↓
   ┌────┴────┐
   ↓         ↓
"player"  "playlist"
   ↓         ↓
handlePlayerChanged()  handlePlaylistChanged()
   ↓         ↓
   └────┬────┘
        ↓
  $stateStream.next(update)
        ↓
   [RxJS Subject]
        ↓
    SSE Subscribers
```

**Key Implementation** (lines 68-95):
1. MPD emits `"changed"` event with array of subsystem names
2. Dispatcher routes to appropriate handler:
   - `"player"` → `handlePlayerChanged()` - playback state changes
   - `"playlist"` → `handlePlaylistChanged()` - queue modifications
3. Handlers fetch fresh state from MPD
4. State pushed to RxJS `Subject<SoundSystemUpdates>`
5. All SSE clients subscribed to subject receive update

**Important Quirk** (lines 87-90): When current song changes, MPD doesn't emit `"playlist"` event, so `handlePlayerChanged()` manually sends both player AND queue state.

#### Data Structures

**Player State** (lines 105-117):
```typescript
{
  type: "player",
  payload: {
    currentSong: PlaylistItem | undefined,
    status: {
      state: "play" | "pause" | "stop",
      elapsed: number,      // seconds
      duration: number,     // seconds
      volume: number,       // 0-100
      repeat: boolean,
      random: boolean,
      consume: boolean,
      // ... other MPD status fields
    }
  }
}
```

**Queue State** (lines 168-180):
```typescript
{
  type: "queue",
  payload: {
    fullQueue: PlaylistItem[],  // Array of songs
    currentIndex: number | undefined
  }
}
```

**PlaylistItem** (from mpc-js):
```typescript
{
  id: number,           // MPD queue ID (ephemeral)
  pos: number,          // Position in queue
  file: string,         // File path in MPD library
  album?: string,
  albumArtist?: string,
  artist?: string,
  title?: string,
  track?: string,       // Track number
  duration?: number,
  // ... other metadata
}
```

#### Music Control Methods

**Playback Control** (lines 119-147):
- `play()` - Start playback
- `pause()` - Pause playback
- `next()` - Skip forward (auto-plays if stopped)
- `previous()` - Skip backward (auto-plays if stopped)

**Queue Manipulation** (lines 149-257):
- `addTrackToQueue(trackId: string)` - Add single track by file path
- `addAlbumToQueue(albumId: AlbumId)` - Add all tracks from album (sorted by track number)
- `removeItemsFromQueue(songIds: number[])` - Remove multiple items concurrently

**Album ID Parsing** (lines 156-164):
```typescript
// Input: "album#Continuum#artist#John Mayer"
// Parsed to: { albumName: "Continuum", artistName: "John Mayer" }
// MPD Query: findAdd with filters:
//   - "Album" = "Continuum"
//   - "AlbumArtist" = "John Mayer"
//   - Sort by "track" field
```

#### Album Data & Cover Art

**Album List** (lines 182-222):
```typescript
getAlbums() // Uses caching via readThroughWithBackgroundRefresh
  ↓
mpc.database.list("Album", [], ["AlbumArtist"])
  ↓
Filter out entries without artist/album
  ↓
For each album:
  - Generate albumId: "album#<name>#artist#<artist>"
  - Generate albumCoverArtUrl: "/library/album/:albumId/cover"
  - Get albumAddedAt: max lastModified timestamp from tracks
  ↓
Return array of album metadata
```

**Track Metadata** (lines 224-230):
- `getTracksForAlbum(albumId)` - **Memoized** with lodash
- Returns array of `Song` objects for album
- Cache cleared on `update()` call

**Album Added Date** (lines 232-246):
- Fetches all tracks for album
- Reduces to find most recent `lastModified` timestamp
- Returns Unix timestamp in milliseconds

**Cover Art Resolution**:
1. Parse albumId to get album/artist names
2. Fetch first track from album
3. Extract directory path from track file path
4. Search directory for `cover.jpg`, `cover.png`, or `cover.jpeg` (case-insensitive)
5. Return `ReadStream` if found, `void` otherwise

#### Database Updates

**update()** (lines 248-251):
```typescript
update() {
  this.getTracksForAlbum.cache.clear(); // Clear memoization
  return this.mpc.database.update();    // Trigger MPD rescan
}
```

---

### CacheService - Read-Through Caching (`packages/server/src/services/cache.service.ts`)

**Purpose**: Implements "stale-while-revalidate" pattern for expensive operations.

#### Cache Configuration (lines 3-7)
- **Storage**: `./.cache` directory (file-system-cache)
- **Namespace**: `"my-namespace"`
- **Hash Algorithm**: SHA1 for cache keys

#### Read-Through with Background Refresh (lines 18-40)

```typescript
async function readThroughWithBackgroundRefresh<T>(
  cacheKey: string,
  dataFetchCb: () => Promise<T>
): Promise<T>
```

**Algorithm**:
```
1. Initiate cache read (non-blocking)
2. Simultaneously trigger data fetch
3. When fresh data arrives:
   - Update cache asynchronously (fire-and-forget)
4. Return:
   - Cached data if available (instant response)
   - Fresh data if no cache (wait for fetch)
```

**Characteristics**:
- **Stale-while-revalidate**: Clients get instant cached responses while fresh data loads in background
- **Cache-aside pattern**: Cache populated on-demand
- **Persistent**: Survives server restarts (disk-based)

**Usage in MpcService**:
- `getAlbums()` wrapped with this cache strategy (line 182-184)
- Cache key: `"getAlbumsResponse"`
- Result: First request waits for MPD query, subsequent requests return instantly

---

### LibraryService - File System Operations (`packages/server/src/services/library.service.ts`)

**getAlbumCoverArt()** (lines 20-34):
```typescript
async getAlbumCoverArt({ albumId }: { albumId: AlbumId }) {
  // 1. Get tracks for album (memoized)
  const tracks = await MpcService.getTracksForAlbum(albumId);

  // 2. Extract directory from first track's file path
  const albumPath = path.dirname(tracks[0].file);

  // 3. Search for cover image file
  const coverArtPath = await findCoverArtInDirectory(albumPath);

  // 4. Return read stream
  if (coverArtPath) {
    return createReadStream(coverArtPath);
  }
}
```

**findCoverArtInDirectory()** (`library.helpers.ts` line 30-54):
- Reads directory file list
- Filters by regex: `/^cover.(jpg|jpeg|png)/i`
- Returns full path to first match

---

### Route Layer

#### Player Routes (`packages/server/src/routes/player/`)

**Endpoint Structure**:
| Method | Path | Handler | Purpose |
|--------|------|---------|---------|
| POST | `/player/play` | handlePlay | Start playback |
| POST | `/player/pause` | handlePause | Pause playback |
| POST | `/player/next` | handleNext | Skip forward |
| POST | `/player/previous` | handlePrevious | Skip backward |
| GET | `/player/queue` | handleGetQueue | Get queue state |
| POST | `/player/queue/track` | handleAddTrackToQueue | Add single track |
| POST | `/player/queue/album` | handleAddAlbumToQueue | Add album |
| POST | `/player/queue/remove` | handleRemoveItemsFromQueue | Remove items |

**Handler Pattern**:
```typescript
export const handlePlay: RequestHandler = async (req, res) => {
  try {
    const result = await MpcService.play();
    return res.status(200).send(result);
  } catch (err) {
    return res.status(500).send(err);
  }
};
```

#### Library Routes (`packages/server/src/routes/library/`)

| Method | Path | Handler | Purpose |
|--------|------|---------|---------|
| GET | `/library/albums` | handleGetAlbums | Get all albums |
| POST | `/library/update` | handleUpdateDatabase | Trigger MPD rescan |
| GET | `/library/album/:albumId/cover` | handleGetCoverArt | Stream cover image |

**Cover Art Handler** (`getCoverArt.ts` lines 5-23):
```typescript
1. Parse albumId from URL params
2. Call LibraryService.getAlbumCoverArt()
3. If not found: redirect to default image
4. Detect MIME type from stream header (stream-mime-type)
5. Set headers:
   - Content-Type: <detected MIME>
   - Cache-Control: public, max-age=604800 (1 week)
6. Pipe file stream to response
```

#### SSE Route (`packages/server/src/routes/sse/`)

**Endpoint**: `GET /sse/stream`

**Handler** (`stream.ts` lines 4-20):
```typescript
1. Set SSE headers:
   - Content-Type: text/event-stream
   - Cache-Control: no-cache
   - Connection: keep-alive
   - Access-Control-Allow-Origin: *

2. Subscribe to MpcService state stream:
   - Callback writes events to response: "data: <JSON>\n\n"
   - Immediately sends current player + queue state

3. Listen for client disconnect:
   - Unsubscribe from RxJS stream (prevents memory leak)
```

**Event Format**:
```
data: {"type":"player","payload":{...}}\n\n
```

---

## Client Architecture

### State Management

#### PlayerContext (`packages/client/src/state/player.context.tsx`)

**Architecture**: React Context + useReducer pattern

```typescript
State Shape:
{
  player: {
    currentSong: PlaylistItem | {},
    status: Status | {}
  },
  queue: {
    fullQueue: PlaylistItem[],
    currentIndex: number | 0
  }
}

Actions:
- { type: "player", payload: {...} }
- { type: "queue", payload: {...} }
```

**Reducer** (lines 28-48):
- `"player"` action → Update `player` field
- `"queue"` action → Update `queue` field

**SSE Integration** (lines 53-55):
```typescript
useEffect(() => {
  PlayerStateSSEConnection.addMessageHandler(dispatch);
}, []);
```
- Connects reducer dispatch to SSE message handler
- Every SSE event dispatches action to reducer
- UI automatically re-renders on state change

#### LibraryContext (`packages/client/src/state/library.context.tsx`)

**State Shape**:
```typescript
{
  albums: GetAlbumsReturnType  // Array of album objects
}

Actions:
- { type: "newAlbums", payload: [...] }
```

**Data Fetch** (lines 40-46):
```typescript
useEffect(() => {
  void getAlbums().then((a) => {
    dispatch({ type: "newAlbums", payload: a });
  });
}, []);
```
- Fetches albums on component mount
- Updates context state via dispatch

---

### API Client (`packages/client/src/api/client.ts`)

#### HTTP Client (lines 47-88)

**Axios Configuration**:
```typescript
const client = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL
});
```

**API Methods**:
- `getAlbums()` → GET `/library/albums`
- `playPlayback()` → POST `/player/play`
- `pausePlayback()` → POST `/player/pause`
- `nextTrack()` → POST `/player/next`
- `previousTrack()` → POST `/player/previous`
- `addAlbumToQueue(albumId)` → POST `/player/queue/album`
- `getCurrentQueueState()` → GET `/player/queue`
- `removeItemsFromQueue(songIds)` → POST `/player/queue/remove`

#### SSE Connection (lines 90-128)

**SSEConnection Class**:
```typescript
class SSEConnection<MessagePayload> {
  private eventSource: EventSource;

  constructor(url: string) {
    this.eventSource = new EventSource(url);
    this.eventSource.addEventListener("open", ...);
    this.eventSource.addEventListener("error", ...);
  }

  addMessageHandler(callback: (payload: MessagePayload) => void) {
    this.eventSource.addEventListener("message", (event) => {
      const data = JSON.parse(event.data);
      await callback(data);
    });
  }
}
```

**Singleton Instance** (lines 126-128):
```typescript
export const PlayerStateSSEConnection =
  new SSEConnection<SoundSystemUpdates>(
    process.env.REACT_APP_BACKEND_URL + "/sse/stream"
  );
```

---

### Component Architecture

#### Application Structure

```
App.tsx (BrowserRouter)
  └── AppWithProviders
      └── LibraryProvider
          └── PlayerProvider
              └── App
                  └── Routes
                      └── HomePage
                          ├── Library (left panel)
                          └── Right panel
                              ├── PlayerController (top)
                              └── Queue (bottom)
```

#### HomePage (`packages/client/src/pages/Home/Home.tsx`)

**Layout** (lines 40-67):
```typescript
<div className={styles.homeContainer}>
  <div className={styles.leftBar}>
    <Library
      albums={libraryContext.albums}
      onAlbumSelect={(albumId) => addAlbumToQueue(albumId)}
    />
  </div>
  <div className={styles.rightBar}>
    <PlayerController
      albumName={album}
      artistName={artist || albumArtist}
      trackName={title}
      albumCoverArtUrl={currentAlbum?.albumCoverArtUrl}
      isPlaying={playerContext.player.status.state === "play"}
      onPlay={playPlayback}
      onPause={pausePlayback}
      onNext={nextTrack}
      onPrevious={previousTrack}
    />
    <Queue currentQueue={playerContext.queue} />
  </div>
</div>
```

**Context Usage** (lines 18-38):
- Reads from `PlayerContext` for current song and playback state
- Reads from `LibraryContext` for album list
- Derives current album by matching currentSong album/artist to library

#### Library Component (`packages/client/src/components/Library/Library.tsx`)

**Features** (lines 28-76):
1. **Sort Options** (lines 12-24):
   - A-Z artist (primary: artist, secondary: album)
   - Recently added (by `albumAddedAt` timestamp)
   - Shuffle (random sort)

2. **Memoized Sorting** (lines 39-51):
   - `albumsHash` computed from all album IDs (memoized)
   - `sortedAlbums` recomputed only when hash or sort option changes

3. **Rendering**:
   - Dropdown for sort selection
   - Grid of `AlbumCover` components
   - Click handler calls `onAlbumSelect(albumId)`

#### PlayerController Component (`packages/client/src/components/PlayerController/PlayerController.tsx`)

**Display** (lines 30-53):
- If `songId` is number: Show current track info + cover art
- If no song: Show "Nuthin playin..."

**Controls** (lines 54-66):
- Previous button
- Play/Pause button (toggles based on `isPlaying` prop)
- Next button

**Props** (lines 5-16):
```typescript
{
  onPlay, onPause, onNext, onPrevious,  // Callbacks
  albumName, artistName, trackName,     // Current track info
  albumCoverArtUrl,                     // Cover image
  isPlaying,                             // Playback state
  songId                                 // Track ID (presence indicates song)
}
```

#### Queue Component (`packages/client/src/components/Queue/Queue.tsx`)

**State Management** (lines 13-42):
- Local state: `selectedQueueItemIds` (array of MPD song IDs)
- `useEffect` syncs local selection with actual queue (clears invalid selections)

**Features**:
1. **Multi-select** (lines 17-23):
   - Click queue item toggles selection

2. **Remove Selected** (lines 25-30):
   - Calls `removeItemsFromQueue(selectedQueueItemIds)`

3. **Select All** (lines 44-56):
   - Selects all items EXCEPT currently playing track
   - If all already selected, deselects all

**Rendering** (lines 58-80):
- `QueueControls` component (remove, select all buttons)
- Slices queue from `currentIndex + 1` to end (only shows upcoming tracks)
- Maps to `QueueItem` components with selection state

---

## Data Flow Diagrams

### User Clicks Play Button

```
1. User clicks "Play"
   ↓
2. PlayerController calls onPlay()
   ↓
3. API client: POST /player/play
   ↓
4. Route handler: handlePlay()
   ↓
5. MpcService.play()
   ↓
6. mpc.playback.play() [TCP to MPD]
   ↓
7. MPD starts playback
   ↓
8. MPD emits "player" subsystem change
   ↓
9. MpcService.handlePlayerChanged()
   ↓
10. Fetch current player state
    ↓
11. Push to $stateStream (RxJS Subject)
    ↓
12. SSE handler writes event to all clients
    ↓
13. Client EventSource receives message
    ↓
14. PlayerContext dispatch({ type: "player", payload })
    ↓
15. React re-renders PlayerController with new state
    ↓
16. UI shows "Stop" button instead of "Play"
```

### User Adds Album to Queue

```
1. User clicks album cover in Library
   ↓
2. Library calls onAlbumSelect(albumId)
   ↓
3. Home passes to addAlbumToQueue(albumId)
   ↓
4. API client: POST /player/queue/album { albumId }
   ↓
5. Route handler: handleAddAlbumToQueue()
   ↓
6. MpcService.addAlbumToQueue(albumId)
   ↓
7. Parse albumId → { albumName, artistName }
   ↓
8. mpc.database.findAdd(filters) [TCP to MPD]
   ↓
9. MPD adds all matching tracks to queue
   ↓
10. MPD emits "playlist" subsystem change
    ↓
11. MpcService.handlePlaylistChanged()
    ↓
12. Fetch current queue state
    ↓
13. Push to $stateStream
    ↓
14. SSE handler writes event to all clients
    ↓
15. Client EventSource receives message
    ↓
16. PlayerContext dispatch({ type: "queue", payload })
    ↓
17. React re-renders Queue component
    ↓
18. UI shows new tracks in queue
```

### Album List Load on Page Mount

```
1. LibraryProvider mounts
   ↓
2. useEffect calls getAlbums()
   ↓
3. API client: GET /library/albums
   ↓
4. Route handler: handleGetAlbums()
   ↓
5. MpcService.getAlbums() [wrapped with cache]
   ↓
6. CacheService.readThroughWithBackgroundRefresh()
   ↓
7. Check cache for "getAlbumsResponse"
   ↓
8a. If cached: Return cached data instantly
8b. If not cached: Wait for fresh data
   ↓
9. Trigger background refresh (always)
   ↓
10. mpc.database.list("Album", [], ["AlbumArtist"])
    ↓
11. For each album:
    - Generate albumId
    - Generate albumCoverArtUrl
    - Get albumAddedAt from track metadata
    ↓
12. Update cache asynchronously
    ↓
13. Return album array to client
    ↓
14. LibraryContext dispatch({ type: "newAlbums", payload })
    ↓
15. React re-renders Library component
    ↓
16. UI displays album grid
```

### Cover Art Image Request

```
1. Browser requests: GET /library/album/:albumId/cover
   ↓
2. Route handler: handleGetCoverArt()
   ↓
3. LibraryService.getAlbumCoverArt(albumId)
   ↓
4. MpcService.getTracksForAlbum(albumId) [memoized]
   ↓
5. Extract directory path from first track
   ↓
6. findCoverArtInDirectory(dirPath)
   ↓
7. Read directory file list
   ↓
8. Filter by /^cover.(jpg|jpeg|png)/i
   ↓
9. Return ReadStream for first match
   ↓
10. Detect MIME type from stream header
    ↓
11. Set headers:
    - Content-Type: image/jpeg
    - Cache-Control: public, max-age=604800
    ↓
12. Pipe stream to response
    ↓
13. Browser displays image
    ↓
14. Browser caches image for 1 week
```

---

## Type System & API Contract

### Shared Types (`packages/server/src/types/api-contract.d.ts`)

**SoundSystemUpdateMap** (lines 44-62):
```typescript
{
  queue: {
    fullQueue: PlaylistItem[],
    currentIndex?: number
  },
  player: {
    currentSong?: PlaylistItem,
    status: Status  // MPD status object
  },
  // Other MPD subsystems (not currently used)
  database: null,
  update: null,
  mixer: null,
  // ... etc
}
```

**SoundSystemUpdate<T>** (lines 64-67):
```typescript
{
  type: T,  // keyof SoundSystemUpdateMap
  payload: SoundSystemUpdateMap[T]
}
```

**SoundSystemUpdates** (lines 72-74):
```typescript
// Union of supported update types
| SoundSystemUpdate<"player">
| SoundSystemUpdate<"queue">
```

**AlbumId** (line 79):
```typescript
// Template literal type ensures format
type AlbumId = `album#${string}#artist${string}`;
```

**GetAlbumsReturnType** (lines 81-87):
```typescript
Array<{
  albumId: AlbumId,
  albumName: string,
  albumArtist: string,
  albumCoverArtUrl?: string,
  albumAddedAt: number  // Unix timestamp (ms)
}>
```

**API Type Definitions** (lines 5-42):
```typescript
{
  player: {
    getQueue: {
      GET: RequestHandler<..., QueueState | Error, ...>
    }
  },
  library: {
    albums: {
      GET: RequestHandler<..., GetAlbumsReturnType | Error, ...>
    },
    album: {
      albumId: {
        ["cover-art"]: {
          GET: RequestHandler<{ albumId }, ReadStream | Error, ...>
        }
      }
    }
  }
}
```

---

## Performance Optimizations

### Server-Side

1. **Read-Through Caching** (`CacheService`):
   - Album list queries cached to disk
   - Stale-while-revalidate pattern: instant responses + background refresh
   - Persistent across server restarts

2. **Memoization** (`MpcService`):
   - Track metadata memoized by album ID
   - In-memory cache cleared on library update

3. **Concurrent Operations**:
   - Queue item removal uses `Promise.all()` for parallel deletion

4. **Event-Driven Architecture**:
   - RxJS Subject allows single MPD connection to serve multiple SSE clients
   - No polling - push-based updates only

### Client-Side

1. **Browser Caching**:
   - Cover art cached for 1 week via `Cache-Control` headers

2. **Memoization** (`Library` component):
   - Album hash computed to minimize re-sorts
   - Sorted albums only recomputed when necessary

3. **Optimistic Rendering**:
   - SSE updates provide instant feedback without polling

---

## Error Handling & Resilience

### Server

**Route Error Handling**:
```typescript
try {
  const result = await Service.method();
  return res.status(200).send(result);
} catch (err) {
  return res.status(500).send(err);
}
```

**MPD Connection**:
- Connection errors logged but not retried automatically
- Application continues running even if MPD unavailable
- SSE clients receive errors if MPD calls fail

**SSE Message Handling** (`client.ts` lines 112-116):
```typescript
try {
  await messageHandler(data);
} catch (error) {
  console.error("Error handling SSE message", { error });
  // Don't disconnect - log and continue
}
```

### Client

**API Errors**:
- Axios errors propagate to calling component
- No global error boundary - errors logged to console

**SSE Connection**:
- `"error"` event listener logs but doesn't reconnect
- EventSource has built-in reconnection logic

---

## Security Considerations

### Current State
- No authentication/authorization
- CORS enabled for all origins (`Access-Control-Allow-Origin: *`)
- No rate limiting
- No input validation on most endpoints
- File system access via user-provided album IDs

### Recommendations for Production
1. Add authentication layer
2. Restrict CORS to known origins
3. Implement rate limiting
4. Validate and sanitize album IDs (prevent path traversal)
5. Add HTTPS
6. Implement CSRF protection
7. Add security headers (helmet middleware already included)

---

## Deployment Architecture

### Development
```
localhost:3000 (React dev server)
      ↓
localhost:4000 (Express API)
      ↓
localhost:6600 (MPD)
```

### Production (Heroku)
```
Browser
  ↓
Heroku Router (HTTPS)
  ↓
Node.js Process (Express serves static files + API)
  ↓
External MPD instance (TCP)
```

**Build Process**:
1. `yarn build` compiles TypeScript (server) and React (client)
2. Server serves client build from `packages/client/build`
3. All routes except API routes fallback to `index.html` (SPA routing)

---

## Future Architecture Considerations

### Scalability
- **Current**: Single-server, single-MPD connection
- **Scaling Issues**:
  - SSE connections limited by Node.js event loop
  - File-system cache not shared across instances
- **Solutions**:
  - Redis for shared cache
  - Redis Pub/Sub for SSE fan-out
  - Load balancer with sticky sessions

### Multi-User Support
- Add user authentication
- Separate MPD instances per user OR
- Virtual queues mapped to MPD playlists

### Offline Support
- Service worker for PWA
- IndexedDB for album metadata
- Background sync for queue operations
