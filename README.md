# MarketSignal 📊

## What Are People About to Buy?

MarketSignal is a full-stack consumer demand intelligence platform that analyzes user activity to identify emerging product demand.

Instead of relying only on completed sales, MarketSignal uses early consumer signals such as:

- Searches
- Product Views
- Wishlists
- Price Alerts
- Interest Requests

These signals are converted into a **Demand Score**, **Growth Percentage**, and **Trend Classification** to help consumers, sellers, and administrators understand changing product interest..

---

## 🚀 Live Demo

### Frontend
https://market-signal-twentyeight.vercel.app

### Backend API
https://market-signal-backend.vercel.app

### API Health Check
https://market-signal-backend.vercel.app/api/health

### GitHub Repository
https://github.com/ayushpandey28/MarketSignal

---

# ✨ Features

## 👤 Consumer

- User registration and login
- JWT authentication
- Browse products
- Search products
- Filter products by category
- Filter products by region
- View product details
- Add products to wishlist
- Create price alerts
- Show interest in products
- View personal interests
- View regional demand
- View category demand
- View product demand trends
- View demand analytics
- Ask Gemini AI for product and market insights
- Manage profile

---

## 🏪 Seller

- Seller registration and login
- Seller dashboard
- Add products
- Edit products
- Delete products
- Manage product information
- Manage inventory
- View high-demand products
- View trending products
- View demand growth
- View regional demand
- View category demand
- View product demand trends
- View market opportunities
- Ask Gemini AI for market insights

---

## 🛠️ Admin

- Admin dashboard
- Manage users
- Manage products
- Manage categories
- View platform analytics
- Monitor demand signals
- View demand trends
- Manage platform data

---

# 📈 Demand Signal System

MarketSignal uses weighted consumer activities to calculate product demand.

| Consumer Signal | Weight |
|---|---:|
| Search | 1 |
| Product View | 2 |
| Wishlist | 4 |
| Price Alert | 5 |
| Interest | 7 |

## Demand Score

