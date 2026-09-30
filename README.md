# MarketSignal 📊

## What Are People About to Buy?

MarketSignal is a full-stack consumer demand intelligence platform that identifies emerging product demand using consumer activity such as searches, product views, wishlists, price alerts, and interest requests.

The platform converts these early consumer signals into a measurable Demand Score, growth percentage, and market trend that can be useful for consumers, sellers, and administrators.

---

## 🚀 Features

### 👤 Consumer Features

- User registration and login
- Secure authentication using JWT
- Browse products
- Search products
- Filter products by category and region
- View detailed product information
- Add products to wishlist
- Create price alerts
- Show interest in products
- View personal interests
- View regional demand
- View category demand
- View product demand trends
- Ask AI for product and market insights
- Manage user profile

---

### 🏪 Seller Features

- Seller registration and login
- Seller dashboard
- View high-demand products
- Market opportunity insights
- Inventory management
- Seller product management
- Demand analytics
- Regional demand analysis
- Category-wise demand analysis
- Product demand trends
- View demand growth
- Ask AI for market insights

---

### 🛠️ Admin Features

- Admin dashboard
- Manage users
- Manage products
- Manage categories
- View platform analytics
- Monitor demand signals
- Manage platform data

---

## 🤖 AI Features

MarketSignal integrates Google Gemini through the backend for optional AI-powered analysis.

AI can be used for:

- Product demand explanations
- Market insights
- Trend explanations
- Seller opportunity analysis
- Consumer questions
- Market reports

AI is an additional analysis layer and is not responsible for calculating the core Demand Score.

The core application continues to work even when the AI service is unavailable.

---

# 📈 Demand Signal System

MarketSignal uses different consumer activities as demand signals.

| Signal | Weight |
|--------|-------:|
| Search | 1 |
| Product View | 2 |
| Wishlist | 4 |
| Price Alert | 5 |
| Interest | 7 |

### Demand Score Formula

```text
Demand Score =
(Search × 1)
+ (Views × 2)
+ (Wishlists × 4)
+ (Price Alerts × 5)
+ (Interests × 7)
```

Actions with stronger consumer intent receive higher weights.

For example:

```text
100 Searches
50 Views
20 Wishlists
10 Price Alerts
5 Interests

Demand Score =
(100 × 1)
+ (50 × 2)
+ (20 × 4)
+ (10 × 5)
+ (5 × 7)

Demand Score = 480
```

---

# 📊 Growth Calculation

MarketSignal compares current demand with previous demand.

```text
Growth % =
((Current Demand - Previous Demand) / Previous Demand) × 100
```

The system handles cases where previous demand is zero separately to prevent invalid values such as:

```text
NaN
Infinity
```

---

# 📈 Trend Classification

MarketSignal classifies product trends based on demand growth.

```text
Growth >= 25%
        ↓
     Rising

-25% to +25%
        ↓
     Stable

Growth <= -25%
        ↓
   Declining
```

This helps users understand whether demand for a product is increasing, stable, or decreasing.

---

# 🧠 How MarketSignal Works

```text
                    Consumer Activity
                           │
          ┌────────────────┼────────────────┐
          │                │                │
       Searches          Views          Wishlists
          │                │                │
          └────────────────┼────────────────┘
                           │
                     Price Alerts
                           │
                        Interests
                           │
                           ▼
                  Demand Signal Engine
                           │
                           ▼
                    Demand Score
                           │
              ┌────────────┴────────────┐
              │                         │
        Growth Analysis          Trend Analysis
              │                         │
              └────────────┬────────────┘
                           │
                           ▼
                 Market Intelligence
                           │
             ┌─────────────┼─────────────┐
             │             │             │
          Consumer       Seller        Admin
           Insights     Insights      Analytics
                           │
                           ▼
                      Gemini AI
                  Optional AI Layer
```

---

# 🏗️ Technology Stack

## Frontend

- React.js
- Vite
- React Router
- Axios
- Tailwind CSS
- Recharts
- JavaScript

## Backend

- Node.js
- Express.js
- MongoDB
- MongoDB Atlas
- Mongoose
- JWT
- bcrypt
- Multer

## AI

- Google Gemini API
- Backend-only AI integration
- Configurable Gemini model
- AI fallback support

## Development Tools

- VS Code
- Git
- GitHub
- MongoDB Atlas
- Vercel

---

# 📁 Project Structure

