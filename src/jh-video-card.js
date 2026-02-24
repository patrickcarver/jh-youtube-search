import { LitElement, html, css, nothing } from "lit";

export class JhVideoCard extends LitElement {
  static styles = css`
    :host {
      display: block;
      --jh-card-background: var(--theme-input-background, rgba(255, 255, 255, 0.1));
    }

    .container {
      background: var(--jh-card-background);
      border-radius: 12px;
      box-sizing: border-box;
      padding: 0.75rem;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    #thumbnail-holder img {
      width: 100%;
      height: auto;
      border-radius: 8px 8px 0 0;
    }

    #video-title {
      padding-left: 2px;
      margin-left: -2px;
    }

    #video-title a {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      line-height: 1.5;
      min-height: calc(2 * 1.5em);
      word-break: break-word;
      overflow-wrap: break-word;
      overflow: hidden;
    }

    #video-description {
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
      line-height: 1.5;
      min-height: calc(3 * 1.5em);
      word-break: break-word;
      overflow-wrap: break-word;
    }

    a {
      text-decoration: none;
    }

    a:link {
      color: var(--jh-accent);
    }

    a:visited {
      color: color-mix(in srgb, var(--jh-accent) 70%, black);
    }

    a:hover {
      color: var(--jh-text-primary);
      text-decoration: underline;
    }

    a:active {
      color: color-mix(in srgb, var(--jh-accent) 70%, white);
    }

    button {
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

    button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    a:focus,
    button:focus {
      outline: 2px solid var(--jh-text-primary);
      outline-offset: 2px;
      box-shadow: 0 0 0 3px color-mix(in srgb, var(--jh-focus-glow) 30%, transparent);
    }
  `;

  static properties = {
    video: { type: Object },
    allowSave: { type: Boolean },
    allowDelete: { type: Boolean },
    isBookmarked: { type: Boolean },
  };

  constructor() {
    super();
    this.video = null;
    this.allowSave = false;
    this.allowDelete = false;
    this.isBookmarked = false;
  }

  #handleSave(videoId) {
    this.dispatchEvent(
      new CustomEvent("video-saved", {
        detail: { videoId },
        bubbles: true,
        composed: true,
      }),
    );
  }

  #handleDelete(videoId) {
    this.dispatchEvent(
      new CustomEvent("video-deleted", {
        detail: { videoId },
        bubbles: true,
        composed: true,
      }),
    );
  }

  render() {
    if (!this.video) return nothing;

    return html` <div class="container">
      <div id="thumbnail-holder">
        <img src="${this.video.thumbnail}" alt="${this.video.title}" loading="lazy" decoding="async" width="320" height="180" />
      </div>
      <div id="video-title">
        <a href="https://www.youtube.com/watch?v=${this.video.videoId}" target="_blank" rel="noopener noreferrer">
          ${this.video.title}
        </a>
      </div>
      <div id="video-description">${this.video.description}</div>
      <div id="comment-count" aria-label="Comment count">
        ${this.video.commentCount != null ? `${this.video.commentCount} comments` : "Comments disabled"}
      </div>
      ${this.allowSave
        ? html`
            <div id="save-to-bookmarks">
              <button
                ?disabled=${this.isBookmarked}
                aria-disabled=${this.isBookmarked}
                @click="${() => this.#handleSave(this.video.videoId)}"
                type="button"
                id="save-button"
                name="save-button"
              >
                ${this.isBookmarked ? "Saved" : "Save"}
              </button>
            </div>
          `
        : nothing}
      ${this.allowDelete
        ? html` <div id="delete-from-bookmarks">
            <button
              @click="${() => this.#handleDelete(this.video.videoId)}"
              type="button"
              id="delete-button"
              name="delete-button"
            >
              Delete
            </button>
          </div>`
        : nothing}
    </div>`;
  }
}

customElements.define("jh-video-card", JhVideoCard);
