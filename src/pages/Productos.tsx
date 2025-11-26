import { useState, useMemo } from 'react';
import type { Producto } from '../types';
import TarjetaProducto from '../components/TarjetaProducto';
import ModalDetalleProducto from '../components/ModalDetalleProducto';
import { useProductContext } from '../context/ProductContext';

const descripcionesCategorias: Record<string, string> = {
    'Todos': 'Explora nuestra amplia selección de postres artesanales y de alta calidad para endulzar tu vida. Endúlzame esta te ofrece una experiencia única, con productos elaborados con los mejores ingredientes y mucho amor, garantizando sabor, frescura y la mejor calidad en cada bocado.',
    'Tortas': 'Deliciosas tortas artesanales para celebrar tus momentos especiales. Nuestra selección de tortas se elabora con ingredientes premium y diseños personalizados para asegurar su sabor, frescura y presentación perfecta. Ideales para cumpleaños, aniversarios o cualquier ocasión especial.',
    'Pasteles': 'Los pasteles más exquisitos y delicados para deleitar tu paladar. Desde clásicos hasta creaciones innovadoras, cada pastel es elaborado con técnicas artesanales, ofreciendo una experiencia de sabor única. Perfectos para acompañar tu café o como postre especial.',
    'Galletas': 'Galletas artesanales crujientes y deliciosas, perfectas para cualquier momento del día. Endúlzame esta te ofrece una variedad de galletas que van desde las tradicionales hasta las más innovadoras, todas horneadas con amor y los mejores ingredientes. Ideales para compartir o disfrutar en solitario.',
    'Postres': 'Postres elaborados de forma artesanal, para una opción más especial y deliciosa. Nuestra selección de postres incluye mousses, tartas y creaciones únicas que garantizan un sabor auténtico y una experiencia memorable. Son la elección perfecta para quienes buscan endulzar momentos especiales con productos de alta calidad.'
};

export default function Productos() {
  const { productos, cargando, actualizarProductoCompleto } = useProductContext();
  
  const [categoriaActual, setCategoriaActual] = useState("Todos");
  const [precioMaximo, setPrecioMaximo] = useState(10000);
  const [consultaBusqueda, setConsultaBusqueda] = useState("");
  const [productoSeleccionado, setProductoSeleccionado] = useState<Producto | null>(null);

  const handleResenaAgregada = (productoActualizado: Producto) => {
    actualizarProductoCompleto(productoActualizado);
    setProductoSeleccionado(productoActualizado);
  };

  const categoriasUnicas = useMemo(() => {
    return ['Todos', ...new Set(productos.map(p => p.categoria))];
  }, [productos]);

  const productosFiltrados = useMemo(() => {
    const consulta = consultaBusqueda.trim().toLowerCase();
    return productos.filter(p => {
      const categoriaOK = (categoriaActual === 'Todos') || (p.categoria === categoriaActual);
      const precioOK = p.precio <= precioMaximo;
      const consultaOK = p.nombre.toLowerCase().includes(consulta) || p.descripcion.toLowerCase().includes(consulta);
      return categoriaOK && precioOK && consultaOK;
    });
  }, [productos, categoriaActual, precioMaximo, consultaBusqueda]);

  return (
    <>
      <main className="container my-5">
        <div className="row">
          
          <aside className="col-lg-3 mb-4">
            <div className="card shadow-sm barra-lateral-fija">
              <div className="card-body">
                <h5 className="card-title">Categorías</h5>
                <ul id="listaCategorias" className="list-group list-group-flush" style={{ cursor: 'pointer' }}>
                  {categoriasUnicas.map(cat => (
                    <li 
                      key={cat}
                      className={`list-group-item list-group-item-action ${cat === categoriaActual ? 'active' : ''}`}
                      onClick={() => setCategoriaActual(cat)}
                    >
                      {cat}
                    </li>
                  ))}
                </ul>
                <hr />
                <h6 style={{ color: 'var(--color-primario)' }}>Filtrar por</h6>
                <div className="mb-3">
                  <label htmlFor="rangoPrecio" className="form-label small">Precio hasta ${precioMaximo.toLocaleString('es-CL')}</label>
                  <input 
                    id="rangoPrecio" 
                    type="range" 
                    className="form-range" 
                    min="0" max="10000" step="500" 
                    value={precioMaximo}
                    onChange={(e) => setPrecioMaximo(Number(e.target.value))}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="campoBusqueda" className="form-label small">Buscar</label>
                  <input 
                    id="campoBusqueda" 
                    className="form-control form-control-sm" 
                    type="search" 
                    placeholder="Buscar productos..."
                    value={consultaBusqueda}
                    onChange={(e) => setConsultaBusqueda(e.target.value)}
                  />
                </div>
                <button 
                  id="limpiarFiltros" 
                  className="btn btn-sm btn-outline-secondary w-100 mt-2"
                  onClick={() => {
                    setCategoriaActual("Todos");
                    setPrecioMaximo(10000);
                    setConsultaBusqueda("");
                  }}
                >
                  Limpiar filtros
                </button>
              </div>
            </div>
          </aside>
          
          <section id="catalogo" className="col-lg-9">
            <div id="descripcionCategoria" className="alert alert-info descripcion-categoria">
              {descripcionesCategorias[categoriaActual] || 'Explora nuestros productos.'}
            </div>
            
            <div className="row" id="contenedorProductos">
              {cargando && <p>Cargando productos...</p>}
              {!cargando && productosFiltrados.length === 0 && (
                <div id="sinResultados" className="text-center text-muted mt-4">
                  No se encontraron productos.
                </div>
              )}
              {!cargando && productosFiltrados.map(p => (
                <TarjetaProducto 
                  key={p.id} 
                  producto={p} 
                  onProductoClick={setProductoSeleccionado}
                />
              ))}
            </div>
          </section>
          
        </div>
      </main>

      <ModalDetalleProducto 
        producto={productoSeleccionado}
        onClose={() => setProductoSeleccionado(null)}
        onResenaAgregada={handleResenaAgregada}
      />
    </>
  );
}
