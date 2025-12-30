import axios from 'axios';

let baseURL = import.meta.env.VITE_REACT_APP_BASE_URL || 'http://localhost:5000';

// Ensure baseURL is set
if (!baseURL) {
  console.warn('VITE_REACT_APP_BASE_URL not set, using default: http://localhost:5000');
  baseURL = 'http://localhost:5000';
}

const axiosInstance = axios.create({
  baseURL: baseURL,
  timeout: 10000, // 10 seconds timeout
});

axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    config.headers['Content-Type'] = 'application/json';
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for better error handling
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.code === 'ECONNREFUSED' || error.message.includes('Network Error')) {
      console.error('Backend connection failed. Make sure backend is running on', baseURL);
      error.response = {
        data: {
          success: false,
          message: 'Cannot connect to server. Please check if backend is running on http://localhost:5000'
        }
      };
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
