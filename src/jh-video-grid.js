import { LitElement, html, css } from "lit";
import { JhVideoCard } from "./jh-video-card.js";

export class JhVideoGrid extends LitElement {
  static properties = {
    videos: { type: Array },
    allowSave: { type: Boolean },
    allowDelete: { type: Boolean },
    view: { type: String },
    loading: { type: Boolean },
  };

  constructor() {
    super();
  }

  render() {
    return html`
      <div id="video-grid">${this.videos.map((video) => html``)}</div>
    `;
  }
}

customElements.define("jh-video-grid", JhVideoGrid);
