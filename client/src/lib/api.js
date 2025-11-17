const ENV = import.meta.env;
const API_URL = `${ENV.VITE_API_PROTOCOL}://${ENV.VITE_API_HOST}:${ENV.VITE_API_PORT}${ENV.VITE_API_BASE}`;

const parseJSONSafe = async (res, contexto = "") => {
    const contentType = res.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
        return res.json();
    }

    const text = await res.text();
    console.error(`⚠ Respuesta NO JSON en ${contexto}. Status: ${res.status}`);
    console.error("Contenido devuelto por el servidor:\n", text);
    throw new Error(`El servidor devolvió HTML/texto en ${contexto}, no JSON`);
};

export const Users = {
    all: async () => {
        const res = await fetch(`${API_URL}/all`, {
            method: "GET",
            headers: {
                Accept: "application/json",
            },
        });

        if (!res.ok) {
            const text = await res.text();
            console.error("Error HTTP (all):", res.status, res.statusText);
            console.error("Body de error:\n", text);
            throw new Error(
                `Error al obtener usuarios: ${res.status} ${res.statusText}`
            );
        }

        return parseJSONSafe(res, "all");
    },

    create: async (body) => {
        const res = await fetch(`${API_URL}/save`, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });

        if (!res.ok) {
            const text = await res.text();
            console.error("Error HTTP (create):", res.status, res.statusText);
            console.error("Body de error:\n", text);
            throw new Error(
                `Error al crear usuario: ${res.status} ${res.statusText}`
            );
        }

        return parseJSONSafe(res, "create");
    },

    update: async (body) => {
        const res = await fetch(`${API_URL}/update`, {
            method: "PUT",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });

        if (!res.ok) {
            const text = await res.text();
            console.error("Error HTTP (update):", res.status, res.statusText);
            console.error("Body de error:\n", text);
            throw new Error(
                `Error al actualizar usuario: ${res.status} ${res.statusText}`
            );
        }

        return parseJSONSafe(res, "update");
    },

    remove: async (id) => {
        const res = await fetch(`${API_URL}/delete/${id}`, {
            method: "DELETE",
            headers: {
                Accept: "application/json",
            },
        });

        if (!res.ok) {
            const text = await res.text();
            console.error("Error HTTP (remove):", res.status, res.statusText);
            console.error("Body de error:\n", text);
            throw new Error(
                `Error al eliminar usuario: ${res.status} ${res.statusText}`
            );
        }

        try {
            return await parseJSONSafe(res, "remove");
        } catch {
            return true;
        }
    },
};