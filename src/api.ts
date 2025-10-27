// src/api.ts
import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || '', // in dev, lascia vuoto e usa il proxy Vite
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
});

// (opzionale) intercettore errori per messaggi più puliti
api.interceptors.response.use(
  (res) => res,
  (err) => {
    // log qui se vuoi
    return Promise.reject(err);
  }
);
