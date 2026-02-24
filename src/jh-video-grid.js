import { LitElement, html, css, nothing } from "lit";
import "./jh-video-card.js";

export class JhVideoGrid extends LitElement {
  static styles = css`
    :host {
      overflow: visible;
    }

    #video-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1rem;
    }

    .container {
      background: var(--jh-surface);
      border-radius: 0 12px 12px 12px;
      box-sizing: border-box;
      padding: 1rem 0.75rem 0.75rem 0.75rem;
      overflow: visible;
    }

    .no-results {
      padding-left: 1.25rem;
    }

    button {
      display: block;
      margin: 0.75rem auto 0 auto;
      border-radius: 6px;
      min-width: 0;
      font-size: 1rem;
      background: var(--jh-accent);
      color: var(--jh-text-primary);
      padding: 0.4rem 1rem;
      flex-shrink: 0;
      border: 1px solid color-mix(in srgb, var(--jh-accent) 70%, white);
    }

    button:hover {
      background: color-mix(in srgb, var(--jh-accent) 80%, black);
      cursor: pointer;
    }

    button:active {
      background: color-mix(in srgb, var(--jh-accent) 60%, black);
    }

    button:focus {
      outline: 2px solid var(--jh-text-primary);
      outline-offset: 2px;
      box-shadow: 0 0 0 3px color-mix(in srgb, var(--jh-accent) 30%, transparent);
    }

    button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .skeleton-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1rem;
    }

    .skeleton-card {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      width: 100%;
      background: var(--jh-skeleton);
      border-radius: 4px;
      margin-bottom: 0.5rem;
      background: linear-gradient(90deg, var(--jh-skeleton) 25%, var(--jh-skeleton-highlight) 50%, var(--jh-skeleton) 75%);
      background-size: 200% 100%;
      animation: shimmer 1.5s infinite;
    }

    .skeleton-card > div {
      background: var(--jh-skeleton);
      border-radius: 4px;
    }

    .skeleton-thumbnail {
      padding-bottom: 56.25%; /* 9/16 (16:9 aspect ratio) * 100 */
    }

    .skeleton-title {
      width: 70%;
    }

    .skeleton-comment-count {
      width: 40%;
    }

    .skeleton-button {
      width: 80px;
    }

    .fixed-height {
      height: 1em;
    }

    .line-1 {
      width: 100%;
    }

    .line-2 {
      width: 70%;
    }

    .line-3 {
      width: 50%;
    }

    @keyframes shimmer {
      0% {
        background-position: 200% 0;
      }
      100% {
        background-position: -200% 0;
      }
    }
  `;

  static properties = {
    videos: { type: Array },
    allowSave: { type: Boolean },
    allowDelete: { type: Boolean },
    loading: { type: Boolean },
    bookmarkedIds: { type: Array },
    hasMore: { type: Boolean },
    loadingMore: { type: Boolean },
  };

  constructor() {
    super();
    this.videos = [];
    this.allowSave = false;
    this.allowDelete = false;
    this.loading = false;
    this.bookmarkedIds = [];
    this.hasMore = false;
    this.loadingMore = false;
  }

  #handleLoadMore() {
    this.dispatchEvent(
      new CustomEvent("load-more", {
        bubbles: true,
        composed: true,
      }),
    );
  }

  #renderSkeletonCard() {
    return html`
      <div class="container skeleton-card">
        <div class="skeleton-thumbnail"></div>
        <div class="skeleton-title fixed-height"></div>
        <div class="skeleton-desc-line line-1 fixed-height"></div>
        <div class="skeleton-desc-line line-2 fixed-height"></div>
        <div class="skeleton-desc-line line-3 fixed-height"></div>
        <div class="skeleton-comment-count fixed-height"></div>
        <div class="skeleton-button fixed-height"></div>
      </div>
    `;
  }

  render() {
    if (this.loading) {
      return html` <div class="skeleton-grid" aria-busy="true" aria-live="polite">
        ${Array.from({ length: 12 }, () => this.#renderSkeletonCard())}
      </div>`;
    }

    if (this.videos.length === 0) {
      return html` <div class="container no-results" role="status">No results</div>`;
    }

    return html`
      <div id="video-grid" class="container" aria-live="polite" aria-atomic="false" ?aria-busy=${this.loadingMore}>
        ${this.videos.map(
          (video) => html`
            <jh-video-card
              .video=${video}
              ?allowSave=${this.allowSave}
              ?allowDelete=${this.allowDelete}
              ?isBookmarked=${this.bookmarkedIds.includes(video.videoId)}
            ></jh-video-card>
          `,
        )}
      </div>
      ${this.loadingMore
        ? html` <div class="skeleton-grid">${Array.from({ length: 3 }, () => this.#renderSkeletonCard())}</div> `
        : nothing}
      ${this.hasMore
        ? html`
            <button
              id="load-more-button"
              type="button"
              ?disabled=${this.loadingMore}
              @click=${this.#handleLoadMore}
              aria-label="Load more results"
            >
              ${this.loadingMore ? "Loading..." : "Load More"}
            </button>
          `
        : nothing}
    `;
  }
}

customElements.define("jh-video-grid", JhVideoGrid);
