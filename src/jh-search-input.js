import { LitElement, html, css } from "lit";

export class JhSearchInput extends LitElement {
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
    return html` <div>
      <label for="search-text">Search</label>
      <input
        @keydown="${this.#handleKeyDown}"
        type="text"
        id="search-text"
        name="search-text"
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
