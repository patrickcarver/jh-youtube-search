import { LitElement, html, css } from "lit";
import "./jh-video-card.js";

export class JhVideoGrid extends LitElement {
  static styles = css`
    #video-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1rem;
    }

    .container {
      background: var(--jh-surface);
      border-radius: 0 12px 12px 12px;
      box-sizing: border-box;
      padding: 0.75rem;
    }

    .no-results {
      padding-left: 1.25rem;
    }

    .skeleton-card {
      width: 100%;
      height: 120px;
      background: var(--jh-skeleton);
      border-radius: 4px;
      margin-bottom: 0.5rem;
      background: linear-gradient(90deg, var(--jh-skeleton) 25%, var(--jh-skeleton-highlight) 50%, var(--jh-skeleton) 75%);
      background-size: 200% 100%;
      animation: shimmer 1.5s infinite;
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
    view: { type: String },
    loading: { type: Boolean },
  };

  constructor() {
    super();
    this.videos = [];
    this.allowSave = false;
    this.allowDelete = false;
    this.view = "grid";
    this.loading = false;
  }

  render() {
    if (this.loading) {
      return html` <div aria-busy="true" aria-live="polite">
        ${Array.from({ length: 12 }, () => html`<div class="container skeleton-card"></div>`)}
      </div>`;
    }

    if (this.videos.length === 0) {
      return html` <div class="container no-results" role="status">No results</div>`;
    }

    return html`
      <div id="video-grid" class="container">
        ${this.videos.map(
          (video) => html`
            <jh-video-card .video=${video} ?allowSave=${this.allowSave} ?allowDelete=${this.allowDelete}></jh-video-card>
          `,
        )}
      </div>
    `;
  }
}

customElements.define("jh-video-grid", JhVideoGrid);
