import { LitElement, html, css, nothing } from "lit";

export class JhVideoCard extends LitElement {
  static styles = css`
    :host {
      display: block;
    }

    .container {
    }

    div {
      display: flex;
      flex-direction: row;
      padding: 0.5rem;
      border: 1px solid #ccc;
      margin-bottom: 0.5rem;
    }

    #thumbnail-holder {
      flex-shrink: 0;
    }

    #video-title,
    #video-description,
    #comment-count {
      flex: 1;
    }
  `;

  static properties = {
    video: { type: Object },
    allowSave: { type: Boolean },
    allowDelete: { type: Boolean },
  };

  constructor() {
    super();
    this.video = null;
    this.allowSave = false;
    this.allowDelete = false;
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

    return html` <div class=".container">
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
              <button @click="${() => this.#handleSave(this.video.videoId)}" type="button" id="save-button" name="save-button">
                Save
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
