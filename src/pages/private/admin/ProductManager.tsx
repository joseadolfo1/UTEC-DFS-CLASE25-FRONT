import { useEffect, useState } from 'react'
import { Product, ProductRequest } from '../../../types/product'
import { Category } from '../../../types/category'
import { Modal } from '../../../components/Modal'
import { Button } from '../../../components/Button'
import { formatCurrency } from '../../../utils/formatCurrency'
import * as productApi from '../../../api/productApi'
import * as categoryApi from '../../../api/categoryApi'

const emptyForm = (): ProductRequest => ({
  name: '', description: '', price: 0, stock: 0, imageUrl: '', categoryId: 0,
})

export function ProductManager() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState<ProductRequest>(emptyForm())
  const [editingId, setEditingId] = useState<number | null>(null)

  const load = () => productApi.getAll().then(setProducts)

  useEffect(() => {
    load()
    categoryApi.getAll().then(setCategories)
  }, [])

  const openCreate = () => { setForm(emptyForm()); setEditingId(null); setModalOpen(true) }

  const openEdit = (p: Product) => {
    setForm({ name: p.name, description: p.description, price: p.price, stock: p.stock, imageUrl: p.imageUrl, categoryId: p.categoryId })
    setEditingId(p.id)
    setModalOpen(true)
  }

  const handleSave = async () => {
    if (editingId) {
      await productApi.update(editingId, form)
    } else {
      await productApi.create(form)
    }
    setModalOpen(false)
    load()
  }

  const handleDelete = async (id: number) => {
    if (confirm('¿Eliminar este producto?')) {
      await productApi.remove(id)
      load()
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Productos</h1>
        <Button onClick={openCreate}>+ Nuevo producto</Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
        <table className="w-full min-w-[700px]">
          <thead className="bg-gray-50 text-left text-sm text-gray-500">
            <tr>
              <th className="px-4 py-3">Nombre</th>
              <th className="px-4 py-3">Categoría</th>
              <th className="px-4 py-3">Precio</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {products.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{p.name}</td>
                <td className="px-4 py-3 text-gray-500 text-sm">{p.categoryName}</td>
                <td className="px-4 py-3 text-primary font-semibold">{formatCurrency(p.price)}</td>
                <td className="px-4 py-3 text-gray-600">{p.stock}</td>
                <td className="px-4 py-3 flex gap-2">
                  <Button variant="outline" onClick={() => openEdit(p)} className="text-sm px-3 py-1">Editar</Button>
                  <Button variant="danger" onClick={() => handleDelete(p.id)} className="text-sm px-3 py-1">Eliminar</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? 'Editar producto' : 'Nuevo producto'}>
        <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
          {[
            { label: 'Nombre', key: 'name' as const, type: 'text' },
            { label: 'URL de imagen', key: 'imageUrl' as const, type: 'text' },
            { label: 'Precio', key: 'price' as const, type: 'number' },
            { label: 'Stock', key: 'stock' as const, type: 'number' },
          ].map(({ label, key, type }) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
              <input
                type={type}
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary outline-none"
                value={form[key]}
                onChange={(e) => setForm({ ...form, [key]: type === 'number' ? Number(e.target.value) : e.target.value })}
              />
            </div>
          ))}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
            <textarea
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary outline-none"
              rows={2}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
            <select
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary outline-none"
              value={form.categoryId}
              onChange={(e) => setForm({ ...form, categoryId: Number(e.target.value) })}
            >
              <option value={0}>Selecciona una categoría</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex gap-3 pt-4">
          <Button variant="outline" onClick={() => setModalOpen(false)} className="flex-1">Cancelar</Button>
          <Button onClick={handleSave} className="flex-1">Guardar</Button>
        </div>
      </Modal>
    </div>
  )
}
