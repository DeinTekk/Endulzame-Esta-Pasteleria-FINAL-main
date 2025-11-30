import { useAuth } from '../context/AuthContext';
import { Navigate, Outlet } from 'react-router-dom';

export default function RutaPrivada() {
  const { usuario } = useAuth();

  if (!usuario) {
    return <Navigate to="/ingreso" replace />;
  }

  return <Outlet />;
}