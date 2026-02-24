import { BookmarksRepository } from "./bookmarks-repository.js";

export class BookmarksController {
  #host = null;
  #bookmarks = [];
  #repository = null;

  constructor(host) {
    this.#host = host;
    host.addController(this);
  }

  async hostConnected() {
    this.#repository = new BookmarksRepository();
    this.#bookmarks = await this.#repository.getAll();
    this.#host.requestUpdate();
  }

  get bookmarks() {
    return this.#bookmarks;
  }

  get bookmarkedVideoIds() {
    return this.bookmarks.map((b) => b.videoId);
  }

  add(video) {
    if (this.#bookmarks.some((b) => b.videoId === video.videoId)) return;
    this.#bookmarks.push(video);
    this.#repository.save(video);
    this.#host.requestUpdate();
  }

  remove(videoId) {
    this.#bookmarks = this.#bookmarks.filter((b) => b.videoId !== videoId);
    this.#repository.delete(videoId);
    this.#host.requestUpdate();
  }

  clearAll() {
    this.#bookmarks = [];
    this.#repository.clearAll();
    this.#host.requestUpdate();
  }
}
