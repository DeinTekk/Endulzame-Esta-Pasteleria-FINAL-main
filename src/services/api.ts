import type { Producto, PublicacionBlog, Usuario, Pedido, ComentarioBlog, Resena } from '../types';

const PRODUCTOS_KEY = 'productos';
const BLOG_KEY = 'publicacionesBlog';
const USUARIOS_KEY = 'usuarios';
const PEDIDOS_KEY = 'pedidos';
const BLOG_COMMENTS_KEY = 'comentariosBlog';

const productosIniciales: Producto[] = [
  { id: 100, nombre: "Torta de Chocolate", precio: 8500, categoria: "Tortas", imagen: "img/prod1.jpg", etiqueta: "Especial", descripcion: "Deliciosa torta de chocolate artesanal con capas esponjosas y relleno de ganache. Elaborada con chocolate belga premium y decorada con elegancia. Perfecta para celebraciones especiales, cumpleaños o simplemente para darte un gusto. Su sabor intenso y textura suave te harán vivir una experiencia única.", stock: 15, origen: "Santiago, Chile", unidad: "unidad", stockCritico: null, resenas: [{ usuario: "Ana M.", calificacion: 5, texto: "Excelente sabor." }, { usuario: "Pedro V.", calificacion: 4, texto: "Muy rica." }] },
  { id: 200, nombre: "Cheesecake de Frutos Rojos", precio: 7500, categoria: "Tortas", imagen: "img/prod2.jpg", etiqueta: "Especial", descripcion: "Exquisito cheesecake cremoso con base de galleta y cobertura de frutos rojos frescos. Elaborado con queso crema premium y frutas de temporada. Su textura suave y sabor equilibrado lo hacen perfecto para cualquier ocasión especial o para disfrutar en familia.", stock: 12, origen: "Santiago, Chile", unidad: "unidad", stockCritico: null, resenas: [{ usuario: "María P.", calificacion: 5, texto: "Muy cremoso." }, { usuario: "Juan F.", calificacion: 4, texto: "Sabor exquisito." }] },
  { id: 300, nombre: "Alfajores Artesanales", precio: 3500, categoria: "Galletas", imagen: "img/prod3.jpg", descripcion: "Alfajores artesanales con dulce de leche casero y cubiertos con coco rallado. Elaborados con mantequilla de primera calidad y horneados a la perfección. Son el acompañamiento ideal para el café o té. Su textura suave y sabor tradicional te transportarán a la infancia.", stock: 50, origen: "Santiago, Chile", unidad: "docena", stockCritico: null, resenas: [{ usuario: "Sofía G.", calificacion: 5, texto: "Muy ricos." }] },
  { id: 400, nombre: "Pie de Limón", precio: 6500, categoria: "Pasteles", imagen: "img/prod4.jpg", descripcion: "Refrescante pie de limón con base crocante y relleno cremoso de limón natural. Coronado con merengue italiano ligeramente tostado. Ideal para los amantes de los sabores cítricos. Su equilibrio perfecto entre dulce y ácido lo hace irresistible en cualquier temporada.", stock: 18, origen: "Santiago, Chile", unidad: "unidad", stockCritico: null, resenas: [{ usuario: "Carolina V.", calificacion: 5, texto: "Fresco y con sabor intenso." }] },
  { id: 500, nombre: "Brownies de Chocolate", precio: 4200, categoria: "Pasteles", imagen: "img/prod5.jpg", descripcion: "Brownies de chocolate intenso con trozos de nueces, húmedos y deliciosos. Elaborados con cacao premium y horneados al punto perfecto. Son ideales para compartir o disfrutar en solitario. Su textura densa y sabor profundo satisfarán a los más exigentes amantes del chocolate.", stock: 25, origen: "Santiago, Chile", unidad: "caja", stockCritico: null, resenas: [{ usuario: "Roberta A.", calificacion: 4, texto: "Buena porción." }] },
  { id: 600, nombre: "Galletas de Mantequilla", precio: 3200, categoria: "Galletas", imagen: "img/prod6.jpg", descripcion: "Galletas de mantequilla artesanales, crujientes y con sabor casero auténtico. Elaboradas con mantequilla de primera calidad y decoradas con azúcar glass. Son perfectas para acompañar el té o café. Su textura crocante y sabor delicado las hacen irresistibles para toda la familia.", stock: 40, origen: "Santiago, Chile", unidad: "docena", stockCritico: null, resenas: [{ usuario: "Diego B.", calificacion: 5, texto: "Sabor auténtico y muy frescas." }] },
  { id: 700, nombre: "Mousse de Chocolate", precio: 4800, precioConDescuento: 4200, categoria: "Postres", imagen: "img/prod7.jpg", etiqueta: "Oferta", descripcion: "Mousse de chocolate suave y aireado, elaborado con chocolate belga de alta calidad. Con una textura sedosa y sabor intenso, es el postre perfecto para los amantes del chocolate. Presentado en copas individuales, ideal para ocasiones especiales o para darte un capricho.", stock: 30, origen: "Santiago, Chile", unidad: "copa", stockCritico: null, resenas: [{ usuario: "Antonia D.", calificacion: 5, texto: "Un sabor exquisito." }] },
  { id: 800, nombre: "Tartaletas de Frutas", precio: 5200, precioConDescuento: 4600, categoria: "Postres", imagen: "img/prod8.jpg", etiqueta: "Oferta", descripcion: "Tartaletas artesanales con crema pastelera y frutas frescas de temporada. Con base de masa quebrada crujiente y decoración elegante. Son el postre perfecto para eventos especiales o para disfrutar en familia. Su presentación impecable y sabor equilibrado las hacen ideales para cualquier ocasión.", stock: 20, origen: "Santiago, Chile", unidad: "caja", stockCritico: null, resenas: [{ usuario: "Fernanda L.", calificacion: 5, texto: "Excelentes para mis eventos." }] },
  { id: 900, nombre: "Cupcakes Variados", precio: 4500, precioConDescuento: 3900, categoria: "Postres", imagen: "img/prod9.jpg", etiqueta: "Oferta", descripcion: "Cupcakes artesanales con variedad de sabores y decoraciones creativas. Elaborados con ingredientes premium y decorados con buttercream suave. Son perfectos para fiestas, celebraciones o simplemente para compartir. Su presentación colorida y sabor delicioso alegrarán cualquier momento.", stock: 35, origen: "Santiago, Chile", unidad: "caja", stockCritico: null, resenas: [{ usuario: "Pablo Q.", calificacion: 5, texto: "Muy buenos y frescos." }] }
];
function inicializarProductos() {
    const productosGuardados = localStorage.getItem(PRODUCTOS_KEY);
    if (!productosGuardados || JSON.parse(productosGuardados).length === 0) {
        localStorage.setItem(PRODUCTOS_KEY, JSON.stringify(productosIniciales));
    }
}
const publicacionesIniciales: PublicacionBlog[] = [
  { id: 1, titulo: "5 Técnicas Esenciales de Repostería", imagen: "img/blog-sostenibilidad.jpg", fecha: "2025-06-20", categoria: "Repostería", contenido: `<p>Dominar la repostería es un arte que requiere práctica y dedicación...</p><h4>1. Medir con precisión</h4><p>La repostería es una ciencia exacta...</p><h4>2. Temperatura de los ingredientes</h4><p>Usar ingredientes a temperatura ambiente...</p><h4>3. Batir correctamente</h4><p>Cada receta requiere una técnica de batido específica...</p><h4>4. Conocer tu horno</h4><p>Cada horno es diferente y conocer el tuyo...</p><h4>5. Paciencia en el enfriado</h4><p>Dejar enfriar completamente tus postres...</p><p>¡Una repostería perfecta requiere amor y dedicación!</p>` },
  { id: 2, titulo: "Receta: Torta de Chocolate Perfecta", imagen: "img/blog-recetas.jpg", fecha: "2025-06-18", categoria: "Recetas", contenido: `<p>¿Buscas preparar la torta de chocolate perfecta?...</p><h3>Ingredientes:</h3><ul><li>200g de chocolate amargo</li><li>3 huevos</li><li>150g de azúcar</li><li>...</li></ul><h3>Preparación:</h3><ol><li>Derrite el chocolate a baño maría...</li><li>Bate los huevos con el azúcar...</li><li>...</li></ol><p>¡Disfruta de una torta deliciosa y esponjosa!</p>` },
  { id: 3, titulo: "Nuestro Compromiso con la Calidad", imagen: "img/blog-huella.jpg", fecha: "2025-06-15", categoria: "Repostería", contenido: `<p>En <strong>Endúlzame esta</strong>, estamos comprometidos con la excelencia...</p><h4>Ingredientes premium</h4><p>Trabajamos solo con los mejores proveedores...</p><h4>Elaboración artesanal</h4><p>Cada postre es elaborado a mano...</p><h4>Frescura garantizada</h4><p>Nuestros productos se hornean diariamente...</p>` },
  { id: 4, titulo: "Decoración de Tortas: Consejos Básicos", imagen: "img/blog-comunidad.jpg", fecha: "2025-06-10", categoria: "Decoración", contenido: `<p>La decoración de tortas es un arte que todos pueden aprender...</p><p>Con las herramientas correctas y un poco de práctica...</p><p>Cada creación puede convertirse en una obra maestra...</p>` },
  { id: 5, titulo: "Cómo Montar tu Propia Pastelería Casera", imagen: "img/blog-pasteleria-casera.jpg", fecha: "2025-06-05", categoria: "Repostería", contenido: `<p>¿Sueñas con crear tus propios postres en casa?...</p><h4>Consejos clave:</h4><ul><li><strong>Invierte en herramientas básicas:</strong>...</li><li><strong>Organiza tu espacio:</strong>...</li><li>...</li></ul><p>El proceso de aprendizaje es una recompensa en sí misma...</p>` },
  { id: 6, titulo: "Receta: Cupcakes de Vainilla Perfectos", imagen: "img/blog-batido-verde.jpg", fecha: "2025-05-30", categoria: "Recetas", contenido: `<p>¿Quieres preparar cupcakes esponjosos y deliciosos?...</p><h3>Ingredientes:</h3><ul><li>2 tazas de harina</li><li>...</li></ul><h3>Preparación:</h3><p>Mezcla los ingredientes secos...</p><p>¡Decora y disfruta de inmediato!</p>` }
];
const comentariosIniciales: Record<string, ComentarioBlog[]> = {
  '1': [{ usuario: "Ana", texto: "¡Muy buenos consejos! Empezaré a practicar estas técnicas." }, { usuario: "Carlos", texto: "La precisión en las medidas es clave, ¡gracias!" }],
  '4': [{ usuario: "Pedro", texto: "Excelentes consejos para decorar tortas." }, { usuario: "María", texto: "Me encanta este tipo de tutoriales." }],
  '5': [{ usuario: "Javier", texto: "Excelente guía, justo lo que necesitaba para mi cocina." }]
};
function inicializarBlog() {
    const postsGuardados = localStorage.getItem(BLOG_KEY);
    if (!postsGuardados || JSON.parse(postsGuardados).length === 0) {
        localStorage.setItem(BLOG_KEY, JSON.stringify(publicacionesIniciales));
    }
}
function inicializarBlogComentarios() {
    const comentariosGuardados = localStorage.getItem(BLOG_COMMENTS_KEY);
    if (!comentariosGuardados) {
        localStorage.setItem(BLOG_COMMENTS_KEY, JSON.stringify(comentariosIniciales));
    }
}
function inicializarAdmin() {
    const usuariosGuardados = localStorage.getItem(USUARIOS_KEY);
    let usuarios: Usuario[] = usuariosGuardados ? JSON.parse(usuariosGuardados) : [];
    if (!usuariosGuardados || usuarios.length === 0) {
        const nuevoAdmin: Usuario = {
            id: 1,
            nombre: 'Admin',
            rut: '1-9',
            correo: 'admin@endulzameesta.cl',
            contrasena: 'admin',
            esAdmin: true
        };
        usuarios = [nuevoAdmin];
        localStorage.setItem(USUARIOS_KEY, JSON.stringify(usuarios));
    } else {
        const usuarioAdmin = usuarios.find(u => u.esAdmin);
        if (!usuarioAdmin) {
            const nuevoAdmin: Usuario = {
                id: 1,
                nombre: 'Admin',
                rut: '1-9',
                correo: 'admin@endulzameesta.cl',
                contrasena: 'admin',
                esAdmin: true
            };
            usuarios.push(nuevoAdmin);
            localStorage.setItem(USUARIOS_KEY, JSON.stringify(usuarios));
        }
    }
}
const regionesYComunas = {
    "Región de Arica y Parinacota": ["Arica", "Camarones", "Putre", "General Lagos"],
    "Región de Tarapacá": ["Iquique", "Alto Hospicio", "Pozo Almonte", "Camiña", "Colchane", "Huara", "Pica"],
    "Región de Antofagasta": ["Antofagasta", "Mejillones", "Sierra Gorda", "Taltal", "Calama", "Ollagüe", "San Pedro de Atacama", "Tocopilla", "María Elena"],
    "Región de Atacama": ["Copiapó", "Caldera", "Tierra Amarilla", "Chañaral", "Diego de Almagro", "Vallenar", "Alto del Carmen", "Freirina", "Huasco"],
    "Región de Coquimbo": ["La Serena", "Coquimbo", "Andacollo", "La Higuera", "Paiguano", "Vicuña", "Illapel", "Canela", "Los Vilos", "Salamanca", "Ovalle", "Combarbalá", "Monte Patria", "Punitaqui", "Río Hurtado"],
    "Región de Valparaíso": ["Valparaíso", "Casablanca", "Concón", "Juan Fernández", "Quintero", "Viña del Mar", "Isla de Pascua", "Los Andes", "Calle Larga", "Catemu", "Llay-Llay", "San Esteban", "La Ligua", "Cabildo", "Papudo", "Petorca", "Zapallar", "Quillota", "Calera", "Hijuelas", "La Cruz", "Nogales", "San Antonio", "Algarrobo", "Cartagena", "El Quisco", "El Tabo", "Santo Domingo", "San Felipe", "Catemu", "Llaillay", "Putaendo", "Santa María", "Panquehue", "Quilpué", "Limache", "Olmué", "Villa Alemana"],
    "Región Metropolitana de Santiago": ["Santiago", "Cerrillos", "Cerro Navia", "Conchalí", "El Bosque", "Estación Central", "Huechuraba", "Independencia", "La Cisterna", "La Florida", "La Granja", "La Pintana", "La Reina", "Las Condes", "Lo Barnechea", "Lo Espejo", "Lo Prado", "Macul", "Maipú", "Ñuñoa", "Pedro Aguirre Cerda", "Peñalolén", "Providencia", "Pudahuel", "Quilicura", "Quinta Normal", "Recoleta", "Renca", "San Joaquín", "San Miguel", "San Ramón", "Vitacura", "Puente Alto", "Pirque", "San José de Maipo", "Colina", "Lampa", "Tiltil", "San Bernardo", "Buin", "Calera de Tango", "Paine", "Melipilla", "Alhué", "Curacaví", "María Pinto", "San Pedro", "Talagante", "El Monte", "Isla de Maipo", "Padre Hurtado", "Peñaflor"],
    "Región del Libertador General Bernardo O'Higgins": ["Rancagua", "Codegua", "Coinco", "Coltauco", "Doñihue", "Graneros", "La Estrella", "Las Cabras", "Machalí", "Malloa", "Mostazal", "Olivar", "Paredones", "Peralillo", "Peumo", "Pichilemu", "Pichidegua", "Placilla", "Requínoa", "Rengo", "San Fernando", "Chépica", "Chimbarongo", "Lolol", "Nancagua", "Palmilla", "Peralillo", "Pumanque", "San Vicente", "Santa Cruz", "Litueche"],
    "Región del Maule": ["Talca", "Constitución", "Curepto", "Empedrado", "Maule", "Pelarco", "Pencahue", "Río Claro", "San Clemente", "San Rafael", "Cauquenes", "Chanco", "Pelluhue", "Curicó", "Hualañé", "Licantén", "Molina", "Rauco", "Romeral", "Sagrada Familia", "Teno", "Vichuquén", "Linares", "Colbún", "Longaví", "Parral", "Retiro", "San Javier de Loncomilla", "Villa Alegre", "Yerbas Buenas"],
    "Región de Ñuble": ["Cobquecura", "Coelemu", "Ninhue", "Portezuelo", "Quirihue", "Ránquil", "Treguaco", "Bulnes", "Chillán Viejo", "Chillán", "El Carmen", "Pemuco", "Pinto", "Quillón", "San Ignacio", "Yungay", "San Carlos", "Coihueco", "Ñiquén", "San Fabián", "San Nicolás"],
    "Región del Biobío": ["Concepción", "Coronel", "Chiguayante", "Florida", "Hualqui", "Lota", "Penco", "San Pedro de la Paz", "Santa Juana", "Talcahuano", "Tomé", "Hualpén", "Lebu", "Arauco", "Cañete", "Contulmo", "Curanilahue", "Los Álamos", "Tirúa", "Los Ángeles", "Antuco", "Cabrero", "Laja", "Mulchén", "Nacimiento", "Negrete", "Quilaco", "Quilleco", "San Rosendo", "Santa Bárbara", "Tucapel", "Yumbel", "Alto Biobío"],
    "Región de la Araucanía": ["Temuco", "Carahue", "Cholchol", "Cunco", "Curarrehue", "Freire", "Galvarino", "Gorbea", "Lautaro", "Loncoche", "Melipeuco", "Nueva Imperial", "Padre Las Casas", "Perquenco", "Pitrufquén", "Pucón", "Saavedra", "Teodoro Schmidt", "Toltén", "Vilcún", "Villarrica", "Angol", "Collipulli", "Curacautín", "Ercilla", "Lonquimay", "Los Sauces", "Lumaco", "Purén", "Renaico", "Traiguén", "Victoria"],
    "Región de los Ríos": ["Valdivia", "Corral", "Lanco", "Los Lagos", "Máfil", "Mariquina", "Paillaco", "Panguipulli", "La Unión", "Futrono", "Lago Ranco", "Río Bueno"],
    "Región de los Lagos": ["Puerto Montt", "Calbuco", "Cochamó", "Fresia", "Frutillar", "Los Muermos", "Llanquihue", "Maullín", "Puerto Varas", "Osorno", "Puerto Octay", "Purranque", "Puyehue", "Río Negro", "San Juan de la Costa", "San Pablo", "Chaitén", "Futaleufú", "Hualaihué", "Palena", "Castro", "Ancud", "Chonchi", "Curaco de Vélez", "Dalcahue", "Puqueldón", "Queilén", "Quellón", "Quemchi", "Quinchao"],
    "Región de Aysén del General Carlos Ibáñez del Campo": ["Coyhaique", "Lago Verde", "Aysén", "Cisnes", "Guaitecas", "Cochrane", "O'Higgins", "Tortel", "Chile Chico", "Río Ibáñez"],
    "Región de Magallanes y de la Antártica Chilena": ["Punta Arenas", "Laguna Blanca", "Río Verde", "San Gregorio", "Cabo de Hornos (Ex Navarino)", "Antártica", "Porvenir", "Primavera", "Timaukel", "Torres del Paine"],
};
inicializarProductos();
inicializarAdmin();
inicializarBlog();
inicializarBlogComentarios();

