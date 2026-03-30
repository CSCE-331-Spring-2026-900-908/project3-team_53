import axios from 'axios';

const apiService = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    withCredentials: true,
});

export const Get = async (url: string) => {
    const response = await apiService.get(url + "/api");
    return response.data;
};

export const Post = async (url: string, data: any) => {
    const response = await apiService.post(url + "/api", data);
    return response.data;
};

export const Put = async (url: string, data: any) => {
    const response = await apiService.put(url + "/api", data);
    return response.data;
};

export const Patch = async (url: string, data?: any) => {
    const response = await apiService.patch(url + "/api", data);
    return response.data;
};

export const Delete = async (url: string) => {
    const response = await apiService.delete(url + "/api");
    return response.data;
};
