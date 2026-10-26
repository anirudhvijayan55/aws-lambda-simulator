import { localFetch } from './localBackend'

// When VITE_API_URL is set, talk to the Flask backend (backend/app.py).
// Otherwise use the in-browser backend so the app runs as a static site (GitHub Pages).
const REMOTE_API = import.meta.env.VITE_API_URL

export const API_BASE = (REMOTE_API || '') + '/api'

export const apiFetch = REMOTE_API ? (...args) => fetch(...args) : localFetch