const getProductosDB = (): Producto[] => JSON.parse(localStorage.getItem(PRODUCTOS_KEY) || '[]');
const saveProductosDB = (productos: Producto[]) => localStorage.setItem(PRODUCTOS_KEY, JSON.stringify(productos));
const getUsuariosDB = (): Usuario[] => JSON.parse(localStorage.getItem(USUARIOS_KEY) || '[]');
const saveUsuariosDB = (usuarios: Usuario[]) => localStorage.setItem(USUARIOS_KEY, JSON.stringify(usuarios));
const getPedidosDB = (): Pedido[] => JSON.parse(localStorage.getItem(PEDIDOS_KEY) || '[]');
const savePedidosDB = (pedidos: Pedido[]) => localStorage.setItem(PEDIDOS_KEY, JSON.stringify(pedidos));
const getBlogDB = (): PublicacionBlog[] => JSON.parse(localStorage.getItem(BLOG_KEY) || '[]');
const saveBlogDB = (posts: PublicacionBlog[]) => localStorage.setItem(BLOG_KEY, JSON.stringify(posts));
const getComentariosDB = (): Record<string, ComentarioBlog[]> => JSON.parse(localStorage.getItem(BLOG_COMMENTS_KEY) || '{}');
const saveComentariosDB = (comentarios: Record<string, ComentarioBlog[]>) => localStorage.setItem(BLOG_COMMENTS_KEY, JSON.stringify(comentarios));

