// src/api/axios.js
import axios from 'axios';

// 1. Включаем передачу кук и базовый URL
axios.defaults.withCredentials = true;
axios.defaults.baseURL = 'http://localhost:8000';

// 2. Функция для чтения куки
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

// 3. Перехватчик запросов (Interceptor)
axios.interceptors.request.use((config) => {
    const token = getCookie('XSRF-TOKEN');
    if (token) {
        config.headers['X-XSRF-TOKEN'] = decodeURIComponent(token);
    }
    return config;
});

export default axios;