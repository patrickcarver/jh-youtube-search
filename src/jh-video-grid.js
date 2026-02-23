import { LitElement, html, css } from "lit";
import "./jh-video-card.js";

export class JhVideoGrid extends LitElement {
  static styles = css`
    .skeleton-card {
      width: 100%;
      height: 120px;
      background: #e0e0e0;
      border-radius: 4px;
      margin-bottom: 0.5rem;
      background: linear-gradient(90deg, #e0e0e0 25%, #f0f0f0 50%, #e0e0e0 75%);
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
      return html` ${Array.from({ length: 12 }, () => html`<div class="skeleton-card"></div>`)} `;
    }

    if (this.videos.length === 0) {
      return html` <div>No results</div>`;
    }

    return html`
      <div id="video-grid">
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
