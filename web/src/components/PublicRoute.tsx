import { Navigate } from 'react-router-dom';
import { authStore } from '../store/authStore';

export default function PublicRoute({ children }: { children: React.ReactNode }) {
  if (authStore.getToken()) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}
