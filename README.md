# 🌙 Luna Arcadia

**Play. Compete. Earn real APT** — a fast-paced competitive Web3 gaming platform built on the Aptos blockchain.

Luna Arcadia is a Next.js-based web app where players can play short skill-based matches (ex: *Luna Blitz*) and settle rewards transparently via Move smart contracts on Aptos Testnet.

---

## Quick links

- **Aptos Explorer (Publish Txn):** https://explorer.aptoslabs.com/txn/0x79d987ecd008948c2d388f17aa438bff768137b4ee04f61ea91c955cacb44b0c?network=testnet
- **Deployed Package Address (Testnet):** `0xf0c29b2a4d46010effaf11d67762f64881f14be4c1bc1b2ce88f6c7d67321283`

---

## What we built

Traditional games extract value from players and lock rewards inside centralized systems.

**Luna Arcadia** flips the model:
- Players compete in short matches.
- Results are written on-chain.
- Rewards/prizes are distributed by Move contracts (transparent + verifiable).
- The platform can enforce integrity rules (anti-cheat/fraud signals) and build trustworthy leaderboards.

---

## Features (MVP)

- Wallet connect (Petra-friendly)
- Practice + Competitive flow (UI-driven)
- On-chain leaderboard + points tracking
- Prize pool / distribution module (Move)
- Transaction proof via Aptos Explorer (testnet)

---

## Tech stack (and why)

### Frontend
- **Next.js (App Router)** — a React framework for building high-quality web applications with strong developer experience. [page:0]
- **React + TypeScript** — fast iteration with type safety (especially useful for wallet + chain payloads).
- **Tailwind CSS** — rapid UI building for hackathon speed.

### Web3 / Blockchain
- **Aptos blockchain (Testnet)** — fast, low-friction environment to ship and test real on-chain game flows.
- **Move smart contracts** — on-chain modules for leaderboard and prize distribution.
- **Aptos TS SDK / Wallet Adapter** — to build, sign, and submit transactions from the web client.

### Smart contract modules (current)
Published under: `0xf0c29b2a4d46010effaf11d67762f64881f14be4c1bc1b2ce88f6c7d67321283`

- `Leaderboard` (see `sources/leaderboard.move`)
- `PrizeDistribution` (see `sources/prize_distribution.move`)

> Note: On Aptos, you publish a **Move package**; all modules inside it are published under the **same account/package address** (the publisher).

---

## Contract details

### Deployed address
- **Package / Modules address (Testnet):**
  `0xf0c29b2a4d46010effaf11d67762f64881f14be4c1bc1b2ce88f6c7d67321283`

### Publish transaction
- Tx hash:
  `0x79d987ecd008948c2d388f17aa438bff768137b4ee04f61ea91c955cacb44b0c`
- Explorer:
  https://explorer.aptoslabs.com/txn/0x79d987ecd008948c2d388f17aa438bff768137b4ee04f61ea91c955cacb44b0c?network=testnet

---

## Getting started (Frontend)

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

### Install

### Run dev server

Open http://localhost:3000

---

## Getting started (Move)

### Run tests

### Publish (Testnet)
> Only if you want to redeploy from your machine.

---

## Configuration

Create a `.env.local` (example keys — update to match your code):


---

## How the dApp interacts with contracts (high-level)

1. User connects wallet (Petra)
2. User plays a match (client-side gameplay loop)
3. Client submits result to Move module (transaction)
4. Contract updates leaderboard / pool state
5. UI reads leaderboard state and shows the result + transaction link

---

## Folder structure (suggested)


---

## Roadmap (next)

- End-to-end “Competitive Match” UX:
  - escrow / pool deposit
  - score submission
  - winner payout + explorer proof
- Anti-cheat signals (off-chain) + enforcement hooks
- Seasons + leaderboard resets
- Tournaments + sponsored prize pools
- Mobile-friendly UI pass

---

## Team

Team: **MEGATRON**  
Project: **Luna Arcadia** (Aptos hackathon build)

---

## License

MIT (or update as needed).
