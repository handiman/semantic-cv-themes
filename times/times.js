// The masthead's date line. It is added in the browser, so the HTML a theme renders stays the
// same on any day (#75), while the reader still sees today's date, like on a newspaper.
customElements.define(
  "semantic-cv-theme-times",
  class extends HTMLElement {
    connectedCallback() {
      const header = document.querySelector("main header");
      if (!header || header.querySelector(".dateline")) {
        return;
      }
      let grid = header.querySelector(".grid");
      if (!grid) {
        grid = document.createElement("div");
        grid.className = "grid";
        header.insertBefore(grid, header.querySelector(".hr"));
      }
      const now = new Date();
      const date = document.createElement("time");
      date.className = "dateline";
      date.dateTime = [
        now.getFullYear(),
        String(now.getMonth() + 1).padStart(2, "0"),
        String(now.getDate()).padStart(2, "0")
      ].join("-");
      date.textContent = now.toLocaleDateString();
      const cell = document.createElement("div");
      cell.append(date);
      grid.prepend(cell);
    }
  }
);
