import axios from 'axios';
import type { InternalAxiosRequestConfig } from 'axios'; 
import type { Producto, PublicacionBlog, Usuario, Pedido, ComentarioBlog, Resena } from '../types';

// ... el resto de tu código sigue igual
// ... el resto de tu código sigue igual
// URL base de la API Spring Boot
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar el token automáticamente
apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.set('Authorization', `Bearer ${token}`);
  }
  return config;
});

// Datos estáticos para regiones (ya que no se guardan en BD)
const regionesYComunas = {
    "Región Metropolitana de Santiago": ["Santiago", "Providencia", "Las Condes", "Maipú", "Puente Alto"],
    "Región de Valparaíso": ["Valparaíso", "Viña del Mar", "Quilpué"],
    "Región del Biobío": ["Concepción", "Talcahuano", "San Pedro de la Paz"]
    // ... puedes agregar el resto de la lista larga aquí si la necesitas completa
};

// Objeto API unificado (Reemplazo total de mockApi)
export const api = {
  // --- PRODUCTOS ---
  getProductos: async (): Promise<Producto[]> => {
    const { data } = await apiClient.get('/productos');
    return data;
  },
  getProductoById: async (id: number): Promise<Producto | undefined> => {
    const { data } = await apiClient.get(`/productos/${id}`);
    return data;
  },
  getCategoriasUnicas: async (): Promise<string[]> => {
    const { data } = await apiClient.get('/productos/categorias');
    return data;
  },
  saveProductos: async (): Promise<void> => { /* No-op: el backend persiste auto */ },
  createProducto: async (prod: Producto): Promise<Producto> => {
    const { data } = await apiClient.post('/productos', prod);
    return data;
  },
  updateProducto: async (prod: Producto): Promise<Producto> => {
    const { data } = await apiClient.put(`/productos/${prod.id}`, prod);
    return data;
  },
  deleteProducto: async (id: number): Promise<void> => {
    await apiClient.delete(`/productos/${id}`);
  },
  addResena: async (productoId: number, resena: Resena): Promise<Producto> => {
    const { data } = await apiClient.post(`/productos/${productoId}/resenas`, resena);
    return data;
  },

  // --- BLOG ---
  getBlogPosts: async (): Promise<PublicacionBlog[]> => {
    const { data } = await apiClient.get('/blog');
    return data;
  },
  getBlogPostById: async (id: number): Promise<PublicacionBlog | undefined> => {
    try {
        const { data } = await apiClient.get(`/blog/${id}`);
        return data;
    } catch { return undefined; }
  },
  createBlogPost: async (post: Omit<PublicacionBlog, 'id'>): Promise<PublicacionBlog> => {
    const { data } = await apiClient.post('/blog', post);
    return data;
  },
  updateBlogPost: async (post: PublicacionBlog): Promise<PublicacionBlog> => {
    const { data } = await apiClient.put(`/blog/${post.id}`, post);
    return data;
  },
  deleteBlogPost: async (id: number): Promise<void> => {
    await apiClient.delete(`/blog/${id}`);
  },
  getBlogComments: async (postId: number): Promise<ComentarioBlog[]> => {
    const { data } = await apiClient.get(`/blog/${postId}/comentarios`);
    return data;
  },
  addBlogComment: async (postId: number, comentario: ComentarioBlog): Promise<ComentarioBlog> => {
    const { data } = await apiClient.post(`/blog/${postId}/comentarios`, comentario);
    return data;
  },

  // --- USUARIOS Y AUTH ---
  login: async (correo: string, contrasena: string): Promise<Usuario> => {
    const { data } = await apiClient.post('/auth/login', { correo, contrasena });
    localStorage.setItem('token', data.token); // Guardar token JWT
    return data; // Devuelve el usuario con token
  },
  register: async (usuario: any): Promise<Usuario> => {
    const { data } = await apiClient.post('/auth/registro', usuario);
    localStorage.setItem('token', data.token);
    return data;
  },
  updateUser: async (usuario: Usuario): Promise<Usuario> => {
    const { data } = await apiClient.put('/usuarios/perfil', usuario);
    return data.usuario;
  },
  getUsuarios: async (): Promise<Usuario[]> => {
    const { data } = await apiClient.get('/usuarios'); // Requiere rol admin en backend
    return data;
  },
  getUsuarioByCorreo: async (correo: string): Promise<Usuario | undefined> => {
    // Nota: El backend busca por ID generalmente, pero si implementaste búsqueda por correo:
    const usuarios = await api.getUsuarios();
    return usuarios.find(u => u.correo === correo);
  },
  createUsuario: async (usuario: Usuario): Promise<Usuario> => {
    // Admin creando usuario
    const { data } = await apiClient.post('/auth/registro', usuario); 
    return data;
  },
  updateUsuarioAdmin: async (correoOriginal: string, usuario: Usuario): Promise<Usuario> => {
    // Nota: Necesitarías un endpoint admin específico para editar otros usuarios por correo
    // Por ahora simulamos editando el perfil si es el propio, o implementa PUT /usuarios/{id}
    const { data } = await apiClient.put('/usuarios/perfil', usuario);
    return data.usuario; 
  },
  deleteUsuario: async (correo: string): Promise<void> => {
    // Primero obtener ID por correo
    const usuario = await api.getUsuarioByCorreo(correo);
    if(usuario && usuario.id) {
        await apiClient.delete(`/usuarios/${usuario.id}`); // Necesitas endpoint DELETE en backend
    }
  },

  // --- PEDIDOS ---
  crearPedido: async (pedido: Pedido, guardarDireccion: boolean, nuevaDireccion?: any): Promise<Pedido> => {
    // Mapeo de CarritoItem (frontend) a DetallePedido (backend)
    // El backend espera: { nombre, precio, cantidad, unidad, productoIdOriginal }
    const itemsBackend = pedido.items.map(item => ({
        productoIdOriginal: item.id,
        nombre: item.nombre,
        precio: item.precio,
        cantidad: item.cantidad,
        unidad: item.unidad
    }));

    const pedidoBackend = {
        ...pedido,
        items: itemsBackend,
        id: null // Backend genera ID
    };

    const { data } = await apiClient.post('/pedidos', pedidoBackend);
    
    // Si hay que guardar dirección, actualizamos usuario
    if (guardarDireccion && nuevaDireccion) {
        await apiClient.put('/usuarios/perfil', { direccion: nuevaDireccion.calle + ", " + nuevaDireccion.ciudad });
    }
    
    return data;
  },
  getAllPedidos: async (): Promise<Pedido[]> => {
    const { data } = await apiClient.get('/pedidos');
    return data;
  },
  getPedidosByCliente: async (correo: string): Promise<Pedido[]> => {
    const { data } = await apiClient.get(`/pedidos/cliente/${correo}`);
    return data;
  },
  updatePedido: async (id: number, estado: string): Promise<Pedido> => {
    const { data } = await apiClient.patch(`/pedidos/${id}/estado`, { estado });
    return data;
  },

  // --- OTROS ---
  getRegionesYComunas: async (): Promise<Record<string, string[]>> => {
    return regionesYComunas;
  }
};

// Objeto authAPI para AuthContext (compatibilidad)
export const authAPI = {
    login: (creds: any) => apiClient.post('/auth/login', creds),
    register: (data: any) => apiClient.post('/auth/registro', data)
};

export default apiClient;