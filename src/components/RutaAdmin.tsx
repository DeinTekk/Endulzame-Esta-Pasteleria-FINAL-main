import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function RutaAdmin() {
  const { usuarioActual } = useAuth();

  if (!usuarioActual) {
    return <Navigate to="/ingreso" replace />;
  }

  if (!usuarioActual.esAdmin) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

export default RutaAdmin;
