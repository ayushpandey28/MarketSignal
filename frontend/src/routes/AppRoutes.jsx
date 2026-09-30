import { Route, Routes } from 'react-router-dom';
import Home from '../pages/public/Home.jsx';
import Explore from '../pages/public/Explore.jsx';
import ProductDetails from '../pages/public/ProductDetails.jsx';
import About from '../pages/public/About.jsx';
import HowItWorks from '../pages/public/HowItWorks.jsx';
import Insights from '../pages/public/Insights.jsx';
import Login from '../pages/auth/Login.jsx';
import Register from '../pages/auth/Register.jsx';
import ForgotPassword from '../pages/auth/ForgotPassword.jsx';
import ConsumerDashboard from '../pages/consumer/ConsumerDashboard.jsx';
import Wishlist from '../pages/consumer/Wishlist.jsx';
import PriceAlerts from '../pages/consumer/PriceAlerts.jsx';
import MyInterests from '../pages/consumer/MyInterests.jsx';
import Profile from '../pages/consumer/Profile.jsx';
import SellerDashboard from '../pages/seller/SellerDashboard.jsx';
import Opportunities from '../pages/seller/Opportunities.jsx';
import Inventory from '../pages/seller/Inventory.jsx';
import SellerProducts from '../pages/seller/SellerProducts.jsx';
import SellerAnalytics from '../pages/seller/SellerAnalytics.jsx';
import AdminDashboard from '../pages/admin/AdminDashboard.jsx';
import Users from '../pages/admin/Users.jsx';
import Products from '../pages/admin/Products.jsx';
import Categories from '../pages/admin/Categories.jsx';
import Analytics from '../pages/admin/Analytics.jsx';
import ProtectedRoute from '../components/common/ProtectedRoute.jsx';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/explore" element={<Explore />} />
      <Route path="/products/:id" element={<ProductDetails />} />
      <Route path="/about" element={<About />} />
      <Route path="/how-it-works" element={<HowItWorks />} />
      <Route path="/insights" element={<Insights />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      <Route path="/app" element={<ProtectedRoute roles={['consumer', 'admin']}><ConsumerDashboard /></ProtectedRoute>} />
      <Route path="/app/wishlist" element={<ProtectedRoute roles={['consumer', 'admin']}><Wishlist /></ProtectedRoute>} />
      <Route path="/app/alerts" element={<ProtectedRoute roles={['consumer', 'admin']}><PriceAlerts /></ProtectedRoute>} />
      <Route path="/app/interests" element={<ProtectedRoute roles={['consumer', 'admin']}><MyInterests /></ProtectedRoute>} />
      <Route path="/app/profile" element={<ProtectedRoute roles={['consumer', 'seller', 'admin']}><Profile /></ProtectedRoute>} />

      <Route path="/seller" element={<ProtectedRoute roles={['seller', 'admin']}><SellerDashboard /></ProtectedRoute>} />
      <Route path="/seller/opportunities" element={<ProtectedRoute roles={['seller', 'admin']}><Opportunities /></ProtectedRoute>} />
      <Route path="/seller/inventory" element={<ProtectedRoute roles={['seller', 'admin']}><Inventory /></ProtectedRoute>} />
      <Route path="/seller/products" element={<ProtectedRoute roles={['seller', 'admin']}><SellerProducts /></ProtectedRoute>} />
      <Route path="/seller/analytics" element={<ProtectedRoute roles={['seller', 'admin']}><SellerAnalytics /></ProtectedRoute>} />

      <Route path="/admin" element={<ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/users" element={<ProtectedRoute roles={['admin']}><Users /></ProtectedRoute>} />
      <Route path="/admin/products" element={<ProtectedRoute roles={['admin']}><Products /></ProtectedRoute>} />
      <Route path="/admin/categories" element={<ProtectedRoute roles={['admin']}><Categories /></ProtectedRoute>} />
      <Route path="/admin/analytics" element={<ProtectedRoute roles={['admin']}><Analytics /></ProtectedRoute>} />
    </Routes>
  );
}
