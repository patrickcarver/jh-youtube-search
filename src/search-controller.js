import { fetchWithRetry } from "./fetch-with-retry.js";
import { toVideoModel } from "./video-model.js";
import { config } from "./config.js";

export class SearchController {
  #host = null;
  #results = [];
  #loading = false;
  #error = null;
  #maxResults = 12;
  #nextPageToken = null;
  #query = null;
  #order = null;
  #loadingMore = false;

  constructor(host) {
    this.#host = host;
    host.addController(this);
  }

  get loadingMore() {
    return this.#loadingMore;
  }

  get hasMore() {
    return this.#nextPageToken !== null;
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

  findVideo(videoId) {
    return this.#results.find((v) => v.videoId === videoId);
  }

  async #fetchVideos(query, order, maxResults, pageToken = null) {
    const videoParams = new URLSearchParams({
      part: "snippet",
      q: query,
      order: order,
      type: "video",
      maxResults: maxResults,
      key: config.apiKey,
    });

    if (pageToken) {
      videoParams.append("pageToken", pageToken);
    }

    const videoList = await fetchWithRetry(`${config.apiBaseUrl}/search?${videoParams}`);
    return {
      items: videoList.items,
      nextPageToken: videoList.nextPageToken ?? null,
    };
  }

  async #fetchStats(videoIds) {
    const statsParams = new URLSearchParams({
      part: "statistics",
      id: videoIds,
      key: config.apiKey,
    });

    const statsList = await fetchWithRetry(`${config.apiBaseUrl}/videos?${statsParams}`);
    return statsList.items;
  }

  async search(query, order) {
    try {
      this.#query = query;
      this.#order = order;
      this.#nextPageToken = null;
      this.#loading = true;
      this.#error = null;
      this.#host.requestUpdate();

      const { items: videoItems, nextPageToken } = await this.#fetchVideos(
        this.#query,
        this.#order,
        this.#maxResults,
        this.#nextPageToken,
      );

      this.#nextPageToken = nextPageToken;

      const videoIds = videoItems.map((item) => item.id.videoId).join(",");

      const statsItems = await this.#fetchStats(videoIds);

      this.#results = videoItems.map((videoItem) => {
        const statItem = statsItems.find((si) => si.id === videoItem.id.videoId);
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

  async loadMore() {
    try {
      this.#loadingMore = true;
      this.#host.requestUpdate();

      const { items: videoItems, nextPageToken } = await this.#fetchVideos(
        this.#query,
        this.#order,
        this.#maxResults,
        this.#nextPageToken,
      );

      this.#nextPageToken = nextPageToken;

      const videoIds = videoItems.map((item) => item.id.videoId).join(",");

      const statsItems = await this.#fetchStats(videoIds);

      const moreResults = videoItems.map((videoItem) => {
        const statItem = statsItems.find((si) => si.id === videoItem.id.videoId);
        return toVideoModel(videoItem, statItem);
      });

      this.#results = this.#results.concat(moreResults);

      this.#loadingMore = false;
      this.#host.requestUpdate();
    } catch (error) {
      this.#error = error.message;
      this.#loadingMore = false;
      this.#host.requestUpdate();
    }
  }
}
