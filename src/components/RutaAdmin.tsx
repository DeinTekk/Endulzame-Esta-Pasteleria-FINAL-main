import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function RutaAdmin() {
  const { usuario } = useAuth();

  if (!usuario) {
    return <Navigate to="/ingreso" replace />;
  }

  if (!usuario.esAdmin) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

export default RutaAdmin;
