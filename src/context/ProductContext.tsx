import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { Producto } from '../types';
import apiClient from '../services/api';

interface ProductContextType {
  productos: Producto[];
  cargando: boolean;
  actualizarStockProducto: (productoId: number, cantidadARestar: number) => Promise<boolean>;
  restaurarStockProducto: (productoId: number, cantidadARestaurar: number) => Promise<void>;
  actualizarProductoCompleto: (productoActualizado: Producto) => void;
  recargarProductos: () => Promise<void>;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

// eslint-disable-next-line react-refresh/only-export-components
export function useProductContext() {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProductContext debe ser usado dentro de un ProductProvider');
  }
  return context;
}

export function ProductProvider({ children }: { children: ReactNode }) {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [cargando, setCargando] = useState(true);

  // Función para cargar productos desde la API
  const cargarProductos = async () => {
    try {
      setCargando(true);
      const response = await apiClient.get('/productos');
      setProductos(response.data);
    } catch (error) {
      console.error("Error al cargar productos:", error);
    } finally {
      setCargando(false);
    }
  };

  // Cargar productos al montar el componente
  useEffect(() => {
    cargarProductos();
  }, []);

  // Función pública para recargar productos
  const recargarProductos = async () => {
    await cargarProductos();
  };

  // Actualizar stock (descontar)
  const actualizarStockProducto = async (productoId: number, cantidadARestar: number): Promise<boolean> => {
    try {
      const producto = productos.find(p => p.id === productoId);
      if (!producto) {
        console.error("Producto no encontrado");
        return false;
      }

      if (producto.stock < cantidadARestar) {
        console.error("Stock insuficiente");
        return false;
      }

      // Llamar al endpoint de descontar stock
      await apiClient.post(`/productos/${productoId}/descontar-stock`, {
        cantidad: cantidadARestar
      });

      // Actualizar el estado local
      setProductos(prevProductos =>
        prevProductos.map(p =>
          p.id === productoId ? { ...p, stock: p.stock - cantidadARestar } : p
        )
      );

      return true;
    } catch (error) {
      console.error("Error al actualizar stock:", error);
      return false;
    }
  };

  // Restaurar stock
  const restaurarStockProducto = async (productoId: number, cantidadARestaurar: number) => {
    try {
      // Llamar al endpoint de restaurar stock
      await apiClient.post(`/productos/${productoId}/restaurar-stock`, {
        cantidad: cantidadARestaurar
      });

      // Actualizar el estado local
      setProductos(prevProductos =>
        prevProductos.map(p =>
          p.id === productoId ? { ...p, stock: p.stock + cantidadARestaurar } : p
        )
      );
    } catch (error) {
      console.error("Error al restaurar stock:", error);
    }
  };

  // Actualizar producto completo
  const actualizarProductoCompleto = (productoActualizado: Producto) => {
    setProductos(prevProductos =>
      prevProductos.map(p =>
        p.id === productoActualizado.id ? productoActualizado : p
      )
    );
  };

  return (
    <ProductContext.Provider
      value={{
        productos,
        cargando,
        actualizarStockProducto,
        restaurarStockProducto,
        actualizarProductoCompleto,
        recargarProductos
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}