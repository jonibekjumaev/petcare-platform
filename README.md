# PetCare Platform

A pet supplies store where every customer's pet has a profile, and an AI care
assistant gives product and care advice grounded in that pet's data and the
customer's order history — not generic answers.

**Status:** In development

---

## The problem

Busy pet owners want to take good care of their pets, but a demanding schedule
pushes them toward fast, uninformed choices. Ordering is easy; ordering the
_right_ thing is not. Existing online pet stores offer a catalog and a checkout,
nothing more — so customers pick on price and buy wherever is cheapest.

## The approach

Each customer registers their pet's profile (species, breed, age, weight).
The catalog filters to products suited to that pet, and the AI assistant answers
questions using the pet's profile and past orders as context. The goal is
retention through personalization rather than competing on price.

---

## Tech stack

**Backend** — Node.js, Express, TypeScript, MongoDB (Mongoose), JWT auth
**Admin panel** — EJS server-side rendering
**Frontend** — React, TypeScript, Redux Toolkit, MUI
**AI** — Claude API

---

## Architecture decisions

**Admin panel uses EJS, not React.** The admin panel is internal — no SEO
requirement, no complex client-side state, no real-time updates. Server-side
rendering is sufficient and faster to build. This is a deliberate choice, not a
shortcut.

**Two auth strategies.** The SPA uses JWT in the `Authorization` header; the
admin panel uses session-based auth, since the browser loads those pages
directly.

**Orders and chat sessions link to a specific pet,** not just the customer.
This is what lets the AI reference the right animal when a customer owns
several.

---

## Project structure

petcare-platform/
├── backend/ Express API + EJS admin panel
├── frontend/ React SPA
└── docs/ Problem statement, ER model, architecture notes

---

## Running locally

```bash
cd backend
npm install
cp .env.example .env    # fill in your values
npm run start:dev
```

Requires Node.js 24+ and a MongoDB connection string.

---

## Documentation

Full ER model, architecture notes, and the problem statement are in [`docs/`](./docs).
