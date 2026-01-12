// packages/api-client/sellerClient.ts
import { createBaseClient } from "./base.js";

import type { AxiosError } from "axios";

const api = createBaseClient();

api.defaults.withCredentials = true;

let isRefreshing = false;
let refreshPromise: Promise<void> | null = null;

api.interceptors.response.use(
    (res) => res,
    async (error: AxiosError) => {
        const originalRequest = error.config as any;

        if (originalRequest?.url?.startsWith("/auth/")) {
            return Promise.reject(error);
        }

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
