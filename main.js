import { config } from "./src/config.js";
import { fetchWithRetry } from "./src/fetch-with-retry.js";

const mockModeMessage = config.useMock ? "MOCK MODE ON" : "MOCK MODE OFF";
document.getElementById("mock-mode").textContent = mockModeMessage;

const params = new URLSearchParams({
  part: "snippet",
  q: "javascript",
  order: "relevance",
  type: "video",
  maxResults: 12,
  key: config.apiKey,
});

try {
  const data = await fetchWithRetry(`${config.apiBaseUrl}/search?${params}`);
  console.log(data);
} catch (error) {
  console.error(error.message);
}

const tabs = document.querySelector("jh-tabs");
tabs.tabs = [
  { label: "Search Results", value: "search" },
  { label: "Bookmarks", value: "bookmarks" },
];

const videoCard = document.querySelector("jh-video-card");
videoCard.video = {
  videoId: "what",
  title: "hello there",
  description: "this is a description",
  thumbnail: "https://i.ytimg.com/vi/hHt3F5mL7Tc/mqdefault.jpg",
  commentCount: 123,
};

/*
document.getElementById("search-btn").addEventListener("click", async () => {
  const params = new URLSearchParams({
    part: "snippet",
    q: "javascript",
    order: "relevance",
    type: "video",
    maxResults: 12,
    key: config.apiKey,
  });

  const response = await fetch(`/api/youtube/search?${params}`);
  const data = await response.json();
  document.getElementById("output").textContent = JSON.stringify(data, null, 2);
  */
