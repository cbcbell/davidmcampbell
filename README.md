# David Campbell

A static Astro site for David Campbell's paintings, watercolors, portraits, prints, sculptures, and biography.

## Run the site

```sh
bun install
bun run dev
```

`bun run build` generates the seven static pages in `dist/`. `bun run check` checks the Astro and TypeScript files.

The galleries discover images in `content/Paintings/`, `content/Watercolors/`, `content/Portraits/`, `content/Prints/`, and `content/Sculptures/`. The [gallery loader](src/lib/gallery.ts) reads `XPTitle` and `ImageDescription` from each image with `exifr`. Astro generates smaller thumbnails while the lightbox uses the full-size images, rendered with ramka. The About page renders `content/About.md` and its local images through Astro assets. The font, Timeless Serif, comes from `src/fonts/`. The gallery controls use local SVG icons. Styling uses Tailwind CSS.
