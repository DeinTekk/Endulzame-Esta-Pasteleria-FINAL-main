import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import type { Producto } from '../../types';
import { formatearPrecio } from '../../utils/format';
import { useNotification } from '../../context/NotificationContext';

const API_URL = 'http://localhost:8080/api';

const productoVacio: Partial<Producto> = {
  nombre: '',
  descripcion: '',
  precio: 0,
  stock: 0,
  categoria: '',
  imagen: ''
};

export default function FormularioProducto() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const esModoEdicion = Boolean(id);
  const { showNotification } = useNotification();

  const [producto, setProducto] = useState<Partial<Producto>>(productoVacio);
  const [categorias, setCategorias] = useState<string[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    cargarDatos();
  }, [id]);

  const cargarDatos = async () => {
    try {
      setCargando(true);

      // Cargar categorías
      const responseCategorias = await axios.get(`${API_URL}/productos/categorias`);
      setCategorias(responseCategorias.data);

      // Si es modo edición, cargar el producto
      if (esModoEdicion && id) {
        const responseProducto = await axios.get(`${API_URL}/productos/${id}`);
        setProducto(responseProducto.data);
      } else {
        setProducto(productoVacio);
      }
    } catch (error) {
      console.error("Error al cargar datos:", error);
      showNotification('Error al cargar los datos.', 'error');
    } finally {
      setCargando(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    const valor = type === 'number' ? Number(value) : value;

    setProducto(prev => ({
      ...prev,
      [name]: valor
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validaciones
    if (!producto.nombre || producto.nombre.trim().length < 3) {
      showNotification("El nombre debe tener al menos 3 caracteres.", 'error');
      return;
    }
    if (!producto.categoria) {
      showNotification("La categoría es requerida.", 'error');
      return;
    }
    if (!producto.precio || producto.precio <= 0) {
      showNotification("El precio debe ser mayor a 0.", 'error');
      return;
    }
    if (producto.stock === undefined || producto.stock < 0) {
      showNotification("El stock no puede ser negativo.", 'error');
      return;
    }

    try {
      const productoFinal = {
        ...producto,
        nombre: producto.nombre.trim(),
        descripcion: producto.descripcion?.trim() || '',
        precio: Number(producto.precio),
        stock: Number(producto.stock),
        categoria: producto.categoria,
        imagen: producto.imagen || 'https://via.placeholder.com/400x300?text=Sin+Imagen'
      };

      if (esModoEdicion && id) {
        // Actualizar producto existente
        await axios.put(`${API_URL}/productos/${id}`, productoFinal);
        showNotification('¡Producto actualizado correctamente!', 'success');
      } else {
        // Crear nuevo producto
        await axios.post(`${API_URL}/productos`, productoFinal);
        showNotification('¡Producto creado correctamente!', 'success');
      }

      navigate('/admin/productos');
    } catch (error) {
      console.error("Error al guardar producto:", error);
      showNotification('Error al guardar el producto.', 'error');
    }
  };

  if (cargando) {
    return (
      <div className="container-fluid text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      <header className="d-flex justify-content-between align-items-center pb-3 mb-4 border-bottom">
        <h1 className="h2 texto-secundario">
          {esModoEdicion ? 'Editar Producto' : 'Crear Nuevo Producto'}
        </h1>
        <Link to="/admin/productos" className="btn btn-secundario">
          <i className="bi bi-arrow-left me-1"></i> Volver a la lista
        </Link>
      </header>

      <div className="card shadow-sm">
        <div className="card-body">
          <form onSubmit={handleSubmit} noValidate>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label htmlFor="nombre" className="form-label">Nombre del Producto *</label>
                <input
                  type="text"
                  className="form-control"
                  id="nombre"
                  name="nombre"
                  value={producto.nombre || ''}
                  onChange={handleChange}
                  required
                  placeholder="Ej: Torta de Chocolate"
                />
              </div>
              <div className="col-md-6 mb-3">
                <label htmlFor="categoria" className="form-label">Categoría *</label>
                <select
                  className="form-select"
                  id="categoria"
                  name="categoria"
                  value={producto.categoria || ''}
                  onChange={handleChange}
                  required
                >
                  <option value="">Seleccionar categoría</option>
                  {categorias.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                  <option value="nueva">+ Agregar nueva categoría</option>
                </select>
                {producto.categoria === 'nueva' && (
                  <input
                    type="text"
                    className="form-control mt-2"
                    placeholder="Nombre de la nueva categoría"
                    onChange={(e) => setProducto(prev => ({ ...prev, categoria: e.target.value }))}
                  />
                )}
              </div>
            </div>

            <div className="mb-3">
              <label htmlFor="descripcion" className="form-label">Descripción</label>
              <textarea
                className="form-control"
                id="descripcion"
                name="descripcion"
                rows={3}
                value={producto.descripcion || ''}
                onChange={handleChange}
                placeholder="Describe el producto..."
              ></textarea>
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label htmlFor="precio" className="form-label">Precio (CLP) *</label>
                <input
                  type="number"
                  className="form-control"
                  id="precio"
                  name="precio"
                  value={producto.precio || 0}
                  onChange={handleChange}
                  required
                  min="0"
                  step="100"
                />
                <small className="text-muted">
                  Precio final: {formatearPrecio(producto.precio || 0)}
                </small>
              </div>
              <div className="col-md-6 mb-3">
                <label htmlFor="stock" className="form-label">Stock (unidades) *</label>
                <input
                  type="number"
                  className="form-control"
                  id="stock"
                  name="stock"
                  value={producto.stock || 0}
                  onChange={handleChange}
                  required
                  min="0"
                />
                {producto.stock !== undefined && producto.stock < 10 && (
                  <small className="text-warning">
                    <i className="bi bi-exclamation-triangle me-1"></i>
                    Stock bajo
                  </small>
                )}
              </div>
            </div>

            <div className="mb-3">
              <label htmlFor="imagen" className="form-label">URL de la Imagen</label>
              <input
                type="text"
                className="form-control"
                id="imagen"
                name="imagen"
                value={producto.imagen || ''}
                onChange={handleChange}
                placeholder="https://ejemplo.com/imagen.jpg"
              />
              {producto.imagen && (
                <div className="mt-2">
                  <img
                    src={producto.imagen}
                    alt="Vista previa"
                    className="img-thumbnail"
                    style={{ maxWidth: '200px', maxHeight: '200px' }}
                    onError={(e) => {
                      e.currentTarget.src = 'https://via.placeholder.com/200x200?text=Error+al+cargar';
                    }}
                  />
                </div>
              )}
            </div>

            <div className="d-flex gap-2 justify-content-end mt-4">
              <Link to="/admin/productos" className="btn btn-secondary">
                Cancelar
              </Link>
              <button type="submit" className="btn btn-primary">
                <i className="bi bi-save me-2"></i>
                {esModoEdicion ? 'Actualizar Producto' : 'Crear Producto'}
              </button>
            </div>

          </form>
        </div>
      </div>

      <div className="alert alert-info mt-3">
        <i className="bi bi-info-circle me-2"></i>
        <strong>Nota:</strong> Los campos marcados con * son obligatorios.
      </div>
    </div>
  );
}
