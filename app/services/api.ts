/// <reference types="vite/client" />
import axios from "axios";

// If your project doesn't include vite types, a minimal fallback:
declare global {
    interface ImportMetaEnv {
        VITE_API_URL?: string;
    }
    interface ImportMeta {
        readonly env: ImportMetaEnv;
    }
}

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL ?? "http://127.0.0.1:8000",
    timeout: 10000,
    //withCredentials: true, // ha kell cookie (pl. refresh token)
});

// Auth header (ha van access token)
api.interceptors.request.use((cfg) => {
    const token = localStorage.getItem("access_token");
    if (token) cfg.headers.Authorization = `Bearer ${token}`;
    return cfg;
});

export function toErrorMessage(err: unknown) {
    if (axios.isAxiosError(err)) {
        const status = err.response?.status;
        const msg =
            (err.response?.data as any)?.message ??
            (err.response?.data as any)?.error ??
            err.message;
        return status ? `${status} – ${msg} `: msg;
    }
    return "Unknown error";
}