import axios from 'axios';

export const API_BASE_URL = 'https://nctdh23-new.onrender.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 60000, // 60s
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
      error.userFriendlyMessage = 'Máy chủ đang xử lý. Nếu mã OTP đã tới email, bạn có thể nhập mã ngay!';
    } else if (!error.response) {
      error.userFriendlyMessage = 'Không thể kết nối đến máy chủ Cloud. Vui lòng kiểm tra kết nối mạng!';
    }
    return Promise.reject(error);
  }
);

export default api;