```text
Demand Score =
(Search × 1)
+ (Views × 2)
+ (Wishlists × 4)
+ (Price Alerts × 5)
+ (Interests × 7)

Example
Searches       = 100
Views          = 50
Wishlists      = 20
Price Alerts   = 10
Interests      = 5

Demand Score =
(100 × 1)
+ (50 × 2)
+ (20 × 4)
+ (10 × 5)
+ (5 × 7)

= 480

Higher-intent actions receive higher weights.
📊 Growth Calculation
MarketSignal compares current demand with previous demand.
Growth % =
((Current Demand - Previous Demand) / Previous Demand) × 100

The application handles cases where previous demand is zero separately to avoid invalid values such as:
NaN
Infinity

📈 Trend Classification
Products are classified based on demand growth.
Growth >= 25%
        ↓
     Rising


-25% to +25%
        ↓
     Stable


Growth <= -25%
        ↓
   Declining

This classification helps users understand whether product interest is increasing, stable, or decreasing.
🧠 How MarketSignal Works
Consumer Activity
       │
       ├── Searches
       ├── Product Views
       ├── Wishlists
       ├── Price Alerts
       └── Interest Requests
                │
                ▼
       Demand Signal Engine
                │
                ▼
          Demand Score
                │
        ┌───────┴────────┐
        ▼                ▼
   Growth Analysis   Trend Analysis
        │                │
        └───────┬────────┘
                ▼
       Market Intelligence
          │      │      │
          ▼      ▼      ▼
      Consumer Seller  Admin
       Insights Insights Analytics
                │
                ▼
          Gemini AI
       Optional AI Layer

🤖 AI Features
MarketSignal integrates Google Gemini API through the backend.
Gemini can provide:
- Product demand explanations
- Market insights
- Trend explanations
- Seller opportunity analysis
- Consumer questions
- Market reports
Important
Gemini is an optional analysis layer.
The core Demand Score and Trend calculations are performed by the application's own logic.
Therefore, the main application can continue working even if the Gemini API is unavailable.
🏗️ Technology Stack
Frontend
- React.js
- JavaScript
- Vite
- React Router
- Axios
- Tailwind CSS
- Recharts
Backend
- Node.js
- Express.js
- MongoDB
- MongoDB Atlas
- Mongoose
- JWT
- bcrypt
- Multer
- REST APIs
AI
- Google Gemini API
- Backend-only AI integration
- Configurable Gemini model
- Gemini fallback support
Development & Deployment
- VS Code
- Git
- GitHub
- MongoDB Atlas
- Vercel
🖼️ Image Upload
MarketSignal does not require Cloudinary.
Product images are handled using Multer.
For local development, uploaded images are stored in:
backend/uploads/products/

The backend serves uploaded images through:
/uploads

Example:
/uploads/products/product-123.png

The image path is stored with the product information in MongoDB.
Image Upload Rules
- JPEG allowed
- PNG allowed
- WebP allowed
- Maximum file size: 2 MB
- Image upload is optional
Products can still be created and updated without an image.
Vercel Note
The local filesystem used for uploads is suitable for local development and self-hosted servers.
Vercel serverless filesystems are ephemeral, so locally uploaded files are not guaranteed to persist on Vercel.
The core MarketSignal application does not depend on product images and continues to work without them.
📁 Project Structure
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
│   ├── uploads/
│   │   └── products/
│   │
│   └── src/
│       ├── app.js
│       ├── server.js
│       │
│       ├── config/
│       │   └── db.js
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

⚙️ Installation & Setup
1. Clone Repository
git clone https://github.com/ayushpandey28/MarketSignal.git

cd MarketSignal

2. Backend Setup
Open the backend:
cd backend

Install dependencies:
npm install

Create:
backend/.env

Add:
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

GEMINI_API_KEY=your_gemini_api_key

GEMINI_MODEL=your_available_gemini_model

FRONTEND_URL=http://localhost:5173

Start the backend:
npm run dev

Backend runs at:
http://localhost:5000

Health check:
http://localhost:5000/api/health

3. Frontend Setup
Open another terminal.
cd frontend

Install dependencies:
npm install

Create:
frontend/.env

Add:
VITE_API_URL=http://localhost:5000/api

Start the frontend:
npm run dev

Frontend normally runs at:
http://localhost:5173

If port 5173 is already occupied, Vite may automatically use another port such as:
http://localhost:5174

Make sure the backend CORS configuration allows the frontend origin being used.
🔐 Environment Variables
Never commit real secrets to GitHub.
The project uses:
.env

in .gitignore.
Use:
backend/.env.example
frontend/.env.example

for placeholder values.
Never expose:
- MongoDB connection string
- JWT secret
- Gemini API key
- Passwords
- Authentication secrets
- Other private credentials
The Gemini API key must remain on the backend.
The frontend should never contain:
GEMINI_API_KEY

👥 User Roles
MarketSignal has three primary user roles.
Consumer
Consumers interact with products and generate demand signals.
Search
   ↓
Product View
   ↓
Wishlist
   ↓
Price Alert
   ↓
Interest
   ↓
Demand Score

Seller
Sellers use demand information to understand product interest and market opportunities.
Products
   ↓
Consumer Signals
   ↓
Demand Score
   ↓
Growth
   ↓
Trend
   ↓
Market Opportunity

Admin
Administrators manage and monitor the platform.
Users
Products
Categories
Demand Signals
Analytics

🌍 Regional Demand
MarketSignal supports regional demand analysis.
The system can analyze:
Region
   ↓
Category
   ↓
Product
   ↓
Consumer Signals
   ↓
Demand Score

This allows sellers and administrators to understand where product interest is increasing.
📊 Analytics
MarketSignal provides analytics for:
- Demand trends
- Regional demand
- Category demand
- Product demand
- Growth percentage
- Trending products
- Seller statistics
- Market opportunities
Charts and visualizations are implemented using Recharts.
🤖 AI Architecture
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

Gemini is an optional AI layer.
If Gemini is unavailable, the core application continues to work:
Authentication
Products
Wishlist
Price Alerts
Demand Score
Analytics
Seller Features

🔒 Security
MarketSignal implements basic security practices including:
- JWT authentication
- Password hashing with bcrypt
- Protected routes
- Role-based authorization
- Environment variables
- Backend-only API keys
- Error handling middleware
- Authentication middleware
- Input validation
- CORS configuration
🧪 Development Commands
Backend
cd backend
npm install
npm run dev

Frontend
cd frontend
npm install
npm run dev

Frontend Production Build
cd frontend
npm run build

🎯 Project Objective
The main objective of MarketSignal is to identify early consumer demand signals before they become obvious through traditional sales data.
The application follows:
Consumer Activity
       ↓
Demand Signals
       ↓
Demand Score
       ↓
Growth Analysis
       ↓
Trend Detection
       ↓
Market Intelligence

The platform is designed to help users understand which products are receiving increasing consumer attention.
💡 Example
Suppose a product receives:
Searches       = 100
Views          = 50
Wishlists      = 20
Price Alerts   = 10
Interests      = 5

The Demand Score becomes:
(100 × 1)
+ (50 × 2)
+ (20 × 4)
+ (10 × 5)
+ (5 × 7)

= 480

This score represents weighted consumer activity.
It is a demand signal, not a guaranteed prediction of future sales.
🔮 Future Improvements
Possible future improvements:
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
📚 Learning Outcomes
This project provides practical experience with:
- Full-stack development
- React.js
- JavaScript
- Node.js
- Express.js
- REST APIs
- MongoDB
- MongoDB Atlas
- Mongoose
- JWT authentication
- bcrypt
- CRUD operations
- Role-based authorization
- Demand scoring algorithms
- Data visualization
- Gemini API integration
- Multer file uploads
- Environment variables
- Git
- GitHub
- Vercel
- Responsive UI development
- Frontend-backend integration
👨‍💻 Author
Ayush Pandey
B.Tech Computer Science & Engineering
Tech Stack
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

⭐ Project
If you find MarketSignal useful or interesting, consider giving the repository a star ⭐
GitHub:
https://github.com/ayushpandey28/MarketSignal
📌 Disclaimer
MarketSignal is a student/development project designed to demonstrate consumer demand intelligence using activity-based signals.
Demand scores and trends are analytical indicators and should not be interpreted as guaranteed sales predictions or financial advice.
