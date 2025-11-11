const BASE = import.meta.env.VITE_API_URL || '';

async function request(path, options = {}) {
    const res = await fetch(`${BASE}${path}`, {
        headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
        ...options,
    });
    if (!res.ok) {
        const msg = await res.text().catch(() => res.statusText);
        throw new Error(msg || `HTTP ${res.status}`);
    }
    if (res.status === 204) return null;
    const contentType = res.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
        return await res.text();
    }
    return res.json();
}

export const Users = {
    all: () => request('/user/all'),
    byId: (id) => request(`/user/${id}`),
    create: (data) => request('/user/save', { method: 'POST', body: JSON.stringify(data) }),
    update: (data) => request('/user/update', { method: 'PUT', body: JSON.stringify(data) }),
    remove: (id) => request(`/user/delete/${id}`, { method: 'DELETE' }),
};