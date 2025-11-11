import { useEffect, useMemo, useState } from "react";
import "./index.css";
import { Users } from "./lib/api";

function Toast({ message, type = "success", onClose }) {
  if (!message) return null;
  const tone =
    type === "error"
      ? "border-red-200 text-red-700"
      : "border-emerald-200 text-emerald-700";
  return (
    <div className={`toast border ${tone}`}>
      <span className="mr-2">{type === "error" ? "⚠️" : "✅"}</span>
      <span>{message}</span>
      <button
        className="btn btn-ghost btn-sm ml-3"
        onClick={onClose}
        aria-label="Cerrar"
      >
        ✕
      </button>
    </div>
  );
}

function Confirm({
  open,
  title,
  message,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  onConfirm,
  onCancel,
}) {
  if (!open) return null;
  return (
    <div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div className="modal">
        <div className="card-header">
          <h3 className="text-base font-semibold">{title}</h3>
          <button
            className="btn btn-ghost"
            onClick={onCancel}
            aria-label="Cerrar"
          >
            ✕
          </button>
        </div>
        <div className="p-6 space-y-4">
          <p className="text-sm text-slate-700">{message}</p>
          <div className="flex gap-2 justify-end">
            <button className="btn" onClick={onCancel}>
              {cancelText}
            </button>
            <button className="btn btn-primary" onClick={onConfirm}>
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function UserForm({
  value,
  onSubmit,
  submitting,
  variant = "create",
  takenEmails = [],
  takenPhones = [],
}) {
  const [local, setLocal] = useState(
    value || { id: undefined, name: "", email: "", phoneNumber: "" }
  );
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setLocal(value || { id: undefined, name: "", email: "", phoneNumber: "" });
    setErrors({});
  }, [value]);

  const normEmail = (s) =>
    String(s || "")
      .trim()
      .toLowerCase();
  const normPhone = (s) => String(s || "").replace(/\D/g, "");

  const validate = () => {
    const e = {};
    if (!local.name?.trim()) e.name = "Escribe un nombre";
    if (!local.email?.trim()) e.email = "Escribe un email";
    if (!local.phoneNumber?.trim()) e.phoneNumber = "Escribe un teléfono";

    if (
      !e.email &&
      takenEmails.some((em) => normEmail(em) === normEmail(local.email))
    ) {
      e.email = "Este email ya está registrado";
    }
    if (
      !e.phoneNumber &&
      takenPhones.some((ph) => normPhone(ph) === normPhone(local.phoneNumber))
    ) {
      e.phoneNumber = "Este teléfono ya está registrado";
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    await onSubmit(local);
  };

  const change = (k) => (ev) => setLocal({ ...local, [k]: ev.target.value });

  return (
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-1 md:grid-cols-2 gap-4"
    >
      <div>
        <label className="label">Nombre</label>
        <input
          className={`input ${
            errors.name
              ? "border-red-500 focus:border-red-500 focus:ring-red-100"
              : ""
          }`}
          placeholder="Nombre"
          value={local.name ?? ""}
          onChange={change("name")}
        />
        {errors.name && <p className="error">{errors.name}</p>}
      </div>
      <div>
        <label className="label">Email</label>
        <input
          className={`input ${
            errors.email
              ? "border-red-500 focus:border-red-500 focus:ring-red-100"
              : ""
          }`}
          placeholder="email@dominio.com"
          value={local.email ?? ""}
          onChange={change("email")}
        />
        {errors.email && <p className="error">{errors.email}</p>}
      </div>
      <div>
        <label className="label">Teléfono</label>
        <input
          className={`input ${
            errors.phoneNumber
              ? "border-red-500 focus:border-red-500 focus:ring-red-100"
              : ""
          }`}
          placeholder="55-..."
          value={local.phoneNumber ?? ""}
          onChange={change("phoneNumber")}
        />
        {errors.phoneNumber && <p className="error">{errors.phoneNumber}</p>}
      </div>
      <div className="flex items-end gap-2">
        <button className="btn btn-primary" disabled={submitting} type="submit">
          {variant === "create" ? "Agregar" : "Guardar"}
        </button>
        <button
          className="btn"
          type="button"
          onClick={() => {
            setLocal({ id: local.id, name: "", email: "", phoneNumber: "" });
            setErrors({});
          }}
        >
          Limpiar
        </button>
      </div>
    </form>
  );
}

export default function App() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState({ message: "", type: "success" });

  const [panelOpen, setPanelOpen] = useState(false);
  const [panelMode, setPanelMode] = useState("create"); 
  const [panelData, setPanelData] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const load = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await Users.all();
      setItems(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e.message || String(e));
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => items, [items]);

  const openCreate = () => {
    setPanelMode("create");
    setPanelData({ name: "", email: "", phoneNumber: "" });
    setPanelOpen(true);
  };
  const openEdit = (u) => {
    setPanelMode("edit");
    setPanelData(u);
    setPanelOpen(true);
  };
  const closePanel = () => {
    setPanelOpen(false);
    setPanelData(null);
  };

  const createUser = async (payload) => {
    try {
      setLoading(true);
      setError("");
      await Users.create({
        name: payload.name,
        email: payload.email,
        phoneNumber: payload.phoneNumber,
      });
      await load();
      setToast({ message: "Usuario agregado", type: "success" });
      closePanel();
    } catch (e) {
      setToast({ message: e.message || "Error al crear", type: "error" });
      setError(e.message || String(e));
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (payload) => {
    try {
      setLoading(true);
      setError("");
      await Users.update({
        id: payload.id,
        name: payload.name,
        email: payload.email,
        phoneNumber: payload.phoneNumber,
      });
      await load();
      setToast({ message: "Usuario actualizado", type: "success" });
      closePanel();
    } catch (e) {
      setToast({ message: e.message || "Error al actualizar", type: "error" });
      setError(e.message || String(e));
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id) => {
    try {
      setLoading(true);
      setError("");
      await Users.remove(id);
      await load();
      setToast({ message: "Usuario eliminado", type: "success" });
      setConfirmDelete(null);
    } catch (e) {
      setToast({ message: e.message || "Error al eliminar", type: "error" });
      setError(e.message || String(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-full flex flex-col">
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: "" })}
      />

      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            Sistema de Gestión de Usuarios - 10C
          </div>
          <div className="flex items-center gap-2">
            <button className="btn btn-primary" onClick={openCreate}>
              + Agregar
            </button>
          </div>
        </div>
        <div className="h-1 bg-gradient-to-r from-blue-600 via-sky-400 to-emerald-400"></div>
      </header>

      <main
        className={`mx-auto w-full max-w-7xl px-4 py-6 grid gap-6 ${
          panelOpen ? "lg:grid-cols-[1fr_420px]" : ""
        }`}
      >
        <section className="card overflow-hidden">
          <div className="card-header">
            <h3 className="text-base font-semibold">Usuarios</h3>
            <span className="muted">{filtered?.length ?? 0} registro(s)</span>
          </div>

          {error && (
            <div className="px-6 pt-4 text-sm text-red-700">Error: {error}</div>
          )}
          

          <div className="overflow-auto">
            <table className="table">
              <thead>
                <tr>
                  <th className="th w-24">ID</th>
                  <th className="th">Nombre</th>
                  <th className="th">Email</th>
                  <th className="th">Teléfono</th>
                  <th className="th w-44">Acciones</th>
                </tr>
              </thead>
              <tbody className="[&_tr:nth-child(even)]:bg-slate-50/60">
                {(filtered || []).map((u) => (
                  <tr key={u.id}>
                    <td className="td">{u.id}</td>
                    <td className="td">{u.name}</td>
                    <td className="td">{u.email}</td>
                    <td className="td">{u.phoneNumber}</td>
                    <td className="td">
                      <div className="flex gap-2">
                        <button
                          className="btn btn-ghost btn-sm bg-yellow-300"
                          onClick={() => openEdit(u)}
                          disabled={loading}
                        >
                          Editar
                        </button>
                        <button
                          className="btn btn-ghost btn-sm bg-red-400"
                          onClick={() => setConfirmDelete(u)}
                          disabled={loading}
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {!loading && (!filtered || filtered.length === 0) && (
                  <tr>
                    <td className="td text-center text-slate-500" colSpan={5}>
                      Sin usuarios
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {panelOpen && (
          <aside className="card sticky-panel animate-panel-in">
            <div className="card-header">
              <h3 className="text-base font-semibold">
                {panelMode === "create" ? "Nuevo usuario" : "Editar usuario"}
              </h3>
              <button
                className="btn btn-ghost"
                onClick={closePanel}
                aria-label="Cerrar"
              >
                ✕
              </button>
            </div>
            <div className="p-6">
              {panelMode === "create" ? (
                <UserForm
                  value={panelData}
                  onSubmit={createUser}
                  submitting={loading}
                  variant="create"
                  takenEmails={(items || []).map((u) => u.email)}
                  takenPhones={(items || []).map((u) => u.phoneNumber)}
                />
              ) : (
                <UserForm
                  value={panelData}
                  onSubmit={updateUser}
                  submitting={loading}
                  variant="update"
                  takenEmails={(items || [])
                    .filter((u) => u.id !== panelData?.id)
                    .map((u) => u.email)}
                  takenPhones={(items || [])
                    .filter((u) => u.id !== panelData?.id)
                    .map((u) => u.phoneNumber)}
                />
              )}
            </div>
          </aside>
        )}
      </main>

      <footer className="border-t border-slate-200">
        <div className="mx-auto max-w-7xl px-4 py-4 text-xs text-slate-500">
          Carlos Galan Hernandez SGU-CGH-10C
        </div>
      </footer>

      <Confirm
        open={!!confirmDelete}
        title="Confirmar eliminación"
        message={
          confirmDelete
            ? `¿Eliminar a “${confirmDelete.name}”? Esta acción no se puede deshacer.`
            : ""
        }
        confirmText="Eliminar"
        cancelText="Cancelar"
        onConfirm={() => deleteUser(confirmDelete.id)}
        onCancel={() => setConfirmDelete(null)}
      />
    </div>
  );
}