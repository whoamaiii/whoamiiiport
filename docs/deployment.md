# Deployment and Domain

This portfolio is served as a static site from GitHub Pages.

## Current Production Setup

- Production domain: `whoamiii.art`
- Registrar: GoDaddy
- Authoritative DNS: Cloudflare
- GitHub repository: `whoamaiii/whoamiiiport`
- GitHub Pages source: `gh-pages` branch, `/` root
- Custom domain file on `gh-pages`: `CNAME` with `whoamiii.art`
- HTTPS: certificate approved and HTTPS enforcement enabled in GitHub Pages

GoDaddy is not where the live DNS records are managed. GoDaddy only owns the
domain registration. Cloudflare is the place to edit DNS because the domain
uses Cloudflare nameservers:

- `ariella.ns.cloudflare.com`
- `vin.ns.cloudflare.com`

## Required DNS Records

Keep the GitHub Pages records DNS-only in Cloudflare.

| Type | Name | Content |
| --- | --- | --- |
| `A` | `whoamiii.art` | `185.199.108.153` |
| `A` | `whoamiii.art` | `185.199.109.153` |
| `A` | `whoamiii.art` | `185.199.110.153` |
| `A` | `whoamiii.art` | `185.199.111.153` |
| `CNAME` | `www` | `whoamaiii.github.io` |

Do not remove unrelated DNS records such as `_domainconnect`, `_dmarc`, or the
`qodex` tunnel unless the system that owns that record is also being changed.

## Publishing

GitHub Pages currently publishes from the `gh-pages` branch instead of GitHub
Actions. The Actions-based Pages deploy was avoided because the GitHub account
reported a billing lock that prevented jobs from starting.

Before publishing, run the normal release checks:

```bash
npm run check
npm run test:e2e
npm run build
```

Then publish the contents of `dist/` to the `gh-pages` branch. The published
branch must include:

- `index.html`
- hashed files from `assets/`
- runtime files from `images/`, `videos/`, `favicon.svg`, `robots.txt`, and
  `social-preview.png`
- `CNAME` containing exactly `whoamiii.art`
- `.nojekyll`

After pushing `gh-pages`, trigger or verify the Pages build:

```bash
gh api repos/whoamaiii/whoamiiiport/pages
gh api repos/whoamaiii/whoamiiiport/pages/builds -X POST
gh api repos/whoamaiii/whoamiiiport/pages/builds/latest
```

The Pages API should report:

- `status`: `built`
- `build_type`: `legacy`
- `source.branch`: `gh-pages`
- `cname`: `whoamiii.art`
- `https_certificate.state`: `approved`
- `https_enforced`: `true`

## Live Verification

Verify DNS first:

```bash
dig whoamiii.art +noall +answer -t A
dig www.whoamiii.art +noall +answer -t CNAME
```

Expected result:

- `whoamiii.art` resolves to the four GitHub Pages A records.
- `www.whoamiii.art` resolves to `whoamaiii.github.io`.

Then verify the live site and representative assets:

```bash
curl -I --max-time 15 https://whoamiii.art/
curl -I --max-time 15 https://www.whoamiii.art/
curl -s --max-time 15 https://whoamiii.art/ | rg 'assets/index-.*\.(js|css)'
curl -I --max-time 15 https://whoamiii.art/images/liquid-perception-hero-960.webp
```

Expected result:

- `https://whoamiii.art/` returns `200 OK`.
- `https://www.whoamiii.art/` redirects to `https://whoamiii.art/`.
- `http://whoamiii.art/` redirects to HTTPS.
- The HTML references the current hashed JS and CSS assets.
- Image and video assets return `200 OK`.
- A real browser render check shows the portfolio content, not only a server
  status code.

## HTTPS

HTTPS is currently active for `whoamiii.art`; GitHub Pages reports the
certificate as `approved` and `https_enforced` as `true`.

If DNS changes are made later, GitHub may temporarily reject HTTPS enforcement
with:

```text
The certificate does not exist yet
```

That means the domain is pointed correctly but GitHub has not finished issuing
the certificate. Wait and retry:

```bash
gh api repos/whoamaiii/whoamiiiport/pages -X PUT -F https_enforced=true
curl -I --max-time 15 https://whoamiii.art/
```

Do not claim HTTPS is complete until `https://whoamiii.art/` returns a valid
certificate and `200 OK`.
