import { LitElement, html, css } from "lit";
import "./jh-search-input.js";
import "./jh-tabs.js";

export class JhSearchView extends LitElement {
  constructor() {
    super();
  }

  render() {
    return html`
      <div>
        <jh-search-input></jh-search-input>
      </div>
    `;
  }
}

customElements.define("jh-search-view", JhSearchView);
