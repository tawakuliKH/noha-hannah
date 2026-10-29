# Noha & Hannah — start here

A complete React/Vite brand website for **nohannah.co.uk**, with an independently deployable Cloudflare Worker for Gemini chat.

## 1. Run on your Windows computer

1. Extract the ZIP (do not run it from inside the ZIP).
2. Open the extracted **noha-hannah** folder in VS Code. It contains `package.json`.
3. Open Terminal → New Terminal and run one command at a time:

```powershell
npm.cmd ci
npm.cmd run dev
```

Open the Local link printed by Vite. Keep the terminal open. Use Node **22.12 or newer**; Node 24 is also supported. `npm.cmd` avoids the PowerShell `npm.ps1` execution-policy issue.

You do not need to run `npm create vite` again. This ZIP is a complete project. Keep your existing starter folder as a backup and open this extracted folder instead.

## 2. What works immediately

- Responsive ivory / charcoal / champagne design with your supplied logo.
- Three-slide interior hero with previous, next and pause controls.
- Collection inspiration panels, accessible dialogs and FAQ disclosures.
- Three.js furnished room with sofa, cushions, rug, coffee table, floor lamp and plant, with rotation, zoom, three sofa colours and reset view. Use drag or focus the canvas and press arrow keys. Scrolling remains available on phones.
- An explicit photograph fallback for devices without WebGL; reduced-motion support and a global motion pause.
- Local brand-guide chat with real answers from the supplied guide. It is labelled clearly and does not pretend to be live AI.
- All imagery is bundled locally; no remote image or font requests on page load.
- Metadata, Open Graph image, favicon, canonical URL, HomeGoodsStore JSON-LD, robots.txt and sitemap.xml.

## 3. Connect Gemini through Cloudflare

**Preferred for this project: follow `CLOUDFLARE-DASHBOARD.md`.** It matches the existing Essentials Store dashboard workflow and uses the ready-to-paste `cloudflare/worker.js`. The terminal commands below are an optional alternative.

### Optional Wrangler alternative

Never put the Gemini key in React code, `.env` variables beginning `VITE_`, or GitHub. Do not send the key in a chat message. Enter it only into your local secret prompt.

```powershell
cd worker
npm.cmd ci
npx.cmd wrangler login
npx.cmd wrangler secret put GEMINI_API_KEY
```

Paste your key into the private prompt. Review `worker/wrangler.jsonc`:

- Set `GEMINI_MODEL` to a model enabled for your Google AI project. `gemini-2.5-flash` is an editable starter value; model availability and retirement dates can change.
- `ALLOWED_ORIGINS` uses exact origins, separated by commas, without trailing slashes. Add your actual Render preview origin. Your custom-domain origins and `http://localhost:5173` are already listed. Remove localhost from production if you do not need it; use a separate development Worker if preferred.
- Choose a unique rate-limit namespace ID within your Cloudflare account if `184761` is already in use.

```powershell
npm.cmd run deploy
```

Copy the Worker URL printed by Wrangler and append `/api/chat`, for example `https://YOUR-WORKER.YOUR-SUBDOMAIN.workers.dev/api/chat`.

Go back to the project root:

```powershell
cd ..
Copy-Item .env.example .env.local
```

Edit `.env.local` to set your **public endpoint only**:

```dotenv
VITE_CHAT_API_URL=https://YOUR-WORKER.YOUR-SUBDOMAIN.workers.dev/api/chat
```

Restart Vite. The chat now calls the Worker. For Render, set this same environment variable in the Render dashboard and rebuild. It is intentionally public and contains no key.

For optional local Worker development, copy `worker/.dev.vars.example` to `worker/.dev.vars`, enter the key locally and run `npm.cmd run dev` from `worker`. Use the printed local Worker URL with `/api/chat`. These local secret files are ignored by Git.

### Chat protections

Exact origin allowlist, JSON and role validation, streamed 16 KB request limit, 2,000 characters per user question, up to six exchanges plus a new question, 18-second upstream timeout and safe errors. The dashboard file uses a basic per-isolate 10-requests/minute/IP throttle. Wrangler deployments can use the stronger Cloudflare CHAT_RATE_LIMITER binding. Neither is a strict global quota; CORS is not authentication. See CLOUDFLARE-DASHBOARD.md for the precise limits and limitations.

## 4. GitHub and Render

Create an empty GitHub repository. In the project root:

```powershell
git init
git add .
git commit -m "Build Noha and Hannah website"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPOSITORY.git
git push -u origin main
```

Review staged files before pushing. `node_modules`, builds and local secret files are ignored. The included `.example` files contain no real secrets.

Create a **Render Static Site** connected to that repository:

- Root directory: blank (the frontend package.json is in the repository root).
- Build command: `npm ci --include=dev && npm run build`
- Publish directory: `dist`
- Node version: 22.16.0 or a newer supported version.
- Environment: `VITE_CHAT_API_URL` = your Worker URL ending in `/api/chat`.

