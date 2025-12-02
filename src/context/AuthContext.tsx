import { createContext, useState, useEffect, useContext } from 'react';
// CORRECCIÓN PRINCIPAL: Importar ReactNode explícitamente como 'type'
import type { ReactNode } from 'react'; 
import { api, authAPI } from '../services/api';
import type { Usuario } from '../types';

// Interfaces para los datos de entrada
interface AuthLoginData {
  correo: string;
  contrasena: string;
}

interface AuthRegistroData {
  rut: string;
  nombre: string;
  apellidos?: string;
  correo: string;
  contrasena: string;
  region?: string;
  comuna?: string;
  direccion?: string;
}

// Interfaz del Contexto
interface AuthContextType {
  usuario: Usuario | null;
  login: (correo: string, contrasena: string) => Promise<void>;
  register: (data: AuthRegistroData) => Promise<void>;
  logout: () => void;
  updateUser: (usuario: Partial<Usuario>) => Promise<void>;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Interfaz para las props del Provider
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const { data } = await api.get('/usuarios/perfil');
          setUsuario(data);
        } catch (error) {
          console.error('Error de sesión:', error);
          logout();
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  const login = async (correo: string, contrasena: string) => {
    try {
      const response = await authAPI.login({ correo, contrasena });
      const { token, ...userData } = response.data;
      
      localStorage.setItem('token', token);
      
      // Aseguramos que el objeto cumpla con la interfaz Usuario
      const usuarioLogueado: Usuario = {
        id: userData.id,
        rut: userData.rut,
        nombre: userData.nombre,
        apellidos: userData.apellidos,
        correo: userData.correo,
        contrasena: "", 
        esAdmin: userData.esAdmin,
        esVendedor: userData.esVendedor,
        puntos: userData.puntos,
        region: userData.region,
        comuna: userData.comuna,
        direccion: userData.direccion
      };
      
      setUsuario(usuarioLogueado);
    } catch (error: any) {
      throw new Error(error.response?.data?.mensaje || 'Error al iniciar sesión');
    }
  };

  const register = async (data: AuthRegistroData) => {
    try {
      const response = await authAPI.register(data);
      const { token } = response.data;
      
      localStorage.setItem('token', token);
      
      const perfilResponse = await api.get('/usuarios/perfil');
      setUsuario(perfilResponse.data);
    } catch (error: any) {
      throw new Error(error.response?.data?.mensaje || 'Error al registrar usuario');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUsuario(null);
  };

  const updateUser = async (datos: Partial<Usuario>) => {
    try {
      const { data } = await api.put('/usuarios/perfil', datos);
      if (data.usuario) {
        setUsuario(data.usuario);
      }
    } catch (error) {
      console.error("Error actualizando perfil", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      usuario, 
      login, 
      register, 
      logout, 
      updateUser,
      isAuthenticated: !!usuario, 
      loading 
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};