import axios from 'axios';

const CLOUD_API_URL = 'https://nctdh23-new.onrender.com/api';

const getInitialBaseUrl = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    // If opened on localhost or 127.0.0.1
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return 'http://localhost:5000/api';
    }
    // If opened via LAN IP
    if (/^192\.168\./.test(hostname) || /^10\./.test(hostname) || /^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(hostname)) {
      return `http://${hostname}:5000/api`;
    }
  }
  return CLOUD_API_URL;
};

const api = axios.create({
  baseURL: getInitialBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 120000, // 120s for cloud cold starts and SMTP delivery
});

// Attach JWT token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Global response error handler with smart fallback to Cloud API
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If local backend is down and we haven't retried yet with cloud
    if (
      (!error.response || error.code === 'ERR_NETWORK' || error.message?.includes('Network Error')) &&
      originalRequest &&
      !originalRequest._retried &&
      originalRequest.baseURL !== CLOUD_API_URL &&
      !originalRequest.url?.startsWith(CLOUD_API_URL)
    ) {
      originalRequest._retried = true;
      console.warn('Backend cục bộ không phản hồi, tự động chuyển sang Cloud API:', CLOUD_API_URL);
      api.defaults.baseURL = CLOUD_API_URL;
      originalRequest.baseURL = CLOUD_API_URL;
      try {
        return await axios(originalRequest);
      } catch (retryErr) {
        return Promise.reject(retryErr);
      }
    }

    if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
      error.userFriendlyMessage = 'Máy chủ phản hồi chậm hoặc đang gửi mail. Nếu bạn đã nhận được mã trong email, hãy bấm nút "Đã nhận mã" để tiếp tục!';
    } else if (!error.response) {
      error.userFriendlyMessage = 'Không thể kết nối đến máy chủ Backend. Vui lòng kiểm tra kết nối mạng hoặc khởi động backend!';
    }
    return Promise.reject(error);
  }
);

export default api;
