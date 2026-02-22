export class BookmarksRepository {
  #db = null;

  constructor() {
    this.#db = this.#openDatabase();
  }

  // open our indexedDB database
  #openDatabase() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open("jh-youtube-search", 1);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains("bookmarks")) {
          db.createObjectStore("bookmarks", { keyPath: "videoId" });
        }
      };
    });
  }

  #getStore(db, mode) {
    const transaction = db.transaction("bookmarks", mode);
    return transaction.objectStore("bookmarks");
  }

  #promisifyRequest(request) {
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  // get all the bookmarks
  async getAll() {
    const db = await this.#db;
    const store = this.#getStore(db, "readonly");
    return this.#promisifyRequest(store.getAll());
  }

  // add a bookmark
  async save(video) {
    const db = await this.#db;
    const store = this.#getStore(db, "readwrite");
    return this.#promisifyRequest(store.put(video));
  }

  // delete a bookmark
  async delete(videoId) {
    const db = await this.#db;
    const store = this.#getStore(db, "readwrite");
    return this.#promisifyRequest(store.delete(videoId));
  }

  // delete all bookmarks
  async clearAll() {
    const db = await this.#db;
    const store = this.#getStore(db, "readwrite");
    return this.#promisifyRequest(store.clear());
  }
}
