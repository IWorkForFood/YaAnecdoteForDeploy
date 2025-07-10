import { Navigate, Outlet } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { isValidToken } from '../check_token/check_token';
import axios from 'axios';

const ProtectedRoute = () => {
  const [isAuth, setIsAuth] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshAccessToken = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) return false;

      const response = await axios.post(
        'http://127.0.0.1:8000/api/token/refresh/',
        { refresh: refreshToken }
      );

      

      localStorage.setItem('accessToken', response.data.access);
      console.log(response.data)
      return true;
    } catch (error) {
      console.error('Token refresh failed:', error);
      return false;
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Сначала проверяем текущий токен
        let isValid = await isValidToken();
        
        // Если токен невалиден, пробуем обновить
        if (!isValid) {
          const refreshSuccess = await refreshAccessToken();
          if (refreshSuccess) {
            isValid = await isValidToken(); // Проверяем новый токен
          }
        }

        setIsAuth(isValid);
      } catch (error) {
        console.error('Authentication check failed:', error);
        setIsAuth(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  console.log('isAyth', isAuth)

  if (loading) {
    return <div>Loading...</div>;
  }

  return isAuth ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;