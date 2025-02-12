import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import Login from '../pages/auth/login';
import HomePage from '../pages/index';
import Inventario from '../pages/inventario';
import Logistica from '../pages/logistica';
import Pedidos from '../pages/pedidos';
import UserConfig from '../pages/user/config';
import HousekeepingPage from '../pages/admin/index';
import UsersPage from '../pages/admin/users';
import { getWithAuth, routes } from '../utils/apiRoutes';
import Layout from '../components/ui/layout';

export default function AppRoutes() {
  const navigate = useNavigate();
  const location = useLocation();
  const [userRank, setUserRank] = useState(null);

  useEffect(() => {
    const checkUserActive = async () => {
      try {
        const response = await getWithAuth(routes.isActive);

        if (response.isActive) {
          if (location.pathname === '/login') {
            navigate('/');
          }
        } else {
          if (location.pathname !== '/login') {
            navigate('/login');
          }
        }
      } catch {
        if (location.pathname !== '/login') {
          navigate('/login');
        }
      }
    };

    const fetchUserRank = async () => {
      try {
        const response = await getWithAuth(routes.userInfo);
        if (response && response.rank) {
          setUserRank(response.rank);
        }
      } catch (error) {
        setUserRank(null);
      }
    };

    checkUserActive();
    fetchUserRank();

  }, [location.pathname, navigate]);

  const AdminRoute = ({ children }) => {
    if (userRank === null) return null;
    return userRank === 'admin' ? children : <Navigate to="/" />;
  };

  return (
    <Routes>
      <Route 
        path="/login" 
        element={<Layout showNavbar={false} showSidebar={false} showFooter={false}><Login /></Layout>} 
      />
      <Route 
        path="/" 
        element={<Layout><HomePage /></Layout>} 
      />
      <Route 
        path="/inventario" 
        element={<Layout><Inventario /></Layout>} 
      />
      <Route 
        path="/logistica" 
        element={<Layout><Logistica /></Layout>} 
      />
      <Route 
        path="/pedidos" 
        element={<Layout><Pedidos /></Layout>} 
      />
    
      <Route 
        path="/user/config" 
        element={<Layout><UserConfig /></Layout>} 
      />
      <Route
        path="/admin/index"
        element={
          <AdminRoute>
            <Layout isAdmin={true}>
              <HousekeepingPage />
            </Layout>
          </AdminRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <AdminRoute>
            <Layout isAdmin={true}>
              <UsersPage />
            </Layout>
          </AdminRoute>
        }
      />
    </Routes>
  );
}