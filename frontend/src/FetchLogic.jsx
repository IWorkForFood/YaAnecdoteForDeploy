import axios from 'axios';

// Создаем экземпляр axios
const api = axios.create({
  baseURL: 'http://127.0.0.1/api/api/', // Базовый URL вашего API
  headers: {
    'Content-Type': 'application/json',
  },
});

// Функция для обновления accessToken
const refreshAccessToken = async () => {
  try {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) throw new Error('No refresh token available');

    const response = await axios.post('http://127.0.0.1/api/api/token/refresh/', {
      refresh: refreshToken,
    });

    const newAccessToken = response.data.access;
    localStorage.setItem('accessToken', newAccessToken);
    return newAccessToken;
  } catch (error) {
    console.error('Token refresh failed:', error);
    throw error; // Обрабатываем ошибку в вызывающем коде
  }
};

// Перехватчик запросов: добавляем accessToken в заголовки
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    console.log(token)
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Перехватчик ответов: обновляем токен при 401
api.interceptors.response.use(
  (response) => response, // Успешный ответ пропускаем
  async (error) => {
    const originalRequest = error.config;

    // Если получили 401 и это не повторный запрос
    if ((error.response?.status === 401 && !originalRequest._retry) || error.response?.status === 403) {
      originalRequest._retry = true; // Помечаем запрос как повторный

      try {
        const newAccessToken = await refreshAccessToken();
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest); // Повторяем исходный запрос с новым токеном
      } catch (refreshError) {
        // Если обновление токена не удалось, перенаправляем на логин
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        //window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;