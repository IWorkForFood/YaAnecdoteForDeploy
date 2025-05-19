import { jwtDecode } from 'jwt-decode';

export const isValidToken = async () => {
    const token = await localStorage.getItem('accessToken');
    
    if (!token) return false;
    
    try {
      const decoded = jwtDecode(token);
      const now = Date.now() / 1000;
      if (decoded.exp < now) {
        return false;
      }
      return true;
    } catch (error) {
      return false;
    }
  };
