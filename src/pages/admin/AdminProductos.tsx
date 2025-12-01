import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../../services/api';
import type { Producto } from '../../types';
import { formatearPrecio } from '../../utils/format';
import { useNotification } from '../../context/NotificationContext';

export default function AdminProductos() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [cargando, setCargando] = useState(true);
  const { showNotification } = useNotification();

  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    try {
      setCargando(true);
      const response = await apiClient.get('/productos');
      setProductos(response.data);
    } catch (error) {
      console.error("Error al cargar productos:", error);
      showNotification('Error al cargar productos.', 'error');
    } finally {
      setCargando(false);
    }
  };

  const handleEliminar = async (id: number) => {
    const producto = productos.find(p => p.id === id);
    if (window.confirm(`¿Estás seguro de que quieres eliminar "${producto?.nombre}"?`)) {
      try {
        await apiClient.delete(`/productos/${id}`);
        showNotification('Producto eliminado correctamente.', 'success');
        cargarProductos();
      } catch (error) {
        console.error("Error al eliminar producto:", error);
        showNotification('Error al eliminar el producto.', 'error');
      }
    }
  };

  if (cargando) {
    return (
      <div className="container-fluid text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando productos...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      <header className="d-flex justify-content-between align-items-center pb-3 mb-4 border-bottom">
        <h1 className="h2 texto-secundario">Gestión de Productos</h1>
        <Link to="/admin/productos/nuevo" className="btn btn-primario">
          <i className="bi bi-plus-circle me-2"></i> Nuevo Producto
        </Link>
      </header>

      <div className="table-responsive">
        <table className="table table-hover shadow-sm">
          <thead className="bg-light">
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Categoría</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center text-muted py-4">
                  No hay productos registrados. Haz clic en "Nuevo Producto" para agregar uno.
                </td>
              </tr>
            ) : (
              productos.map(producto => {
                const stockBajo = producto.stock < 10;
                const sinStock = producto.stock === 0;

                return (
                  <tr key={producto.id}>
                    <td>{producto.id}</td>
                    <td>
                      <div className="d-flex align-items-center">
                        {producto.imagen && (
                          <img
                            src={producto.imagen}
                            alt={producto.nombre}
                            className="rounded me-2"
                            style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                          />
                        )}
                        <div>
                          <div>{producto.nombre}</div>
                          {producto.descripcion && (
                            <small className="text-muted">{producto.descripcion.substring(0, 50)}...</small>
                          )}
                        </div>
                      </div>
                    </td>
                    <td>{formatearPrecio(producto.precio)}</td>
                    <td>
                      <span className={`badge ${sinStock ? 'bg-danger' : stockBajo ? 'bg-warning' : 'bg-success'}`}>
                        {producto.stock} unidades
                      </span>
                    </td>
                    <td>{producto.categoria || 'Sin categoría'}</td>
                    <td>
                      {producto.eliminado ? (
                        <span className="badge bg-secondary">Eliminado</span>
                      ) : (
                        <span className="badge bg-success">Activo</span>
                      )}
                    </td>
                    <td>
                      <div className="btn-group" role="group">
                        <Link
                          to={`/admin/productos/editar/${producto.id}`}
                          className="btn btn-sm btn-warning"
                          title="Editar producto"
                        >
                          <i className="bi bi-pencil"></i>
                        </Link>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleEliminar(producto.id)}
                          title="Eliminar producto"
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {productos.length > 0 && (
        <div className="alert alert-info mt-3">
          <i className="bi bi-info-circle me-2"></i>
          <strong>Total de productos:</strong> {productos.length}
        </div>
      )}
    </div>
  );
}