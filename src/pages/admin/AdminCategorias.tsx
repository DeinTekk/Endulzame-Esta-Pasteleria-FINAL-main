import { useState, useEffect } from 'react';
import { api } from '../../services/mockApi';
import { useNotification } from '../../context/NotificationContext';

export default function AdminCategorias() {
    const [categorias, setCategorias] = useState<string[]>([]);
    const [cargando, setCargando] = useState(true);
    const [nuevaCategoria, setNuevaCategoria] = useState('');
    const [categoriaEditando, setCategoriaEditando] = useState<string | null>(null);
    const [nombreEditado, setNombreEditado] = useState('');
    const { showNotification } = useNotification();

    useEffect(() => {
        cargarCategorias();
    }, []);

    const cargarCategorias = () => {
        setCargando(true);
        api.getCategoriasUnicas()
            .then(data => {
                setCategorias(data);
                setCargando(false);
            })
            .catch(err => {
                console.error("Error al cargar categorías:", err);
                setCargando(false);
            });
    };

    const handleAgregarCategoria = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!nuevaCategoria.trim()) {
            showNotification('El nombre de la categoría no puede estar vacío.', 'error');
            return;
        }

        if (categorias.some(cat => cat.toLowerCase() === nuevaCategoria.trim().toLowerCase())) {
            showNotification('Esta categoría ya existe.', 'error');
            return;
        }

        // Agregar la categoría creando un producto temporal invisible
        try {
            const productos = await api.getProductos();
            const maxId = Math.max(...productos.map(p => p.id), 0);
            
            await api.createProducto({
                id: maxId + 1,
                nombre: `Producto temporal - ${nuevaCategoria}`,
                precio: 0,
                categoria: nuevaCategoria.trim(),
                imagen: 'img/placeholder.jpg',
                descripcion: 'Producto temporal para crear categoría',
                stock: 0,
                origen: 'Chile',
                unidad: 'unidad',
                stockCritico: null,
                resenas: [],
                eliminado: true // Marcado como eliminado para que no aparezca en el catálogo
            });

            showNotification('Categoría agregada exitosamente.', 'success');
            setNuevaCategoria('');
            cargarCategorias();
        } catch (error) {
            console.error('Error al agregar categoría:', error);
            showNotification('Error al agregar la categoría.', 'error');
        }
    };

    const handleEditarCategoria = (categoria: string) => {
        setCategoriaEditando(categoria);
        setNombreEditado(categoria);
    };

    const handleGuardarEdicion = async () => {
        if (!nombreEditado.trim()) {
            showNotification('El nombre de la categoría no puede estar vacío.', 'error');
            return;
        }

        if (nombreEditado.trim() === categoriaEditando) {
            setCategoriaEditando(null);
            return;
        }

        if (categorias.some(cat => cat.toLowerCase() === nombreEditado.trim().toLowerCase())) {
            showNotification('Ya existe una categoría con ese nombre.', 'error');
            return;
        }

        try {
            // Obtener todos los productos (incluidos eliminados) para actualizar la categoría
            const productosRaw = localStorage.getItem('productos');
            if (!productosRaw) return;
            
            const productos = JSON.parse(productosRaw);
            const productosActualizados = productos.map((p: any) => {
                if (p.categoria === categoriaEditando) {
                    return { ...p, categoria: nombreEditado.trim() };
                }
                return p;
            });

            localStorage.setItem('productos', JSON.stringify(productosActualizados));
            
            showNotification('Categoría actualizada exitosamente.', 'success');
            setCategoriaEditando(null);
            cargarCategorias();
        } catch (error) {
            console.error('Error al editar categoría:', error);
            showNotification('Error al editar la categoría.', 'error');
        }
    };

    const handleEliminarCategoria = async (categoria: string) => {
        if (!window.confirm(`¿Estás seguro de eliminar la categoría "${categoria}"? Todos los productos de esta categoría quedarán sin categoría.`)) {
            return;
        }

        try {
            // Obtener todos los productos (incluidos eliminados)
            const productosRaw = localStorage.getItem('productos');
            if (!productosRaw) return;
            
            const productos = JSON.parse(productosRaw);
            const productosActualizados = productos.map((p: any) => {
                if (p.categoria === categoria) {
                    return { ...p, categoria: 'Sin categoría' };
                }
                return p;
            });

            localStorage.setItem('productos', JSON.stringify(productosActualizados));
            
            showNotification('Categoría eliminada exitosamente.', 'success');
            cargarCategorias();
        } catch (error) {
            console.error('Error al eliminar categoría:', error);
            showNotification('Error al eliminar la categoría.', 'error');
        }
    };

    const handleCancelarEdicion = () => {
        setCategoriaEditando(null);
        setNombreEditado('');
    };

    return (
        <div className="container-fluid">
            <header className="pb-3 mb-4 border-bottom">
                <h1 className="h2 texto-secundario">Gestión de Categorías</h1>
            </header>

            {/* Formulario para agregar nueva categoría */}
            <div className="card shadow-sm mb-4">
                <div className="card-header">
                    <h5 className="mb-0">Agregar Nueva Categoría</h5>
                </div>
                <div className="card-body">
                    <form onSubmit={handleAgregarCategoria} className="row g-3 align-items-end">
                        <div className="col-md-8">
                            <label htmlFor="nuevaCategoria" className="form-label">Nombre de la categoría</label>
                            <input
                                type="text"
                                className="form-control"
                                id="nuevaCategoria"
                                placeholder="Ej: Pasteles, Tortas, Galletas..."
                                value={nuevaCategoria}
                                onChange={(e) => setNuevaCategoria(e.target.value)}
                            />
                        </div>
                        <div className="col-md-4">
                            <button type="submit" className="btn btn-primario w-100">
                                <i className="bi bi-plus-circle me-2"></i>
                                Agregar Categoría
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Lista de categorías existentes */}
            <div className="card shadow-sm">
                <div className="card-header">
                    <h5 className="mb-0">Categorías Existentes</h5>
                </div>

                {cargando ? (
                    <div className="card-body">
                        <p>Cargando categorías...</p>
                    </div>
                ) : (
                    <div className="table-responsive">
                        <table className="table table-hover mb-0">
                            <thead className="bg-light">
                                <tr>
                                    <th>Nombre de la Categoría</th>
                                    <th className="text-end">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {categorias.length === 0 ? (
                                    <tr>
                                        <td colSpan={2} className="text-center text-muted">
                                            No se encontraron categorías.
                                        </td>
                                    </tr>
                                ) : (
                                    categorias.map(cat => (
                                        <tr key={cat}>
                                            <td>
                                                {categoriaEditando === cat ? (
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        value={nombreEditado}
                                                        onChange={(e) => setNombreEditado(e.target.value)}
                                                        autoFocus
                                                    />
                                                ) : (
                                                    <span className="fw-medium">{cat}</span>
                                                )}
                                            </td>
                                            <td className="text-end">
                                                {categoriaEditando === cat ? (
                                                    <>
                                                        <button
                                                            className="btn btn-sm btn-success me-2"
                                                            onClick={handleGuardarEdicion}
                                                        >
                                                            <i className="bi bi-check-lg"></i> Guardar
                                                        </button>
                                                        <button
                                                            className="btn btn-sm btn-secondary"
                                                            onClick={handleCancelarEdicion}
                                                        >
                                                            <i className="bi bi-x-lg"></i> Cancelar
                                                        </button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <button
                                                            className="btn btn-sm btn-warning me-2"
                                                            onClick={() => handleEditarCategoria(cat)}
                                                        >
                                                            <i className="bi bi-pencil"></i> Editar
                                                        </button>
                                                        <button
                                                            className="btn btn-sm btn-danger"
                                                            onClick={() => handleEliminarCategoria(cat)}
                                                        >
                                                            <i className="bi bi-trash"></i> Eliminar
                                                        </button>
                                                    </>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
