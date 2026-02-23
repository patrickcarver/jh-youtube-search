import { LitElement, html, css } from "lit";

export class JhTabs extends LitElement {
  static properties = {
    tabs: { type: Array },
    activeTab: { type: String },
  };

  constructor() {
    super();
    this.tabs = [];
    this.activeTab = "";
  }

  willUpdate(changedProperties) {
    if (this.tabs.length === 0) return;
    if (!changedProperties.has("tabs")) return;
    if (this.activeTab) return;

    this.activeTab = this.tabs[0].value;
  }

  async #handleTabKeyDown(event) {
    const currentIndex = this.tabs.findIndex(
      (tab) => tab.value === this.activeTab,
    );
    let newIndex = null;

    switch (event.key) {
      case "ArrowRight":
        event.preventDefault();
        newIndex = (currentIndex + 1) % this.tabs.length;
        break;
      case "ArrowLeft":
        event.preventDefault();
        newIndex = (currentIndex - 1 + this.tabs.length) % this.tabs.length;
        break;
      case "Home":
        event.preventDefault();
        newIndex = 0;
        break;
      case "End":
        event.preventDefault();
        newIndex = this.tabs.length - 1;
        break;
      default:
        return; // Ignore all other keys.
    }

    this.#handleButtonClick(this.tabs[newIndex].value);
    await this.updateComplete;
    this.shadowRoot.querySelector(`#tab-${this.tabs[newIndex].value}`).focus();
  }

  #handleButtonClick(tabValue) {
    this.activeTab = tabValue;
    this.dispatchEvent(
      new CustomEvent("tab-changed", {
        detail: {
          tabValue,
        },
        bubbles: true,
        composed: true,
      }),
    );
  }

  render() {
    return html`
      <div
        @keydown="${this.#handleTabKeyDown}"
        role="tablist"
        aria-label="Content tabs"
      >
        ${this.tabs.map(
          (tab) => html`
            <button
              @click="${() => this.#handleButtonClick(tab.value)}"
              id="tab-${tab.value}"
              role="tab"
              aria-selected="${tab.value === this.activeTab}"
              tabindex="${tab.value === this.activeTab ? 0 : -1}"
            >
              ${tab.label}
            </button>
          `,
        )}
      </div>
    `;
  }
}

customElements.define("jh-tabs", JhTabs);
