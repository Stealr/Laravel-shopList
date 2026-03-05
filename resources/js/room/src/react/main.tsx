import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import axios from 'axios';
import '@styles/index.scss';

import App from './app/App.tsx';

// Получить CSRF-куку от Sanctum перед первым запросом
axios.get('/sanctum/csrf-cookie', { withCredentials: true }).finally(() => {
    createRoot(document.getElementById('room-root')!).render(
        <StrictMode>
            <App />
        </StrictMode>
    );
});
