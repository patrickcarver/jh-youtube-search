const STATIC_VIDEOS = [
  { videoId: "abc123", title: "JavaScript Tutorial for Beginners" },
  { videoId: "def456", title: "Lit Web Components Deep Dive" },
  { videoId: "ghi789", title: "CSS Grid Layout Mastery" },
  { videoId: "jkl012", title: "IndexedDB for Beginners" },
  { videoId: "mno345", title: "Web Performance on Mobile Devices" },
];

const ERROR_MESSAGES = {
  400: {
    code: 400,
    status: "BAD_REQUEST",
    message: "Invalid request",
  },
  403: {
    code: 403,
    status: "PERMISSION_DENIED",
    message: "API quota exceeded",
  },
  404: {
    code: 404,
    status: "NOT_FOUND",
    message: "Resource not found",
  },
  500: {
    code: 500,
    status: "INTERNAL_ERROR",
    message: "Internal server error",
  },
  502: {
    code: 502,
    status: "BAD_GATEWAY",
    message: "Bad gateway",
  },
  503: {
    code: 503,
    status: "SERVICE_UNAVAILABLE",
    message: "Service unavailable",
  },
};

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateErrorResponse(code) {
  const error = ERROR_MESSAGES[code] ?? ERROR_MESSAGES[500];
  return {
    error: {
      code: error.code,
      status: error.status,
      message: error.message,
      errors: [
        {
          message: error.message,
          domain: "youtube.quota",
          reason: error.status,
        },
      ],
    },
  };
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

export function youtubeMockPlugin(env) {
  const useMock = env.VITE_USE_MOCK === "true";
  const useError = env.VITE_MOCK_ERROR === "true";
  const errorCode = parseInt(env.VITE_MOCK_ERROR_CODE ?? "500");
  const errorRate = parseFloat(env.VITE_MOCK_ERROR_RATE ?? "0.3");

  return {
    name: "youtube-mock-plugin",
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (!useMock) return next();

        const isYoutubeRequest =
          req.url.startsWith("/api/youtube/search") ||
          req.url.startsWith("/api/youtube/videos");

        if (!isYoutubeRequest) return next();

        // simulate error based on error rate
        if (useError && Math.random() < errorRate) {
          res.setHeader("Content-Type", "application/json");
          res.statusCode = errorCode;
          res.end(JSON.stringify(generateErrorResponse(errorCode)));
          return;
        }

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
