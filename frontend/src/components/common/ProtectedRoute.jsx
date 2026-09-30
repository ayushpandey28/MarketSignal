import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import Loading from './Loading.jsx';

export default function ProtectedRoute({ children, roles }) {
  const { user, loading } = useAuth();
  if (loading) return <Loading />;
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
}
