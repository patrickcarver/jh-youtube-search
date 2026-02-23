import { LitElement, html, css } from "lit";

export class JhSearchInput extends LitElement {
  static styles = css`
    :host {
      --jh-focus-glow: var(--theme-accent, #319905);
      --jh-input-background: var(
        --theme-input-background,
        rgba(255, 255, 255, 0.1)
      );
    }

    .container {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      flex-wrap: wrap;
      padding: 0.75rem;
      border-radius: 12px;
      margin: 0 auto;
      box-sizing: border-box;
      background: var(--jh-surface);
      border: 2px solid var(--jh-accent);
    }

    #search-text {
      flex: 1;
      min-width: 200px;
      max-width: 300px;
    }

    #sort-order,
    #search-text,
    #search-button {
      border-radius: 6px;
    }

    #sort-order,
    #search-text {
      font-size: 1rem;
      background: var(--jh-input-background);
      color: var(--jh-text-primary);
      border: 1px solid var(--jh-accent);
      padding: 0.4rem 0.5rem;
    }

    #sort-order:focus,
    #search-text:focus {
      outline: none;
      border-color: var(--jh-accent);
      box-shadow: 0 0 0 3px
        color-mix(in srgb, var(--jh-focus-glow) 30%, transparent);
    }

    #search-button {
      font-size: 1rem;
      background: var(--jh-accent);
      color: var(--jh-text-primary);
      padding: 0.4rem 1rem;
    }

    #search-button:hover {
      background: color-mix(in srgb, var(--jh-accent) 80%, black);
      cursor: pointer;
    }

    #search-button:active {
      background: color-mix(in srgb, var(--jh-accent) 60%, black);
    }

    #search-button:focus {
      outline: none;
      box-shadow: 0 0 0 3px
        color-mix(in srgb, var(--jh-focus-glow) 30%, transparent);
    }
  `;

  static properties = {
    hasResults: { type: Boolean },
  };

  constructor() {
    super();
    this.hasResults = false;
  }

  #getSearchText() {
    return this.shadowRoot.querySelector("#search-text").value.trim();
  }

  #getSortOrder() {
    return this.shadowRoot.querySelector("#sort-order").value;
  }

  #fireSearchEvent() {
    const searchTextValue = this.#getSearchText();
    if (searchTextValue === "") return;

    const sortOrderValue = this.#getSortOrder();

    this.dispatchEvent(
      new CustomEvent("search-requested", {
        detail: {
          searchText: searchTextValue,
          sortOrder: sortOrderValue,
        },
        bubbles: true,
        composed: true,
      }),
    );
  }

  #handleSearch() {
    this.#fireSearchEvent();
  }

  #handleKeyDown(event) {
    if (event.key !== "Enter") return;
    event.preventDefault(); // Prevents "Enter" from causing mischief in some browsers.

    this.#fireSearchEvent();
  }

  #handleSortChange() {
    if (!this.hasResults) return;

    this.#fireSearchEvent();
  }

  render() {
    return html` <div class="container">
      <label for="search-text">Search</label>
      <input
        @keydown="${this.#handleKeyDown}"
        type="text"
        id="search-text"
        name="search-text"
        autocomplete="off"
      />
      <label for="sort-order">Sort by</label>
      <select
        @change="${this.#handleSortChange}"
        id="sort-order"
        name="sort-order"
      >
        <option value="relevance" selected>Relevance</option>
        <option value="date">Newest First</option>
        <option value="rating">Rating</option>
      </select>
      <button @click="${this.#handleSearch}" type="button" id="search-button">
        Search
      </button>
    </div>`;
  }
}

customElements.define("jh-search-input", JhSearchInput);
