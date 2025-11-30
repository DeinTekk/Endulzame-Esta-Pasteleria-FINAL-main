import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Usuario } from '../types';
import { authAPI } from '../services/api';

interface AuthContextType {
  usuario: Usuario | null;
  login: (correo: string, contrasena: string) => Promise<void>;
  register: (userData: {
    rut: string;
    nombre: string;
    apellidos: string;
    correo: string;
    contrasena: string;
    region: string;
    comuna: string;
    direccion?: string;
  }) => Promise<void>;
  updateUser: (usuario: Usuario) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const usuarioGuardado = localStorage.getItem('usuario');
    
    if (token && usuarioGuardado && usuarioGuardado !== 'undefined') {
      try {
        setUsuario(JSON.parse(usuarioGuardado));
      } catch (error) {
        console.error('Error al parsear usuario:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
      }
    }
  }, []);

  const login = async (correo: string, contrasena: string) => {
    try {
      const response = await authAPI.login({ correo, contrasena });
      const { token, mensaje, tipo, ...usuarioData } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('usuario', JSON.stringify(usuarioData));
      setUsuario(usuarioData as Usuario);
    } catch (error: any) {
      throw new Error(error.response?.data?.mensaje || 'Error al iniciar sesión');
    }
  };

  const register = async (userData: any) => {
    try {
      const response = await authAPI.register(userData);
      const { token, mensaje, tipo, ...usuarioData } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('usuario', JSON.stringify(usuarioData));
      setUsuario(usuarioData as Usuario);
    } catch (error: any) {
      throw new Error(error.response?.data?.mensaje || 'Error al registrar usuario');
    }
  };

  const updateUser = (usuarioActualizado: Usuario) => {
    localStorage.setItem('usuario', JSON.stringify(usuarioActualizado));
    setUsuario(usuarioActualizado);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    setUsuario(null);
  };

  return (
    <AuthContext.Provider
      value={{
        usuario,
        login,
        register,
        updateUser,
        logout,
        isAuthenticated: !!usuario,
      }}
    >
      {children}
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
