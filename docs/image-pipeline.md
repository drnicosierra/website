# Image optimization pattern (astro:assets)

Established July 2026 while converting the homepage + 8 service pages from raw
Unsplash `<img>` tags to build-time optimized WebP. Applies to any future page
that adds images (e.g. `vidas-transformadas`, `blog-y-articulos`) once its
design is finalized — reuse this instead of re-deriving it.

## Why this pattern exists (not just `<Image />`)

Most Astro guides say "use the `<Image />` component." That doesn't work here:
almost every page body is wrapped in `<Fragment set:html={\`...\`}>` — one big
raw HTML string. `<Image />` is a component that the Astro compiler needs to
see directly in the template; it can't be dropped inside a JS string literal.

The workaround: call `getImage()` in the frontmatter (runs at build time,
does the real Sharp/WebP work) and interpolate the resulting `.src` into the
HTML string with `${variableName.src}`.

## Steps

1. **Allow-list the image host once**, in `astro.config.mjs` (already done for
   `images.unsplash.com` — add others here if a new source is introduced):
   ```js
   image: {
     domains: ['images.unsplash.com']
   }
   ```

2. **In the page's frontmatter**, import and call `getImage()`:
   ```js
   import { getImage } from 'astro:assets';

   const myImage = await getImage({
     src: 'https://images.unsplash.com/photo-XXXX?w=1200&h=800&q=80&fit=crop',
     width: 1200,
     height: 800,
     format: 'webp'
   });
   ```
   - Always pass explicit `width` **and** `height` — remote images require
     both, and `inferSize` costs an extra network round-trip for no benefit
     here.
   - Match `w`/`h` in the URL to the `width`/`height` options (keeps the
     fetched source and the requested output in sync).

3. **Check the CSS before worrying about exact aspect ratio.** If the image's
   container uses `object-fit: cover`, the exact `width`/`height` you pass
   barely matters visually — CSS crops it regardless. If it's not `cover`
   (rare on this site so far), match the real aspect ratio or the image will
   look stretched/squashed.
   - Face-cropped portraits (doctor photo, gallery thumbnails) keep
     `&crop=faces` in the Unsplash URL — preserve that param.

4. **In the markup**, replace the raw `<img src="https://images.unsplash...">`
   with `<img src="${myImage.src}">`. This only works inside the same
   `set:html` template string the `getImage()` call's variable is scoped to
   (i.e. the frontmatter of that same `.astro` file).

5. **Repeated images across a page** (e.g. hover-swap `data-img` attributes,
   or a gallery): pull the URLs into an array and `Promise.all` + `.map()`
   over `getImage()` rather than writing one call per image. See
   `src/pages/index.astro` — `galleryUrls` / `galleryImages` — for the
   pattern. Reference by index: `${galleryImages[0].src}`.

6. **Build and check the `generating optimized images` output** — confirms
   actual before/after file sizes and format. Re-running the build reuses
   cached conversions (`reused cache entry`), so repeated builds are fast.

## When real photos replace Unsplash placeholders

No pattern change needed. Swap the `src:` value from the Unsplash URL to a
local imported file path (e.g. `src: myLocalImage` after
`import myLocalImage from '../assets/doctor-photo.jpg'`) — same `getImage()`
call, same `${var.src}` interpolation downstream. This is the whole reason
`getImage()` was chosen over a manual download/convert step.

## Known gaps (as of this writing)

- `ogImage` consts (used only in `<meta property="og:image">` tags) are
  **not yet optimized** on any page. OG tags need an absolute, publicly
  resolvable URL for social crawlers (Facebook/WhatsApp previews) — treat
  this as a separate small task, not a copy-paste of the pattern above.
- Pages with no images yet (`vidas-transformadas`, `blog-y-articulos`, etc.)
  have nothing to convert until real content/images land. Apply this pattern
  fresh when that happens.
