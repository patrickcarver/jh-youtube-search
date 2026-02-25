# Setup

This assumes you have node and npm already installed and that you have your own YouTube API key.

1. Run `npm install` 
2. Copy `.env.example` to `.env.development` 
3. Add your YouTube Data API v3 key as the value for `VITE_YOUTUBE_API_KEY` in `.env.development`
4. Run `npx vite` 
5. Open your browser to `http://localhost:5173`

# AI Log Link

(Click here)[AI-LOG.md]

# Architectural Decision Record (ADR)

## Language choice (JavaScript)

I chose JavaScript since I have more experience with it as compared to TypeScript, plus using JavaScript removes build steps that TypeScript requires. I made sure to use modern ESNext features like private class fields (e.g. `#loading`), optional chaining (e.g. `foo?.bar?.value`), nullish coalescing (e.g. `value ?? "placeholder"`), using async/await for asynchronous operations, and URLSearchParams for building parameters to send to the YouTube API.

## State Management

There is no global state in this application. I decided to use Reactive Controllers since they are no more than plain JavaScript classes that implement a simple protocol (hostConnected, hostDisconnected) that can easily hook in to Lit components lifecycles and trigger re-renders via requestUpdate.

Search state is owned by the SearchController, Bookmark state by BookmarksController, and UI state specific to a component, such as the active tab, is managed locally within that component.

The controllers are completely decoupled from one other, they have no knowledge of the other.

SearchController handles keeping track what was searched and how it was ordered, what's been fetched from the YouTube API, whether more is loading, and info how to pick up the next set of results. The controller delegates all HTTP communication to the independent fetchWithRetry function, which implements exponential backoff retry logic for transient failures.

BookmarksController delegates persistence between sessions by using the BookmarksRepository class that wraps IndexedDB with a clean, easy to use interface. The controller uses a separate array to store bookmarks for fast response in the interface.

CustomEvents are dispatched with `bubbles: true` and `composed: true` so they can cross Shadow DOM boundaries and be caught at, for example, the `jh-search-view` container level, which then delegates to the appropriate controller. Intermediate components like `jh-video-grid` may also listen for and re-dispatch events, while leaf components like `jh-video-card` are responsible only for dispatching; they have no knowledge of the controllers or the application state above them.
