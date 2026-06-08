import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'
import { fetchInventory, deleteInventoryItem, updateInventoryItem } from '@/features/admin/adminSlice'
import { Badge, Button, SearchInput, PageHeader } from '@/components/ui'

export default function AdminInventory() {
  const dispatch = useDispatch()
  const { inventory, loading } = useSelector(s => s.admin)
  const [search, setSearch] = useState('')
  const [catFilter, setCatFilter] = useState('All')
  const [editModal, setEditModal] = useState(null)
  const [editForm, setEditForm] = useState({})

  useEffect(() => { dispatch(fetchInventory()) }, [])

  const lowStock = inventory.filter(i => i.stock <= i.threshold)
  const cats = ['All', ...new Set(inventory.map(i => i.category))]

  const filtered = inventory.filter(i => {
    const matchSearch = i.name.toLowerCase().includes(search.toLowerCase())
    const matchCat = catFilter === 'All' || i.category === catFilter
    return matchSearch && matchCat
  })

  const handleDelete = async (id, name) => {
    if (!confirm(`Remove "${name}" from inventory?`)) return
    const res = await dispatch(deleteInventoryItem(id))
    if (res.meta.requestStatus === 'fulfilled') toast.success(`${name} removed`)
    else toast.error('Delete failed')
  }

  const handleEdit = async () => {
    const res = await dispatch(updateInventoryItem({ id: editModal._id, payload: editForm }))
    if (res.meta.requestStatus === 'fulfilled') { toast.success('Updated!'); setEditModal(null) }
    else toast.error('Update failed')
  }

  return (
    <div>
      <PageHeader
        title="Inventory" highlight="Management"
        subtitle={`${inventory.length} items · ${lowStock.length} low stock`}
        action={<Button size="sm" onClick={() => toast.success('Add item form — connect to backend')}>+ Add Item</Button>}
      />

      {lowStock.length > 0 && (
        <div className="mb-5 p-4 bg-red-500/10 border border-red-500/30 rounded-2xl">
          <div className="font-semibold text-red-400 mb-2 text-sm">⚠️ Low Stock Alert</div>
          <div className="flex flex-wrap gap-2">
            {lowStock.map(i => (
              <span key={i._id} className="text-xs bg-red-500/20 text-red-300 px-3 py-1 rounded-full">
                {i.name}: <strong>{i.stock}</strong> left (threshold: {i.threshold})
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-3 mb-5 flex-wrap items-center justify-between">
        <div className="flex gap-2 flex-wrap">
          {cats.map(c => (
            <button key={c} onClick={() => setCatFilter(c)}
              className={`px-3 py-1.5 rounded-full text-xs border transition-all ${catFilter === c ? 'bg-brand border-brand text-white' : 'border-[#333] text-[#a89f94] hover:text-[#f0ebe3]'}`}>
              {c}
            </button>
          ))}
        </div>
        <div className="w-52"><SearchInput value={search} onChange={setSearch} placeholder="Search items..." /></div>
      </div>

      <div className="bg-surface border border-[#333] rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-surface-2">
              {['Item','Category','Stock','Threshold','Status','Actions'].map(h => (
                <th key={h} className="px-5 py-3 text-left text-xs text-[#6b6460] font-medium uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(item => (
              <tr key={item._id} className="border-t border-[#1a1a1a] hover:bg-surface-2 transition-colors">
                <td className="px-5 py-3.5 font-medium text-sm">{item.name}</td>
                <td className="px-5 py-3.5"><Badge color="gray">{item.category}</Badge></td>
                <td className={`px-5 py-3.5 font-bold text-sm ${item.stock <= item.threshold ? 'text-red-400' : 'text-[#f0ebe3]'}`}>{item.stock}</td>
                <td className="px-5 py-3.5 text-sm text-[#a89f94]">{item.threshold}</td>
                <td className="px-5 py-3.5">
                  <Badge color={item.stock > item.threshold ? 'green' : 'red'}>
                    {item.stock > item.threshold ? 'OK' : 'Low'}
                  </Badge>
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => { setEditModal(item); setEditForm({ name: item.name, stock: item.stock, threshold: item.threshold }) }}>✏️</Button>
                    <Button variant="danger" size="sm" onClick={() => handleDelete(item._id, item.name)}>🗑️</Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit modal */}
      <AnimatePresence>
        {editModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
            onClick={() => setEditModal(null)}
          >
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
              className="bg-surface border border-[#333] rounded-2xl p-6 w-full max-w-sm"
              onClick={e => e.stopPropagation()}
            >
              <h3 className="font-semibold mb-5">Edit: {editModal.name}</h3>
              <div className="space-y-4">
                <div><label className="form-label">Stock Quantity</label>
                  <input type="number" value={editForm.stock} onChange={e => setEditForm(f => ({ ...f, stock: +e.target.value }))} /></div>
                <div><label className="form-label">Threshold</label>
                  <input type="number" value={editForm.threshold} onChange={e => setEditForm(f => ({ ...f, threshold: +e.target.value }))} /></div>
              </div>
              <div className="flex gap-3 mt-5">
                <Button onClick={handleEdit} className="flex-1 justify-center">Save</Button>
                <Button variant="ghost" onClick={() => setEditModal(null)} className="flex-1 justify-center">Cancel</Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
