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

  add(video) {
    if (this.#bookmarks.some((b) => b.videoId === video.videoId)) return;
    this.#bookmarks.push(video);
    this.#repository.save(video);
    this.#host.requestUpdate();
  }

  remove(videoId) {
    this.#bookmarks.splice(
      this.#bookmarks.findIndex((bookmark) => bookmark.videoId === videoId),
      1,
    );
    this.#repository.delete(videoId);
    this.#host.requestUpdate();
  }

  clearAll() {
    this.#bookmarks = [];
    this.#repository.clearAll();
    this.#host.requestUpdate();
  }
}
