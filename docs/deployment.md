# Deployment and Domain

Whoamiii is served as a static Vite build from GitHub Pages.

## Production Configuration

- Domain: `whoamiii.art`
- Repository: `whoamaiii/whoamiiiport`
- GitHub Pages source: root of the `gh-pages` branch
- Custom domain source file: [`public/CNAME`](../public/CNAME)
- DNS provider: Cloudflare; GoDaddy remains the registrar
- HTTPS: enforced by GitHub Pages

Cloudflare should keep the GitHub Pages records DNS-only:

| Type | Name | Content |
| --- | --- | --- |
| `A` | `whoamiii.art` | `185.199.108.153` |
| `A` | `whoamiii.art` | `185.199.109.153` |
| `A` | `whoamiii.art` | `185.199.110.153` |
| `A` | `whoamiii.art` | `185.199.111.153` |
| `CNAME` | `www` | `whoamaiii.github.io` |

Do not remove unrelated DNS records when publishing the portfolio.

## Build and Validate

Run from the repository root:

```bash
npm ci
npm run check:ci
npm run test:e2e:preview
npm run build
```

The final `npm run build` writes `dist/`. Before publishing, confirm it contains
`index.html`, hashed `assets/`, `images/`, `videos/`, `CNAME`, `.nojekyll`,
`robots.txt`, `sitemap.xml`, icons, the web manifest, and the social preview.
These public-root files are source-controlled under [`public/`](../public), so do
not patch them only on the deployment branch.

## Publish `dist/`

Publishing is a state-changing operation. Run it only with explicit release
authorization. The current manual branch workflow is:

```bash
DEPLOY_DIR="$(mktemp -d)"
git fetch origin gh-pages
git worktree add --detach "$DEPLOY_DIR" origin/gh-pages
rsync -a --delete --exclude='.git' dist/ "$DEPLOY_DIR"/
git -C "$DEPLOY_DIR" add -A
git -C "$DEPLOY_DIR" status --short
git -C "$DEPLOY_DIR" commit -m "Deploy Wet Signal portfolio"
git -C "$DEPLOY_DIR" push origin HEAD:gh-pages
git worktree remove "$DEPLOY_DIR"
```

Review `status --short` before committing. If it reports no changes, skip the
commit and push, then remove the worktree. Never publish the development server
or the source tree in place of `dist/`.

GitHub Pages may build automatically after the branch push. Its state can be
inspected, and a legacy Pages build can be requested, with:

```bash
gh api repos/whoamaiii/whoamiiiport/pages
gh api repos/whoamaiii/whoamiiiport/pages/builds -X POST
gh api repos/whoamaiii/whoamiiiport/pages/builds/latest
```

Expected Pages fields are `status: built`, `build_type: legacy`,
`source.branch: gh-pages`, `cname: whoamiii.art`, an approved certificate, and
`https_enforced: true`.

## Live Verification

```bash
dig whoamiii.art +noall +answer -t A
dig www.whoamiii.art +noall +answer -t CNAME
curl -I --max-time 15 https://whoamiii.art/
curl -I --max-time 15 https://www.whoamiii.art/
curl -s --max-time 15 https://whoamiii.art/ | rg 'assets/index-.*\.(js|css)'
curl -I --max-time 15 https://whoamiii.art/images/liquid-perception-hero-960.webp
curl -I --max-time 15 https://whoamiii.art/social-preview.png
curl -I --max-time 15 https://whoamiii.art/sitemap.xml
```

Confirm the apex returns `200`, `www` and HTTP redirect to the HTTPS apex, the
HTML references the newly built asset hashes, representative media returns
successfully, and a real browser shows the current “Wet Signal” interface. A
successful status code alone is not visual verification.

If DNS changes trigger a temporary certificate delay, wait for issuance and
retry HTTPS enforcement:

```bash
gh api repos/whoamaiii/whoamiiiport/pages -X PUT -F https_enforced=true
curl -I --max-time 15 https://whoamiii.art/
```

Do not declare deployment complete until the certificate is valid and the
browser render matches the reviewed production build.
