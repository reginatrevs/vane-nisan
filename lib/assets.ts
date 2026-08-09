/**
 * ============================================================
 *  ASSET MANIFEST
 *
 *  Files live in /public/assets/ under exactly these names.
 *  If one is missing the site still renders — AssetImage swaps
 *  in a drawn stand-in instead of showing a broken image.
 *
 *  `width`/`height` are the file's real pixel dimensions. They
 *  let next/image reserve space (no layout shift) and generate
 *  the right responsive sizes. Re-export at a new size → update
 *  the numbers here too.
 * ============================================================
 */

export type Asset = {
  src: string;
  width: number;
  height: number;
};

export const assets = {
  /**
   * Marbled band + white botanical arch that caps the page.
   * Runs edge to edge.
   * → /public/assets/top-website.png
   */
  topBand: {
    src: "/assets/top-website.png",
    width: 3000,
    height: 1248,
  },

  /**
   * "Vanessa & Sami" calligraphy. This is the page's real title,
   * so it carries the alt text.
   * → /public/assets/names.png
   */
  names: {
    src: "/assets/names.png",
    width: 1425,
    height: 1238,
  },

  /**
   * The couple's photos.
   * → /public/assets/photos.png
   */
  photos: {
    src: "/assets/photos.png",
    width: 1597,
    height: 1047,
  },

  /**
   * The typeset date ("26·08·2026") as artwork.
   * → /public/assets/date.png
   */
  date: {
    src: "/assets/date.png",
    width: 1001,
    height: 339,
  },

  /**
   * Mirrored botanical band that closes the page, edge to edge.
   * → /public/assets/footer-website.png
   */
  footer: {
    src: "/assets/footer-website.png",
    width: 1945,
    height: 673,
  },
} as const satisfies Record<string, Asset>;

export type AssetKey = keyof typeof assets;
