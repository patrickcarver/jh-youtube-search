const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;

document.getElementById("search-btn").addEventListener("click", async () => {
  const params = new URLSearchParams({
    part: "snippet",
    q: "javascript",
    order: "relevance",
    type: "video",
    maxResults: 12,
    key: API_KEY,
  });

  const response = await fetch(`/api/youtube/search?${params}`);
  const data = await response.json();
  document.getElementById("output").textContent = JSON.stringify(data, null, 2);
});
