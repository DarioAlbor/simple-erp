const baseurl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:3001/api/';

// ESTAS RUTAS TAMBIEN IRIAN A UN .ENV PERO POR FACILIDAD SE DEJAN AQUI
const routes = {
  // AUTH
  isActive: 'auth/isActive',
  userRegister: 'auth/register',
  userLogin: 'auth/login',
  userInfo: 'auth/userinfo',
  exitSession: 'auth/exit',
  getAllUsers: 'auth/users',
  
  // CHANGE DATA
  changeProfileImage: 'change-data/changeProfileImage',
  changePassword: 'change-data/changePassword',
  updateUserData: 'change-data/updateUserData',
  updateSendNotifications: 'change-data/updateSendNotifications',
  disabledAccount: 'change-data/disabledAccount',
  
  // STOCK
  addProduct: 'stock/add',
  deleteProduct: 'stock/delete',
  editProduct: 'stock/edit',
  getAllProducts: 'stock/all',

  // ZONAS
  addZona: 'zona/add',
  deleteZona: 'zona/delete',
  editZona: 'zona/edit',
  getAllZonas: 'zona/all',

  // COMPRAS
  addCompra: 'compras/add',
  deleteCompra: 'compras/delete',
  editCompra: 'compras/edit',
  getAllCompras: 'compras/all',

  // PEDIDOS
  addPedido: 'pedidos/add',
  editPedido: 'pedidos/edit',
  getPedidosByVendedor: 'pedidos/vendedor',
  getAllPedidos: 'pedidos/all',
  deletePedido: 'pedidos/delete',

  // PUBLICIDAD
  addPublicidad: 'publicidad/add',
  editPublicidad: 'publicidad/edit',
  getAllPublicidad: 'publicidad/all',
  deletePublicidad: 'publicidad/delete',

};

// SE OBTIENE EL JWT DEL LOCALSTORAGE
const getToken = () => {
  return localStorage.getItem('token');
};

// SE HACEN SOLICITUDES GET CON JWT SI ESTA DISPONIBLE, SI NO ESTA DISPONIBLE SE INTENTA POR SI LA RUTA ES PUBLICA
const getWithAuth = async (route) => {
  const token = getToken();
  
  const response = await fetch(`${baseurl}${route}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    }
  });
  
  return response.json(); // RESPUESTA PARA MANEJARLA EN EL FRONTEND (SE USA TOAST)
};

// LO MISMO PERO CON PUT, POST, DELETE 
const requestWithAuth = async (route, data, method = 'POST') => {
  const token = getToken();

  const response = await fetch(`${baseurl}${route}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    },
    body: JSON.stringify(data),
  });

  const responseData = await response.json();
  return { status: response.status, data: responseData };
};

module.exports = {
  baseurl,
  routes,
  getWithAuth,
  requestWithAuth,
};