```text
MarketSignal/
│
├── .gitignore
├── README.md
│
├── backend/
│   ├── .env
│   ├── .env.example
│   ├── package.json
│   │
│   └── src/
│       ├── app.js
│       ├── server.js
│       │
│       ├── config/
│       │   ├── db.js
│       │   └── xai.js
│       │
│       ├── controllers/
│       │   ├── adminController.js
│       │   ├── aiController.js
│       │   ├── alertController.js
│       │   ├── authController.js
│       │   ├── demandController.js
│       │   ├── productController.js
│       │   ├── sellerController.js
│       │   ├── signalController.js
│       │   └── wishlistController.js
│       │
│       ├── middleware/
│       │   ├── authMiddleware.js
│       │   ├── errorMiddleware.js
│       │   ├── roleMiddleware.js
│       │   └── uploadMiddleware.js
│       │
│       ├── models/
│       │   ├── AIReport.js
│       │   ├── DemandSignal.js
│       │   ├── Inventory.js
│       │   ├── PriceAlert.js
│       │   ├── Product.js
│       │   ├── Seller.js
│       │   ├── Signal.js
│       │   ├── User.js
│       │   └── Wishlist.js
│       │
│       ├── routes/
│       │   ├── adminRoutes.js
│       │   ├── aiRoutes.js
│       │   ├── alertRoutes.js
│       │   ├── authRoutes.js
│       │   ├── demandRoutes.js
│       │   ├── productRoutes.js
│       │   ├── sellerRoutes.js
│       │   ├── signalRoutes.js
│       │   └── wishlistRoutes.js
│       │
│       ├── seed/
│       │   ├── seed.js
│       │   ├── seedCategories.js
│       │   └── seedProducts.js
│       │
│       ├── services/
│       │   ├── demandEngine.js
│       │   ├── grokService.js
│       │   ├── marketAnalytics.js
│       │   └── trendEngine.js
│       │
│       └── utils/
│           ├── calculateDemandScore.js
│           ├── calculateGrowth.js
│           └── generateToken.js
│
└── frontend/
    ├── .env
    ├── .env.example
    ├── index.html
    ├── package.json
    ├── postcss.config.js
    ├── tailwind.config.js
    ├── vite.config.js
    │
    └── src/
        ├── App.jsx
        ├── index.css
        ├── main.jsx
        │
        ├── assets/
        │   ├── icons/
        │   └── images/
        │
        ├── components/
        │   ├── ai/
        │   ├── alerts/
        │   ├── auth/
        │   ├── charts/
        │   ├── common/
        │   ├── demand/
        │   ├── products/
        │   ├── seller/
        │   └── wishlist/
        │
        ├── context/
        │   ├── AppContext.jsx
        │   └── AuthContext.jsx
        │
        ├── hooks/
        │   ├── useAuth.js
        │   ├── useDebounce.js
        │   └── useFetch.js
        │
        ├── pages/
        │   ├── admin/
        │   ├── auth/
        │   ├── consumer/
        │   ├── public/
        │   └── seller/
        │
        ├── routes/
        │   └── AppRoutes.jsx
        │
        ├── services/
        │   ├── aiService.js
        │   ├── alertService.js
        │   ├── api.js
        │   ├── authService.js
        │   ├── demandService.js
        │   ├── productService.js
        │   ├── sellerService.js
        │   └── wishlistService.js
        │
        └── utils/
            ├── calculateGrowth.js
            ├── formatDate.js
            └── formatPrice.js
```

---

# ⚙️ Installation & Setup

## 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/MarketSignal.git
cd MarketSignal
```

---

# 2. Backend Setup

Open the backend folder:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file inside the backend folder.

Example:

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

GEMINI_API_KEY=your_gemini_api_key

GEMINI_MODEL=your_available_gemini_model
```

Start the backend:

```bash
npm run dev
```

Backend:

```text
http://localhost:5000
```

---

# 3. Frontend Setup

Open another terminal.

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Create:

```text
frontend/.env
```

Example:

```env
VITE_API_URL=http://localhost:5000/api/v1
```

Start the frontend:

```bash
npm run dev
```

Frontend will normally run on:

```text
http://localhost:5173
```

---

# 🔐 Environment Variables

Do not commit real environment variables to GitHub.

The project uses `.gitignore` to ignore:

```text
.env
```

Example environment files should contain placeholders only:

```text
backend/.env.example
frontend/.env.example
```

Never expose:

- MongoDB connection credentials
- JWT secret
- Gemini API key
- Private API keys
- Passwords
- Authentication secrets

Gemini API requests are handled by the backend.

The frontend should never contain the Gemini API key.

---

# 👥 User Roles

MarketSignal supports three main user roles.

## Consumer

Consumers interact with products and generate demand signals.

