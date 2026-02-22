import { fetchWithRetry } from "./fetch-with-retry.js";
import { toVideoModel } from "./video-model.js";
import { config } from "./config.js";

export class SearchController {
  #host = null;
  #results = [];
  #loading = false;
  #error = null;
  #maxResults = 12;

  constructor(host) {
    this.#host = host;
    host.addController(this);
  }

  get results() {
    return this.#results;
  }

  get loading() {
    return this.#loading;
  }

  get error() {
    return this.#error;
  }

  async #fetchVideos(query, order, maxResults) {
    const videoParams = new URLSearchParams({
      part: "snippet",
      q: query,
      order: order,
      type: "video",
      maxResults: maxResults,
      key: config.apiKey,
    });

    const videoList = await fetchWithRetry(
      `${config.apiBaseUrl}/search?${videoParams}`,
    );
    return videoList.items;
  }

  async #fetchStats(videoIds) {
    const statsParams = new URLSearchParams({
      part: "statistics",
      id: videoIds,
      key: config.apiKey,
    });

    const statsList = await fetchWithRetry(
      `${config.apiBaseUrl}/videos?${statsParams}`,
    );
    return statsList.items;
  }

  async search(query, order) {
    try {
      this.#loading = true;
      this.#error = null;
      this.#host.requestUpdate();

      const videoItems = await this.#fetchVideos(
        query,
        order,
        this.#maxResults,
      );
      const videoIds = videoItems.map((item) => item.id.videoId).join(",");

      const statsItems = await this.#fetchStats(videoIds);

      this.#results = videoItems.map((videoItem) => {
        const statItem = statsItems.find(
          (si) => si.id === videoItem.id.videoId,
        );
        return toVideoModel(videoItem, statItem);
      });

      this.#loading = false;
      this.#host.requestUpdate();
    } catch (error) {
      this.#error = error.message;
      this.#loading = false;
      this.#host.requestUpdate();
    }
  }
}
