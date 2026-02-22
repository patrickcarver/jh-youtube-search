export const config = {
  apiKey: import.meta.env.VITE_YOUTUBE_API_KEY,
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL,
  useMock: import.meta.env.VITE_USE_MOCK === "true",
};
