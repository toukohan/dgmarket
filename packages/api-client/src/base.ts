import axios from "axios";

export const API_URL = "http://localhost:4000/api";

export function createBaseClient() {
    return axios.create({
        baseURL: API_URL,
        timeout: 10_000,
    });
}
