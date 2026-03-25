import axios from 'axios';

const apiService = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
});

export const Get = async (url: string) => {
    const response = await apiService.get(url);
    return response.data;
};

export const Post = async (url: string, data: any) => {
    const response = await apiService.post(url, data);
    return response.data;
};

export const Put = async (url: string, data: any) => {
    const response = await apiService.put(url, data);
    return response.data;
};

export const Delete = async (url: string) => {
    const response = await apiService.delete(url);
    return response.data;
};
