<<<<<<< HEAD
# Lootlane

A bilingual gaming item marketplace demo built with Node.js, Express, EJS, MVC, and SQLite (SQL). It includes a searchable marketplace, seller dashboard, seeded listings, and demo buy/list actions.

## Run locally

Requires Node.js 22.5 or newer (for the built-in `node:sqlite` module).

```sh
npm install
cp .env.example .env
npm start
```

Open <http://localhost:3001>. SQLite creates `data/marketplace.sqlite` on first run and adds sample listings. To change its path, set `SQLITE_FILE`.

The demo admin panel is at <http://localhost:3001/admin>. In development, its default credentials are `admin` / `DemoAdmin!2026`; set `ADMIN_USERNAME`, `ADMIN_PASSWORD`, and `ADMIN_SESSION_SECRET` in `.env` before sharing the app. Login is disabled in production until credentials are configured. Admin sessions are signed, HTTP-only cookies and failed logins are temporarily rate-limited.

## Language

Persian is selected when the request has `CF-IPCountry: IR` or `X-Vercel-IP-Country: IR`, or its `Accept-Language` prefers Persian. Other requests use English. In production, configure your trusted reverse proxy to provide a country header, or connect a GeoIP database/service. Do not trust arbitrary client supplied country headers at the public edge.

## Structure

```text
app.js                    Express app and startup
config/database.js        SQLite connection, schema, demo seed
controller/marketController.js
models/listing.js         SQL queries
router/marketRoutes.js
middleware/locale.js      Persian/English selection
controller/adminController.js  Admin login, session and moderation
views/                    EJS pages and partials
public/dist/main.css      Responsive game-market styling
```

## Steam API notes

The Steamworks Web API can return public profile summaries with `ISteamUser/GetPlayerSummaries` (up to 100 SteamIDs per call). The developer portal documents OpenID for obtaining a SteamID, and lists TF2 item data APIs; this does not provide a general ownership API for all games. Steam authentication and ownership checks are separate concerns; publisher-key ticket validation must happen on a secure server. Public profile endpoints do not prove that a seller owns a particular tradable item, and the API does not provide a universal cross-game checkout/transfer mechanism. This demo therefore accepts manually entered game/platform/item details and does not represent listings as Steam-verified.

## Inspiration and scope

The Steam Community Market emphasizes searchable game/item pages, visible active listings, buy orders, and transaction history. CSFloat documents marketplace listings, offers, and trade delivery steps for CS2. This demo adopts the discoverability and seller moderation patterns, while leaving real checkout, item verification, payments, and delivery for game-specific integrations.

Before handling real trades, add user accounts and session security, game-specific inventory/ownership verification, payment and escrow integration, fraud/dispute workflows, and a delivery mechanism supported by each game. The current buy button marks a demo listing sold; it does not charge money or transfer an item. This is a UI and architecture starter, not a production trading service.

Official references: [Steamworks Web API overview](https://partner.steamgames.com/doc/webapi_overview), [ISteamUser](https://partner.steamgames.com/doc/webapi/ISteamUser), and [ISteamUserAuth](https://partner.steamgames.com/doc/webapi/isteamuserauth).
=======

>>>>>>> 2e48160bd340abc11b3aa3d0cb3f9c33b22a55e3
