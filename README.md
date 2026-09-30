# MarketSignal

Consumer demand intelligence platform. MarketSignal records product searches, views, wishlists, price alerts, and interest requests, then converts those **platform signals** into a deterministic Demand Score.

This repository is a local MVP. Seeded catalog data is **synthetic sample data**, not live marketplace traffic.

## Features

- JWT auth for consumer, seller, and admin roles
- Product exploration with search and filters
- Signal collection with cooldown/rate limits
- Demand engine (weights, growth, rising/stable/declining)
- Consumer dashboard, wishlist, price alerts, interest
- Seller inventory CRUD, opportunities, analytics
- Optional Gemini-powered explanations, market reports, and Q&A
- Admin users, products, categories, and platform stats

## Architecture

Demand math lives in the backend (`demandEngine` + `calculateDemandScore`). Gemini only receives structured summaries already computed by the API. The frontend never sees `GEMINI_API_KEY`, `MONGO_URI`, or `JWT_SECRET`.

```
project_3/MarketSignal/
  frontend/   React + Vite + Tailwind + Recharts
  backend/    Express + MongoDB + Mongoose
```

## Tech stack

Frontend: React, JavaScript, Vite, React Router, Axios, Tailwind CSS, Recharts  
Backend: Node.js, Express, MongoDB, Mongoose, JWT, bcrypt, Multer

## Environment setup

Copy the example env files and fill in secrets:

```
backend/.env.example
frontend/.env.example
```

Backend variables:

```
PORT=5000
MONGO_URI=
JWT_SECRET=
GEMINI_API_KEY=
GEMINI_MODEL_1=gemini-3.8-flash
GEMINI_MODEL_2=gemini-3.5-flash
GEMINI_MODEL_3=gemini-3.5-flash-lite
FRONTEND_URL=http://localhost:5173
```

Frontend variables:

```
VITE_API_URL=http://localhost:5000/api
```

## Installation

### MongoDB

Use MongoDB Atlas or a local MongoDB instance. Put the connection string in `backend/.env` as `MONGO_URI`.

### Backend

```
cd backend
npm install
npm run seed
npm run dev
```

### Frontend

```
cd frontend
npm install
npm run dev
```

API: `http://localhost:5000`  
App: `http://localhost:5173`

### Gemini API

Set `GEMINI_API_KEY` and the three model variables in `backend/.env`. The backend tries the models in order and falls back automatically if a model is rate-limited, unavailable, or temporarily failing.

## Demo accounts

After seeding (password for all: `Password123`):

- `consumer@marketsignal.demo`
- `seller@marketsignal.demo`
- `admin@marketsignal.demo`

## Demand score

Weights (configurable in `backend/src/utils/calculateDemandScore.js`):

- search = 1
- view = 2
- wishlist = 4
- price_alert = 5
- interest = 7

Growth uses current vs previous 7-day windows. Trend:

- >= 25% rising
- between -25% and 25% stable
- <= -25% declining

## API documentation

| Method | Path | Auth |
| --- | --- | --- |
| POST | `/api/auth/register` | public |
| POST | `/api/auth/login` | public |
| GET | `/api/auth/me` | JWT |
| GET | `/api/products` | public |
| GET | `/api/products/:id` | public |
| POST | `/api/products` | seller/admin |
| PUT | `/api/products/:id` | seller/admin |
| DELETE | `/api/products/:id` | seller/admin |
| POST | `/api/signals/search` | optional JWT |
| POST | `/api/signals/view` | optional JWT |
| POST | `/api/signals/interest` | JWT |
| GET/POST/DELETE | `/api/wishlist` | JWT |
| GET/POST/DELETE | `/api/alerts` | JWT |
| GET | `/api/demand/trending` | public |
| GET | `/api/demand/:productId` | public |
| GET | `/api/demand/regions` | public |
| GET | `/api/demand/categories` | public |
| GET | `/api/seller/dashboard` | seller |
| GET | `/api/seller/opportunities` | seller |
| GET | `/api/seller/analytics` | seller |
| POST | `/api/ai/explain-trend` | JWT |
| POST | `/api/ai/market-report` | JWT |
| POST | `/api/ai/chat` | JWT |
| GET | `/api/admin/users` | admin |
| GET | `/api/admin/products` | admin |
| GET | `/api/admin/analytics` | admin |

Responses use `{ success, data }` or `{ success: false, message }`.

## Screenshots

Add product screenshots here after running the app locally.

## Future improvements

- Email delivery for triggered price alerts
- Deeper regional heatmaps
- Seller competition scoring from more than a catalog label
- Pagination on large product lists
