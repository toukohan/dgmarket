import axios, { AxiosError } from "axios";

import type { AxiosInstance } from "axios";
const URL = "http://localhost:4000/api";

const api: AxiosInstance = axios.create({
    baseURL: URL,
    withCredentials: true, // send cookies
    timeout: 10000,
});

let isRefreshing = false;
let refreshPromise: Promise<void> | null = null;

api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as any;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            if (!isRefreshing) {
                isRefreshing = true;
                refreshPromise = api
                    .post("/auth/refresh")
                    .then(() => {
                        isRefreshing = false;
                    })
                    .catch((err) => {
                        isRefreshing = false;
                        refreshPromise = null;

                        err.isAuthExpired = true;
                        throw err;
                    });
            }

            await refreshPromise;
            return api(originalRequest);
        }

        return Promise.reject(error);
    },
);

export default api;
