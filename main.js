import { config } from "./config.js";

const mockModeMessage = config.useMock ? "MOCK MODE ON" : "MOCK MODE OFF";
document.getElementById("mock-mode").textContent = mockModeMessage;

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
});
