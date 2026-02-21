const STATIC_VIDEOS = [
  { videoId: "abc123", title: "JavaScript Tutorial for Beginners" },
  { videoId: "def456", title: "Lit Web Components Deep Dive" },
  { videoId: "ghi789", title: "CSS Grid Layout Mastery" },
  { videoId: "jkl012", title: "IndexedDB for Beginners" },
  { videoId: "mno345", title: "Web Performance on Mobile Devices" },
];

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateMockSearchResponse(query, order) {
  const items = STATIC_VIDEOS.map((video) => ({
    kind: "youtube#searchResult",
    etag: `mock_etag_${video.videoId}`,
    id: {
      kind: "video",
      videoId: video.videoId,
    },
    snippet: {
      publishedAt: new Date(
        Date.now() - randomInt(0, 30) * 24 * 60 * 60 * 1000,
      ).toISOString(),
      channelId: `mock_channel_${video.videoId}`,
      title: video.title,
      description: `This is a mock description for "${video.title}". Query was: ${query}`,
      thumbnails: {
        default: {
          url: `https://picsum.photos/seed/${video.videoId}/120/90`,
          width: 120,
          height: 90,
        },
        medium: {
          url: `https://picsum.photos/seed/${video.videoId}/320/180`,
          width: 320,
          height: 180,
        },
        high: {
          url: `https://picsum.photos/seed/${video.videoId}/480/360`,
          width: 480,
          height: 360,
        },
      },
      channelTitle: `Mock Channel ${video.videoId}`,
      liveBroadcastContent: "none",
    },
  }));

  return {
    kind: "youtube#searchListResponse",
    etag: "mock_search_etag",
    pageInfo: {
      totalResults: STATIC_VIDEOS.length,
      resultsPerPage: 12,
    },
    items,
  };
}

function generateMockStatsResponse(ids) {
  const items = ids.split(",").map((id) => ({
    kind: "youtube#video",
    etag: `mock_etag_${id}`,
    id,
    statistics: {
      viewCount: String(randomInt(1000, 1000000)),
      likeCount: String(randomInt(100, 50000)),
      favoriteCount: "0",
      commentCount:
        Math.random() > 0.1 ? String(randomInt(0, 50000)) : undefined,
    },
  }));

  return {
    kind: "youtube#videoListResponse",
    etag: "mock_stats_etag",
    items,
  };
}

export function youtubeMockPlugin() {
  return {
    name: "youtube-mock-plugin",
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (!process.env.VITE_USE_MOCK) return next();

        if (req.url.startsWith("/api/youtube/search")) {
          const url = new URL(req.url, "http://localhost");
          const query = url.searchParams.get("q") ?? "";
          const order = url.searchParams.get("order") ?? "relevance";

          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify(generateMockSearchResponse(query, order)));
          return;
        }

        if (req.url.startsWith("/api/youtube/videos")) {
          const url = new URL(req.url, "http://localhost");
          const ids = url.searchParams.get("id") ?? "";

          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify(generateMockStatsResponse(ids)));
          return;
        }

        next();
      });
    },
  };
}
