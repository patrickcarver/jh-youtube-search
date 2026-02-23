import { LitElement, html, css, nothing } from "lit";
import { SearchController } from "./search-controller.js";
import { BookmarksController } from "./bookmarks-controller.js";

import "./jh-search-input.js";
import "./jh-tabs.js";
import "./jh-video-grid.js";

export class JhSearchView extends LitElement {
  static styles = css`
    :host {
      --jh-background: var(--theme-background, #cddce3); /* baby blue */
      --jh-surface: var(--theme-surface, #0a4b39);
      --jh-text-primary: var(--theme-text-primary, #14181a); /* ebony */
      --jh-accent: var(--theme-accent, #319905); /* green */
      font-family:
        system-ui,
        -apple-system,
        sans-serif;
      font-size: 1.2rem;
      color: var(--jh-text-primary);
    }

    .container {
      background: var(--jh-background);
      padding: 0.75rem;
      border-radius: 12px;
      min-height: 100vh;
      max-width: 1200px;
      margin: 0 auto;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }
  `;

  #activeTab = "search";
  #tabs = [
    { label: "Search Results", value: "search" },
    { label: "Bookmarks", value: "bookmarks" },
  ];

  #searchController = new SearchController(this);
  #bookmarksController = new BookmarksController(this);

  #handleSearchRequested(event) {
    const { searchText, sortOrder } = event.detail;
    this.#searchController.search(searchText, sortOrder);
  }

  #handleTabChanged(event) {
    this.#activeTab = event.detail.tabValue;
    this.requestUpdate();
  }

  #handleVideoSaved(event) {
    const { videoId } = event.detail;
    const video = this.#searchController.findVideo(videoId);
    if (video) this.#bookmarksController.add(video);
  }

  #handleVideoDeleted(event) {
    const { videoId } = event.detail;
    this.#bookmarksController.remove(videoId);
  }

  render() {
    return html`
      <div
        class="container"
        @search-requested=${this.#handleSearchRequested}
        @tab-changed=${this.#handleTabChanged}
        @video-saved=${this.#handleVideoSaved}
        @video-deleted=${this.#handleVideoDeleted}
      >
        <jh-search-input ?hasResults=${this.#searchController.results.length > 0}></jh-search-input>
        <jh-tabs .tabs=${this.#tabs}></jh-tabs>

        ${this.#activeTab === "search"
          ? html` <jh-video-grid
              .videos=${this.#searchController.results}
              allowSave
              ?loading=${this.#searchController.loading}
            ></jh-video-grid>`
          : nothing}
        ${this.#activeTab === "bookmarks"
          ? html` <jh-video-grid .videos=${this.#bookmarksController.bookmarks} allowDelete></jh-video-grid>`
          : nothing}
      </div>
    `;
  }
}

customElements.define("jh-search-view", JhSearchView);
