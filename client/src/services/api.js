import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers['x-auth-token'] = token;
    }
    return config;
});

export const authService = {
    login: (credentials) => api.post('/auth/login', credentials),
    register: (userData) => api.post('/auth/register', userData),
    getProfile: () => api.get('/auth/profile'),
    updateProfile: (data) => api.put('/auth/profile', data)
};

export const workoutService = {
    getAll: () => api.get('/workouts'),
    create: (workoutData) => api.post('/workouts', workoutData),
    update: (id, data) => api.put(`/workouts/${id}`, data),
    delete: (id) => api.delete(`/workouts/${id}`)
};

export const nutritionService = {
    getAll: () => api.get('/nutrition'),
    create: (mealData) => api.post('/nutrition', mealData),
    update: (id, data) => api.put(`/nutrition/${id}`, data),
    delete: (id) => api.delete(`/nutrition/${id}`)
};

export const goalService = {
    get: () => api.get('/goals'),
    update: (goalData) => api.put('/goals', goalData),
};

export const waterService = {
    getAll: () => api.get('/water'),
    create: (data) => api.post('/water', data),
    delete: (id) => api.delete(`/water/${id}`)
};

export const weightService = {
    getAll: () => api.get('/weight'),
    create: (data) => api.post('/weight', data),
    delete: (id) => api.delete(`/weight/${id}`)
};

export default api;
