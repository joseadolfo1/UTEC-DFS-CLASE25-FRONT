import { useEffect, useState } from "react";
import { Category, CategoryRequest } from "../../../types/category";
import { Modal } from "../../../components/Modal";
import { Button } from "../../../components/Button";
import * as categoryApi from "../../../api/categoryApi";

const empty: CategoryRequest = { name: "", description: "" };

export function CategoryManager() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState<CategoryRequest>(empty);
  const [editingId, setEditingId] = useState<number | null>(null);

  const load = () => categoryApi.getAll().then(setCategories);

  useEffect(() => {
    load();
  }, []);

  const openCreate = () => {
    setForm(empty);
    setEditingId(null);
    setModalOpen(true);
  };
  const openEdit = (cat: Category) => {
    setForm({ name: cat.name, description: cat.description });
    setEditingId(cat.id);
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (editingId) {
      await categoryApi.update(editingId, form);
    } else {
      await categoryApi.create(form);
    }
    setModalOpen(false);
    load();
  };

  const handleDelete = async (id: number) => {
    if (confirm("¿Eliminar esta categoría?")) {
      await categoryApi.remove(id);
      load();
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Categorías</h1>
        <Button onClick={openCreate}>+ Nueva categoría</Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 text-left text-sm text-gray-500">
            <tr>
              <th className="px-6 py-3">ID</th>
              <th className="px-6 py-3">Nombre</th>
              <th className="px-6 py-3">Descripción</th>
              <th className="px-6 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {categories.map((cat) => (
              <tr key={cat.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-gray-400 text-sm">{cat.id}</td>
                <td className="px-6 py-4 font-medium">{cat.name}</td>
                <td className="px-6 py-4 text-gray-500 text-sm">
                  {cat.description}
                </td>
                <td className="px-6 py-4 flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => openEdit(cat)}
                    className="text-sm px-3 py-1"
                  >
                    Editar
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => handleDelete(cat.id)}
                    className="text-sm px-3 py-1"
                  >
                    Eliminar
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? "Editar categoría" : "Nueva categoría"}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre
            </label>
            <input
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary outline-none"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descripción
            </label>
            <textarea
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary outline-none"
              rows={3}
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
          </div>
          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              onClick={() => setModalOpen(false)}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button onClick={handleSave} className="flex-1">
              Guardar
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