```text
Search
   ↓
Product View
   ↓
Wishlist
   ↓
Price Alert
   ↓
Interest
```

These activities contribute to the product's Demand Score.

---

## Seller

Sellers can use MarketSignal to understand product demand and market opportunities.

Seller features include:

- Demand signals
- Trending products
- Regional demand
- Category demand
- Growth information
- Inventory management
- Market opportunities
- AI market analysis

---

## Admin

Administrators can manage and monitor the platform.

Admin features include:

- User management
- Product management
- Category management
- Platform analytics
- Demand monitoring

---

# 🌍 Regional Demand

MarketSignal supports regional demand analysis.

The system can analyze demand based on:

```text
Country / Region
       ↓
Category
       ↓
Product
       ↓
Consumer Signals
       ↓
Demand Score
```

This allows sellers and administrators to understand where consumer interest is increasing.

---

# 📊 Analytics

MarketSignal uses charts and visualizations to display market information.

Analytics include:

- Demand trends
- Regional demand
- Category demand
- Growth percentage
- Product demand
- Seller statistics
- Market opportunities

Charts are implemented using Recharts.

---

# 🤖 AI Architecture

AI is separated from the core demand calculation system.

```text
User
 │
 ▼
Frontend
 │
 ▼
Backend API
 │
 ▼
Gemini Service
 │
 ▼
Gemini API
```

AI is optional.

If the Gemini API is unavailable:

```text
AI unavailable
      │
      ▼
Core application continues
      │
      ├── Authentication
      ├── Products
      ├── Wishlist
      ├── Price Alerts
      ├── Demand Score
      ├── Analytics
      └── Seller Features
```

This makes the application less dependent on external AI services.

---

# 🛡️ Security

MarketSignal implements basic application security practices including:

- JWT authentication
- Password hashing using bcrypt
- Protected routes
- Role-based authorization
- Environment variables
- Backend-only API keys
- Error handling middleware
- Authentication middleware
- Input validation

---

# 🧪 Development Commands

## Backend

```bash
cd backend
npm install
npm run dev
```

## Frontend

```bash
cd frontend
npm install
npm run dev
```

## Production Build

```bash
cd frontend
npm run build
```

---

# 🎯 Project Objective

The main objective of MarketSignal is to identify early consumer demand signals before they become obvious through traditional sales data.

The platform follows this basic flow:

```text
Consumer Searches
        ↓
Product Views
        ↓
Wishlists
        ↓
Price Alerts
        ↓
Interest Requests
        ↓
Demand Score
        ↓
Growth Analysis
        ↓
Trend Detection
        ↓
Market Intelligence
```

The resulting information can help users understand which products are receiving increasing consumer attention.

---

# 💡 Example

Suppose a product receives the following activity:

```text
Searches       = 100
Views          = 50
Wishlists      = 20
Price Alerts   = 10
Interests      = 5
```

The Demand Score becomes:

```text
(100 × 1)
+ (50 × 2)
+ (20 × 4)
+ (10 × 5)
+ (5 × 7)

= 480
```

This score represents the weighted consumer activity for that product.

It should be treated as a demand signal rather than a guaranteed prediction of future sales.

---

# 🔮 Future Improvements

Possible future improvements include:

- Real-time market data integration
- Advanced demand forecasting
- Time-series forecasting
- Personalized recommendations
- Seller inventory recommendations
- Email price alerts
- Push notifications
- Advanced regional analytics
- Product comparison
- Mobile application
- Advanced anomaly detection
- Improved AI market reports

---

# 📚 Learning Outcomes

This project provides practical experience with:

- Full-stack development
- React.js
- JavaScript
- Node.js
- Express.js
- REST APIs
- MongoDB
- Mongoose
- JWT authentication
- bcrypt
- CRUD operations
- Role-based authorization
- Demand scoring algorithms
- Data visualization
- AI API integration
- Gemini API
- Environment variables
- Git
- GitHub
- Responsive UI development
- Frontend-backend integration

---

# 👨‍💻 Author

## Ayush Pandey

B.Tech Computer Science & Engineering

### Technologies

```text
C++
JavaScript
React.js
Node.js
Express.js
MongoDB
REST APIs
Git
GitHub
AI Integration
```

---

# ⭐ Project

If you find MarketSignal useful or interesting, consider giving the repository a star ⭐.

---

## 📌 Disclaimer

MarketSignal is a student/development project designed to demonstrate consumer demand intelligence using activity-based signals.

Demand scores and trends are analytical indicators and should not be interpreted as guaranteed sales predictions or financial advice.
