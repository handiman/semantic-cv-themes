/**
 * Runtime‑neutral HTML rewriting interface used by both the CLI (WASM)
 * and the Cloudflare Worker (native HTMLRewriter).
 *
 * A transformer registers element hooks using CSS‑like selectors and
 * then rewrites a provided HTML string according to those hooks.
 *
 * Implementations must:
 * - support chaining of `.on()` calls
 * - apply hooks in document order
 * - return a Promise resolving to the fully rewritten HTML
 */
export interface HTMLTransformer {
  /**
   * Apply all registered rewrite hooks to the given HTML string.
   *
   * @param html The HTML document to rewrite. Typically the deterministic
   *             Semantic‑CV skeleton produced by the rendering pipeline.
   * @returns Promise resolving to the rewritten HTML.
   */ transform(html: string): Promise<string>;

  /**
   * Register a rewrite hook for a given selector.
   *
   * @param selector CSS‑like selector identifying which elements to match.
   *                 Selector support depends on the underlying runtime
   *                 (Cloudflare HTMLRewriter or html‑rewriter‑wasm).
   * @param hooks Object containing element‑level callbacks. Only the
   *              `element` hook is currently used by Semantic‑CV.
   * @returns The transformer instance, enabling chained `.on()` calls.
   */
   on(
    selector: string,
    hooks: {
      element: (el: any) => void;
    }
  ): HTMLTransformer;
}

export default HTMLTransformer;
