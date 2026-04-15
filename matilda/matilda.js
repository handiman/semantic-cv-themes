customElements.define(
  "semantic-cv-theme-matilda",
  class extends HTMLElement {
    constructor() {
      super();
    }
    updateAsideRight() {
      const aside = document.querySelector("aside");
      const right = aside.getBoundingClientRect().right;
      document.documentElement.style.setProperty("--aside-right", `${right}px`);
    }
    connectedCallback() {
      this._onWindowResize = () => this.updateAsideRight();
      window.addEventListener("resize", this._onWindowResize);

      this._resizeObserver = new ResizeObserver(() => {
        this.updateAsideRight();
      });

      const aside = document.querySelector("aside");
      this._resizeObserver.observe(aside);
      this.updateAsideRight();
    }
    disconnectedCallback() {
      window.removeEventListener("resize", this._onWindowResize);
      this._resizeObserver.disconnect();
    }
  }
);