`render.yaml` is included for blueprint deployment. Do not deploy the frontend as an Express service. Deploy the `worker` folder separately to Cloudflare; Render does not run it.

## 5. Custom domain and Google

In Render, add `nohannah.co.uk` and `www.nohannah.co.uk` under custom domains. At Porkbun, copy the exact DNS records shown by Render; do not guess an IP or CNAME target. Preserve unrelated email records. Verify both hosts and HTTPS, and configure `www` to redirect to the preferred root domain.

Canonical metadata and sitemap already use `https://nohannah.co.uk/`. Confirm they match the final preferred domain. Do not submit the temporary Render hostname for indexing.

Add the domain property in Google Search Console. Copy its TXT verification record to Porkbun, verify it, submit `https://nohannah.co.uk/sitemap.xml`, inspect the homepage and request indexing. Validate structured data with Schema.org Validator and Google's Rich Results Test. Business markup does not guarantee a Google rich result or rankings.

Deployment, DNS, HTTPS, Google verification and live Gemini access require your accounts and have not been performed in this ZIP.

## 6. Add your operational company details

The supplied brand guide and your later company information are incorporated. Contact: supports@nohannah.co.uk, 01133183217, 07466353588. Store address: 221 Harehills Lane, Leeds, LS8 3QH. Hours: Monday–Saturday 10 AM–8 PM; Sunday 10 AM–7 PM, UK time. In-store shopping, conditional delivery and payment information are included. Footer: BY ZWAN ENTERPRISE LIMITED and a link crediting Morteza Tawakuli.

Send the developer the following before a commercial launch:

- Real product list, photos, prices, dimensions and availability.
- Exact delivery fees/time estimates and any minimum order values; warranty durations and voluntary return time limits.
- Company registration number, registered office and final approved customer/privacy policies.
- Social profile links, if you want them displayed.
- Whether this remains a brand showcase or needs a real commerce platform and checkout.

Edit `src/content.js` for public brand text and FAQs, `src/main.jsx` for page sections, and `worker/src/knowledge.js` for the chatbot's verified knowledge. Update both public FAQ copy and chatbot facts together. The visible contact section already includes working email and telephone links and a weekly hours table. The Worker imports brand facts and policies directly from `src/content.js`.

The collection names describe editorial inspiration. Photography and the original furnished-room 3D models are not representations of real stock. No cart, payment processing, email delivery or order database is implemented. The privacy panel describes this implementation and is a starting point to review against the final operational setup.

## 7. Checks and project map

```powershell
npm.cmd test
npm.cmd run build
npm.cmd run preview
cd worker
npm.cmd run check
```

- `src/main.jsx`: page sections, navigation and dialogs.
- `src/components/Chatbot.jsx`: chat interface with consent, retries, clear chat and contact links.
- `src/chat-protocol.js`: user/model transcript and UTF-8 history limits.
- `cloudflare/worker.js`: single-file dashboard backend, generated by `npm run build:worker`.
- `src/Studio.jsx`: lazily loaded Three.js scene, disposal, pause and fallback.
- `src/style.css`: responsive design and motion preferences.
- `src/content.js`: editable site content and local answers.
- `worker/src/index.js`: protected Gemini gateway.
- `worker/src/knowledge.js`: verified business instructions.
- `tests/worker.test.js`: backend contract and error-path tests with mocked provider.
- `public/`: locally hosted logo, photography, social card and SEO files.
- `ASSET-CREDITS.md`: image sources and logo provenance.

The 3D library is loaded only when the studio is activated. Its bundled chunk is approximately 517 KB before gzip (130 KB gzip); Vite's chunk-size warning is expected. This keeps that cost out of the initial page load.

Build and Worker dry-run checks passed. Backend unit tests passed without a real API key. The original layout was reviewed at desktop, 390 px phone and 768 px tablet widths. The contact/footer update is also responsive. This environment disables WebGL, so actual GPU rendering and drag rotation require a final check on your own WebGL-capable browser. Geometry tests validate the furnished room independently, but do not replace a visual GPU check. Real Gemini responses, live hosting, DNS and Search Console are not tested or configured yet.

## Returns wording clarification

The supplied warranty-based returns conditions appear under a voluntary policy. Customer-caused damage is distinguished from faulty goods. The site and chatbot state that statutory rights apply even without a warranty; neither makes a blanket claim that broken goods can never be returned. Do not remove this distinction when editing. UK guidance: https://www.gov.uk/accepting-returns-and-giving-refunds

## Updated ZIP installation

Extract this revision to a fresh folder and open it in VS Code. Run `npm.cmd ci` then `npm.cmd run dev`. If you already connected the first version to Gemini, copy your own `.env.local` into the new project locally; it is intentionally not included in the ZIP. Redeploy the Cloudflare Worker so its knowledge includes the new company information.
