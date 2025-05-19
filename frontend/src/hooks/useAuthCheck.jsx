// src/hooks/useAuthCheck.js
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { isValidToken } from '..check_token/check_token'; // функция проверки токена

export const useAuthCheck = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const valid = await isValidToken();
      if (!valid) {
        navigate('/login', { replace: true });
      }
    };
    checkAuth();
  }, [navigate]);
};