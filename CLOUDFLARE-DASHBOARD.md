# Cloudflare dashboard setup — Noha & Hannah

The frontend stays on Render Static Site. Cloudflare handles Gemini requests. No Cloudflare nameserver change or local backend terminal is required for this dashboard workflow.

## 1. Create a separate Worker

At https://dash.cloudflare.com/ open Workers & Pages → Create application → Create Worker / Hello World (the label may differ). Name it **noha-hannah-chat**, then deploy. Do not edit or replace the Essentials Store Worker.

Copy the exact workers.dev URL Cloudflare gives you. Do not assume the account subdomain. If the creation screen only offers repository/templates, use the dashboard's blank Worker/Hello World option if available, or share the screen with your developer for the next step.

## 2. Paste the prepared code

Open the new Worker → Edit code. Replace the starter code in `worker.js` with **all of `cloudflare/worker.js` from this ZIP**, then deploy. That file is a standalone ES module with no local imports and no dependencies.

Do NOT paste `worker/src/index.js` on its own: that is modular source used for local development.

## 3. Add variables and the secret

Worker → Settings → Variables and Secrets:

| Name | Type | Value |
| --- | --- | --- |
| GEMINI_API_KEY | Secret | Your private Gemini key; enter it only in Cloudflare |
| GEMINI_MODEL | Text | A supported model ID enabled in your Google AI project; use the working model ID from your existing chatbot if it remains available |
| ALLOWED_ORIGINS | Text | See the comma-separated list below |

Save/deploy as required by the dashboard.

```text
http://localhost:5173,http://localhost:4173,https://nohannah.co.uk,https://www.nohannah.co.uk
```

Append the exact Render Static Site origin once known, e.g. `,https://YOUR-ACTUAL-SITE.onrender.com`. This is an example, not your assigned address. No trailing slash, path or wildcard. The four known origins are also built into the Worker as defaults; a supplied ALLOWED_ORIGINS value replaces the defaults.

The key never belongs in React, GitHub or a VITE_ variable.

## 4. Check health

Open your Worker URL with `/api/health` appended. With both settings present, expect:

```json
{"status":"ok","keyConfigured":true,"modelConfigured":true,"rateLimitMode":"basic-per-isolate"}
```

This checks presence only, not API-key validity, billing, model access or Gemini connectivity. `/` intentionally returns `Route not found`. The health endpoint is public but reveals no key or key fragments.

## 5. Connect React

In your frontend project root, copy `.env.example` to `.env.local`. Set:

```dotenv
VITE_CHAT_API_URL=https://YOUR-WORKER.YOUR-SUBDOMAIN.workers.dev/api/chat
```

Use the exact address from Cloudflare. Restart `npm.cmd run dev`. There is no backend terminal to start. Before connection, the UI explicitly uses local brand-guide answers. Once connected, it shows the Gemini consent checkbox and sends only after agreement. Suggestions fill the input; press Send to submit.

For Render, set the same `VITE_CHAT_API_URL` environment variable and rebuild the static site. Vite bakes public environment values into the frontend at build time.

## 6. Test actual replies

Ask about opening hours, address, delivery and warranty terms. Check that it answers for Noha & Hannah, 221 Harehills Lane, Leeds, LS8 3QH. A successful reply validates the end-to-end Gemini call.

The React component is `src/components/Chatbot.jsx`. It excludes the welcome message from history, sends up to six previous exchanges, trims by byte count, prevents duplicate submissions, restores failed questions for retry, uses a 28-second timeout, supports Escape and clear chat, and includes Call/WhatsApp links.

## Protections and limits

- Exact browser-origin allowlist and POST/OPTIONS `/api/chat`.
- Maximum streamed request body: 16,000 bytes.
- Alternating user/model history, at most 13 messages including the current question.
- Maximum user question: 2,000 characters; previous model replies: 6,000 characters.
- Frontend history trims to 14,000 UTF-8 bytes.
- Gemini timeout: 18 seconds, bounded output, no HTML rendering of replies.
- Basic dashboard throttle: 10 requests per IP per minute **within one running Worker isolate**. Counts reset when an isolate restarts and are not shared globally. A bounded counter map avoids unbounded memory use.
- If the optional CHAT_RATE_LIMITER binding is configured using Wrangler, it is used instead. That mode is approximate per Cloudflare location.

The in-memory dashboard throttle is weaker than the Cloudflare binding; it is not a reliable global abuse or spending cap. CORS is not authentication. Configure provider quotas and usage alerts, and use stronger controls such as verified Turnstile and distributed limiting for higher traffic.

## Updating later

Edit `src/content.js` for the common business details and `worker/src/knowledge.js` for AI instructions. Run:

```powershell
npm.cmd run build:worker
```

Paste the newly generated `cloudflare/worker.js` into the dashboard and deploy. Frontend deployment alone does not update the dashboard Worker.

The optional Wrangler workflow remains in START-HERE.md. Choose one deployment workflow and keep source changes in sync; later Wrangler deployments may overwrite dashboard edits/settings.

References: https://developers.cloudflare.com/learning-paths/workers/get-started/first-worker/ and https://developers.cloudflare.com/workers/runtime-apis/bindings/rate-limit/