export const api = {
  
  getProductos: async (): Promise<Producto[]> => getProductosDB().filter(p => !p.eliminado),
  getProductoById: async (id: number): Promise<Producto | undefined> => getProductosDB().find(p => p.id === id),
  getCategoriasUnicas: async (): Promise<string[]> => Array.from(new Set(getProductosDB().filter(p => !p.eliminado).map(p => p.categoria))).filter(Boolean),
  saveProductos: async (productos: Producto[]): Promise<void> => {
    saveProductosDB(productos);
  },
  createProducto: async (nuevoProducto: Producto): Promise<Producto> => {
    const productos = getProductosDB();
    productos.push(nuevoProducto);
    saveProductosDB(productos);
    return nuevoProducto;
  },
  updateProducto: async (productoActualizado: Producto): Promise<Producto> => {
    const productos = getProductosDB();
    const indice = productos.findIndex(p => p.id === productoActualizado.id);
    if (indice === -1) throw new Error("Producto no encontrado");
    productos[indice] = productoActualizado;
    saveProductosDB(productos);
    return productoActualizado;
  },
  deleteProducto: async (id: number): Promise<void> => {
    const productos = getProductosDB();
    const indice = productos.findIndex(p => p.id === id);
    if (indice !== -1) {
      productos[indice].eliminado = true;
      saveProductosDB(productos);
    }
  },
  addResena: async (productoId: number, resena: Resena): Promise<Producto> => {
    const productos = getProductosDB();
    const indice = productos.findIndex(p => p.id === productoId);
    if (indice === -1) throw new Error("Producto no encontrado");
    
    productos[indice].resenas.push(resena);
    saveProductosDB(productos);
    return productos[indice];
  },

  getBlogPosts: async (): Promise<PublicacionBlog[]> => {
    return getBlogDB().sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
  },
  getBlogPostById: async (id: number): Promise<PublicacionBlog | undefined> => {
    return getBlogDB().find(p => p.id === id);
  },
  createBlogPost: async (post: Omit<PublicacionBlog, 'id'>): Promise<PublicacionBlog> => {
    const posts = getBlogDB();
    const nuevoPost: PublicacionBlog = {
      ...post,
      id: Date.now()
    };
    posts.push(nuevoPost);
    saveBlogDB(posts);
    return nuevoPost;
  },
  updateBlogPost: async (postActualizado: PublicacionBlog): Promise<PublicacionBlog> => {
    const posts = getBlogDB();
    const indice = posts.findIndex(p => p.id === postActualizado.id);
    if (indice === -1) throw new Error("Publicación no encontrada");
    posts[indice] = postActualizado;
    saveBlogDB(posts);
    return postActualizado;
  },
  deleteBlogPost: async (id: number): Promise<void> => {
    const posts = getBlogDB();
    const postsFiltrados = posts.filter(p => p.id !== id);
    saveBlogDB(postsFiltrados);
    const comentarios = getComentariosDB();
    delete comentarios[id];
    saveComentariosDB(comentarios);
  },
  getBlogComments: async (postId: number): Promise<ComentarioBlog[]> => {
    const comentarios = getComentariosDB();
    return comentarios[postId] || [];
  },
  addBlogComment: async (postId: number, comentario: ComentarioBlog): Promise<ComentarioBlog> => {
    const comentarios = getComentariosDB();
    if (!comentarios[postId]) {
      comentarios[postId] = [];
    }
    comentarios[postId].push(comentario);
    saveComentariosDB(comentarios);
    return comentario;
  },
  
  login: async (correo: string, contrasena: string): Promise<Usuario> => {
    const usuarios = getUsuariosDB();
    const usuario = usuarios.find(u => u.correo === correo && u.contrasena === contrasena);
    if (usuario) {
      localStorage.setItem('usuarioActual', JSON.stringify(usuario));
      localStorage.setItem('sesionIniciada', 'true');
      return usuario;
    } else {
      throw new Error('Credenciales incorrectas');
    }
  },
  register: async (nuevoUsuario: Omit<Usuario, 'id' | 'esAdmin'>): Promise<Usuario> => {
    const usuarios = getUsuariosDB();
    if (usuarios.find(u => u.correo === nuevoUsuario.correo)) {
      throw new Error('El correo electrónico ya está registrado.');
    }
    const usuarioConId: Usuario = { ...nuevoUsuario, id: Date.now(), esAdmin: false, historial: [], puntos: 0 };
    usuarios.push(usuarioConId);
    saveUsuariosDB(usuarios);
    return usuarioConId;
  },
  updateUser: async (usuarioActualizado: Usuario): Promise<Usuario> => {
    const usuarios = getUsuariosDB();
    const indiceUsuario = usuarios.findIndex(u => u.correo === usuarioActualizado.correo);
    if (indiceUsuario === -1) throw new Error("Usuario no encontrado para actualizar");
    usuarios[indiceUsuario] = usuarioActualizado;
    saveUsuariosDB(usuarios);
    localStorage.setItem('usuarioActual', JSON.stringify(usuarioActualizado));
    return usuarioActualizado;
  },
  getUsuarios: async (): Promise<Usuario[]> => getUsuariosDB(),
  getUsuarioByCorreo: async (correo: string): Promise<Usuario | undefined> => getUsuariosDB().find(u => u.correo === correo),
  createUsuario: async (nuevoUsuario: Usuario): Promise<Usuario> => {
    const usuarios = getUsuariosDB();
    if (usuarios.some(u => u.correo === nuevoUsuario.correo)) throw new Error('El correo electrónico ya está registrado.');
    usuarios.push(nuevoUsuario);
    saveUsuariosDB(usuarios);
    return nuevoUsuario;
  },
  updateUsuarioAdmin: async (correoOriginal: string, usuarioActualizado: Usuario): Promise<Usuario> => {
    const usuarios = getUsuariosDB();
    const indice = usuarios.findIndex(u => u.correo === correoOriginal);
    if (indice === -1) throw new Error("Usuario no encontrado");
    
    if (!usuarioActualizado.contrasena) {
      usuarioActualizado.contrasena = usuarios[indice].contrasena;
    }
    
    usuarioActualizado.correo = correoOriginal; 
    usuarios[indice] = usuarioActualizado;
    saveUsuariosDB(usuarios);
    return usuarioActualizado;
  },
  deleteUsuario: async (correo: string): Promise<void> => {
    const usuarios = getUsuariosDB();
    if (correo === 'admin@endulzameesta.cl') throw new Error('No se puede eliminar al administrador principal.');
    const usuariosFiltrados = usuarios.filter(u => u.correo !== correo);
    saveUsuariosDB(usuariosFiltrados);
  },
  getRegionesYComunas: async (): Promise<Record<string, string[]>> => regionesYComunas,

  crearPedido: async (pedido: Pedido, guardarDireccion: boolean, nuevaDireccion?: { calle: string, ciudad: string, region: string }): Promise<Pedido> => {
    const pedidos = getPedidosDB();
    pedidos.push(pedido);
    savePedidosDB(pedidos);
    const usuarios = getUsuariosDB();
    const indiceUsuario = usuarios.findIndex(u => u.correo === pedido.correoCliente);
    if (indiceUsuario !== -1) {
      const usuarioActual = usuarios[indiceUsuario];
      usuarioActual.puntos = usuarioActual.puntos || 0;
      if (pedido.puntosUsados > 0) usuarioActual.puntos = 0;
      usuarioActual.puntos += pedido.puntosGanados;
      if (guardarDireccion && nuevaDireccion && pedido.tipoEntrega === 'domicilio') {
        if (!usuarioActual.direcciones) {
          usuarioActual.direcciones = [];
        }
        const dirExiste = usuarioActual.direcciones.some(d => 
          d.calle === nuevaDireccion.calle && d.ciudad === nuevaDireccion.ciudad
        );
        if (!dirExiste) {
          usuarioActual.direcciones.push(nuevaDireccion);
        }
      }
      usuarios[indiceUsuario] = usuarioActual;
      saveUsuariosDB(usuarios);
      localStorage.setItem('usuarioActual', JSON.stringify(usuarioActual));
    }
    
    localStorage.removeItem('carrito');
    return pedido;
  },
  getPedidosByCliente: async (correo: string): Promise<Pedido[]> => getPedidosDB().filter(p => p.correoCliente === correo).sort((a, b) => b.id - a.id),
  getAllPedidos: async (): Promise<Pedido[]> => getPedidosDB().sort((a, b) => b.id - a.id),
  updatePedido: async (pedidoId: number, nuevoEstado: Pedido['estado']): Promise<Pedido> => {
    const pedidos = getPedidosDB();
    const indicePedido = pedidos.findIndex(p => p.id === pedidoId);
    if (indicePedido === -1) throw new Error("Pedido no encontrado");
    pedidos[indicePedido].estado = nuevoEstado;
    savePedidosDB(pedidos);
    return pedidos[indicePedido];
  }
};