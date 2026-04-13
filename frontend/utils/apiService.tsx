import axios from 'axios';

const apiService = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    withCredentials: true,
});

apiService.interceptors.request.use((config) => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('auth_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
});

export const Get = async (url: string) => {
    const response = await apiService.get(url);
    return response.data;
};

export const Post = async (url: string, data?: unknown) => {
    const response = await apiService.post(url, data);
    return response.data;
};

/** Multipart upload; do not set Content-Type (axios adds boundary). */
export const postFormData = async (url: string, formData: FormData) => {
    const response = await apiService.post(url, formData);
    return response.data;
};

export const Put = async (url: string, data?: unknown) => {
    const response = await apiService.put(url, data);
    return response.data;
};

export const Patch = async (url: string, data?: unknown) => {
    const response = await apiService.patch(url, data);
    return response.data;
};

export const Delete = async (url: string) => {
    const response = await apiService.delete(url);
    return response.data;
};
