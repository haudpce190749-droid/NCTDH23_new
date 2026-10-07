import axios from 'axios';

export const API_BASE_URL = 'https://nctdh23-new.onrender.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 300000, // 5 minutes (300s) - no premature connection abort
});

// Attach JWT token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
      error.userFriendlyMessage = 'Máy chủ đang phản hồi hơi lâu. Nếu bạn đã nhận được mã trong email, bạn có thể chuyển qua bước nhập mã ngay!';
    } else if (!error.response) {
      error.userFriendlyMessage = 'Không thể kết nối đến máy chủ Cloud. Vui lòng kiểm tra lại kết nối mạng!';
    }
    return Promise.reject(error);
  }
);

export default api;
