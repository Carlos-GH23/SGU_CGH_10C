const API_BASE = (import.meta.env.VITE_API_BASE || 'http://localhost:8081/user').replace(/\/$/, '');

export const Users = {
    all: () => fetch(`${API_BASE}/all`).then(r => r.json()),
    create: (b) => fetch(`${API_BASE}/save`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(b) }).then(r => r.json()),
    update: (b) => fetch(`${API_BASE}/update`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(b) }).then(r => r.json()),
    remove: (id) => fetch(`${API_BASE}/delete/${id}`, { method: 'DELETE' })
};
