import { Link } from 'react-router-dom';

export default function Nosotros() {

  return (
    <main className="container my-5">
      <div className="row justify-content-center">
        <div className="col-md-10">
          {/* BLOQUE AÑADIDO: Encabezado */}
          <div className="bloque-legible text-center mb-4">
            <h1 className="mb-4">Nuestra Historia</h1>
            <p className="lead texto-secundario">
              En Endúlzame esta, creemos en el poder de la repostería artesanal para alegrar momentos especiales.
              Nuestro viaje comenzó con una simple idea: llevar dulzura y amor en cada bocado directamente a tu
              mesa.
            </p>
          </div>

          <hr className="my-5" />
          
          <div className="row align-items-center mb-5">
            <div className="col-md-6 order-md-2">
              <img src="/img/equipo.jpg" alt="Equipo de Endúlzame esta"
                className="img-fluid rounded shadow-sm mb-3 mb-md-0" />
            </div>
            <div className="col-md-6 order-md-1">
              {/* BLOQUE AÑADIDO: Misión */}
              <div className="bloque-legible">
                <h2>Nuestra Misión</h2>
                <p>
                  Nos dedicamos a crear postres artesanales de la más alta calidad, elaborados
                  con los mejores ingredientes y mucho amor. Buscamos endulzar tu vida con sabores únicos,
                  apoyando a proveedores locales y manteniendo la tradición de la repostería casera
                  en cada creación.
                </p>
              </div>
            </div>
          </div>
          
          <div className="row align-items-center mb-5">
            <div className="col-md-6">
              <img src="/img/valores.jpg" alt="Valores de la empresa"
                className="img-fluid rounded shadow-sm mb-3 mb-md-0" />
            </div>
            <div className="col-md-6">
              {/* BLOQUE AÑADIDO: Valores */}
              <div className="bloque-legible">
                <h2>Nuestros Valores</h2>
                <ul className="list-unstyled">
                  <li className="mb-2"><strong>Calidad:</strong> Solo usamos los mejores ingredientes para crear
                    postres deliciosos y memorables.</li>
                  <li className="mb-2"><strong>Pasión:</strong> Cada torta y pastel es elaborado con dedicación
                    y amor por la repostería.</li>
                  <li className="mb-2"><strong>Creatividad:</strong> Innovamos constantemente para sorprenderte
                    con sabores y diseños únicos.</li>
                  <li className="mb-2"><strong>Tradición:</strong> Mantenemos vivas las recetas caseras y el arte
                    de la repostería artesanal.</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-5 bloque-legible">
            <h2 className="mb-3">¡Únete a la familia Endúlzame esta!</h2>
            <p>Descubre la dulzura y el sabor de nuestros postres en nuestra tienda o inspírate con nuestro blog.
            </p>
            <Link to="/blog" className="btn btn-primario me-2">Ir al Blog</Link>
            <Link to="/productos" className="btn btn-acento">Ver Productos</Link>
          </div>
        </div>
      </div>
    </main>
  );
}