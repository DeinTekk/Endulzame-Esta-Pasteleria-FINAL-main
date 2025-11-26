import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import type { Producto } from '../types';
import TarjetaProducto from '../components/TarjetaProducto';
import ModalDetalleProducto from '../components/ModalDetalleProducto';
import { useProductContext } from '../context/ProductContext';

export default function Inicio() {
  const { productos, cargando, actualizarProductoCompleto } = useProductContext();
  
  const [productoSeleccionado, setProductoSeleccionado] = useState<Producto | null>(null);

  const handleResenaAgregada = (productoActualizado: Producto) => {
    actualizarProductoCompleto(productoActualizado);
    setProductoSeleccionado(productoActualizado);
  };

  const productosDestacados = useMemo(() => {
    return productos
      .filter(p => p.etiqueta === 'Oferta')
      .slice(0, 3);
  }, [productos]);

  return (
    <>
      <header className="portada">
        <div className="superposicion-portada">
          <div className="container contenido-portada text-center">
            <h1 className="fw-bold">Dulzura artesanal directo a tu mesa</h1>
            <h2 className="lead">Tortas, pasteles y postres elaborados con los mejores ingredientes y mucho amor.</h2>
            <Link to="/productos" className="btn btn-lg btn-primario">Ver catálogo</Link>
          </div>
        </div>
      </header>
      
      <main className="container my-5">
        <section className="text-center mb-5">
          <h2 className="fw-bold mb-3">Nuestra Esencia</h2>
          <p className="text-muted mx-auto" style={{ maxWidth: '700px' }}>
            En Endúlzame esta, somos más que una pastelería. Somos una comunidad dedicada a la calidad,
            el sabor auténtico y la pasión por la repostería artesanal. Trabajamos con los mejores ingredientes para
            llevar dulzura y alegría directamente a tu mesa.
          </p>
          <Link to="/nosotros" className="btn btn-outline-primario mt-3">Conoce Nuestra Historia</Link>
        </section>
        
        <section className="seccion-alternativa py-5 mb-5">
          <div className="container">
            <h2 className="text-center fw-bold mb-4">Productos Destacados</h2>
            <div className="row g-4" id="contenedorProductos">
              {cargando && <p className="text-center">Cargando ofertas...</p>}
              {!cargando && productosDestacados.length === 0 && (
                <p className="text-center text-muted">No hay ofertas destacadas por el momento.</p>
              )}
              {!cargando && productosDestacados.map(p => (
                <TarjetaProducto 
                  key={p.id} 
                  producto={p} 
                  onProductoClick={setProductoSeleccionado}
                />
              ))}
            </div>
            <div className="text-center mt-4">
              <Link to="/productos" className="btn btn-outline-primario mt-3">Ver Todos los Productos</Link>
            </div>
          </div>
        </section>
        
        <section className="text-center">
          <h2 className="fw-bold mb-3">Últimas Novedades del Blog</h2>
          <p className="text-muted mx-auto" style={{ maxWidth: '700px' }}>
            Mantente al día con nuestros artículos sobre repostería, consejos de decoración y recetas
            deliciosas.
          </p>
          <Link to="/blog" className="btn btn-outline-primario mt-3">Ir al Blog</Link>
        </section>
      </main>

      <ModalDetalleProducto 
        producto={productoSeleccionado}
        onClose={() => setProductoSeleccionado(null)}
        onResenaAgregada={handleResenaAgregada}
      />
    </>
  );
}
