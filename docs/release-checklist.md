# Release Checklist

## Automated Gate

```bash
npm ci
npm run check:ci
npm run test:e2e:preview
```

## Mobile-First Visual Pass

At `390x844`, verify:

- the fixed header, eyebrow, title, subtitle, and entry action fit the first hero
  viewport without overlap or horizontal overflow
- selected-work heading, intro, four varied artwork frames, external captions,
  and archive action form a coherent sequence
- process-stage labels do not clip, the film frame is intentional, and both
  playback controls reflect the same state
- all six archive chapters show a lead image, count, and expansion state; only
  one chapter opens and only its cards mount
- about portrait, statement, identity, contact title, email action, and footer
  preserve readable wrapping and touch targets

Perform a desktop regression after mobile is approved.

## Navigation and Loading

- Load `/`, `/#work`, `/#gallery`, `/#about`, `/#contact`, and one
  `/#gallery-…` chapter anchor in fresh tabs.
- Confirm the requested section mounts and remains aligned at the viewport top
  after preceding lazy content settles.
- Confirm labelled loading states do not create a blank page or replace final
  landmarks.
- Navigate through both desktop links and the mobile index.

## Keyboard and Accessibility

- Activate the skip link and confirm focus lands on `main`.
- Open the mobile menu: focus enters, Tab cycles inside, Escape closes it, and
  focus returns to the menu button.
- Open image and video artwork dialogs: verify labels, notes toggle, media
  controls, Escape, and trigger focus restoration.
- Expand and collapse archive chapters by keyboard.
- Confirm every visible hover treatment has a focus-visible equivalent.

## Reduced Motion and Media

- Enable reduced motion and confirm the full hierarchy remains readable.
- Confirm hero and section reveals no longer depend on motion.
- Confirm the process film does not autoplay, remains manually playable, and
  pauses when moved offscreen.
- Confirm artwork videos have posters, native controls, and valid same-origin
  sources.

## Build and Metadata

- Inspect the production preview, not only the dev server.
- Confirm `dist/` includes `CNAME`, `.nojekyll`, `robots.txt`, `sitemap.xml`,
  icons, manifest, social preview, images, videos, and hashed assets.
- Confirm document title, description, canonical URL, Open Graph/Twitter image,
  JSON-LD, and `lang` match the current English portfolio.
- Confirm direct asset URLs return successfully and no console error appears.

## Production Domain

- GitHub Pages reports `status: built`, `source.branch: gh-pages`,
  `cname: whoamiii.art`, approved certificate, and HTTPS enforcement.
- `https://whoamiii.art/` returns `200`.
- `https://www.whoamiii.art/` and HTTP redirect to the HTTPS apex.
- Cloudflare retains the four GitHub Pages A records and DNS-only `www` CNAME.
- A real browser render shows the new site, not only a successful status code.

Do not release while any automated gate fails, the first mobile viewport clips,
deep links drift, focus trapping/restoration breaks, reduced motion removes
content, media paths fail, or the preview differs materially from the build.
