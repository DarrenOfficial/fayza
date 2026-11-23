# sorrowflux.com: shattered poise,

Astro static site for Fayza Divanti's writing. Terms are defined in [GLOSSARY.md](./GLOSSARY.md).

```sh
npm install
npm run dev      # http://localhost:4321
npm run build    # → dist/
```

## Content
Each Piece lives in `src/content/pieces/<slug>/index.md` with its `cover.*` beside it.
The 21 Pieces were imported once from Substack (Nov 2026). To add a new Piece, make a folder, copy the frontmatter of an existing one, give it the next `no`, and pick a `shelf`: `tender-things`, `against-the-grain` or `songs-and-tributes`.
Pull-quotes, links and Shelf names are in `src/data/site.ts`.

## Design pieces
- Fonts: Caveat (handwriting), Cormorant Garamond (reading), JetBrains Mono (labels), all loaded from Bunny Fonts (fonts.bunny.net).
- Palette: aged ivory paper, moss ink, sage, dusty rose (tokens at the top of `src/styles/global.css`).
- Lace hem, lace trim, paper moths, the hero's wavy frame (`src/lib/wave.ts`), scrollwork corners and fine-pen twigs are code-drawn SVG components in `src/components/`.
- Home hero: John Everett Millais, *Ophelia* (1851–52, public domain, via Wikimedia Commons), in `src/assets/art/`.
- Paper handwriting: Emily Dickinson's "Wild nights" autograph manuscript (1861, public domain), as faint textures in `public/textures/`.
- About page: Pinyon Script (the ghost script behind everything), from Bunny Fonts.
- Calla lilies (`src/assets/lilies/`) are cut from Abraham Bosse's *Calla Aethiopica* engraving (1640, public domain, via Wikimedia Commons), printed in moss ink.

## Deploy (Cloudflare Pages)
Framework preset: Astro · build command `npm run build` · output `dist` · then add the custom domain sorrowflux.com.
