# Original artwork exports

Untouched exports straight from Figma. Kept out of `public/` so Next.js never
tries to serve or optimize them.

`public/assets/` holds downscaled copies. The originals were 10–11 MB and
14–18 megapixels, which made the Next.js image optimizer time out (>200s for a
single width) and would have blown past Vercel's transform limits.

Current downscales:

| file               | original    | served      |
| ------------------ | ----------- | ----------- |
| top-website.png    | 5826 × 2424 | 3000 × 1248 |
| photos.png         | 4422 × 4053 | 1800 × 1649 |

The served sizes are still ~2x the largest size either image is ever displayed
at, so there is no visible quality loss.

To regenerate after a re-export, drop the new file here and run:

    sips --resampleWidth 3000 top-website.png --out ../public/assets/top-website.png
    sips --resampleWidth 1800 photos.png      --out ../public/assets/photos.png

Then update the pixel dimensions in `lib/assets.ts` to match.
