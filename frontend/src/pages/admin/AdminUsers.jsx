import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchUsers } from '@/features/admin/adminSlice'
import { Badge, SearchInput, PageHeader } from '@/components/ui'

export default function AdminUsers() {
  const dispatch = useDispatch()
  const { users } = useSelector(s => s.admin)
  const [search, setSearch] = useState('')

  useEffect(() => { dispatch(fetchUsers()) }, [])

  const filtered = users.filter(u =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <PageHeader title="User" highlight="Management" subtitle={`${users.length} registered users`} />
      <div className="mb-5 w-64"><SearchInput value={search} onChange={setSearch} placeholder="Search users..." /></div>
      <div className="bg-surface border border-[#333] rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-surface-2">
              {['User','Email','Total Orders','Joined','Status'].map(h => (
                <th key={h} className="px-5 py-3 text-left text-xs text-[#6b6460] font-medium uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(u => (
              <tr key={u._id} className="border-t border-[#1a1a1a] hover:bg-surface-2 transition-colors">
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-brand/20 text-brand flex items-center justify-center text-sm font-semibold flex-shrink-0">
                      {u.name?.[0]?.toUpperCase()}
                    </div>
                    <span className="font-medium text-sm">{u.name}</span>
                  </div>
                </td>
                <td className="px-5 py-3.5 text-sm text-[#a89f94]">{u.email}</td>
                <td className="px-5 py-3.5 text-sm font-semibold">{u.totalOrders || 0}</td>
                <td className="px-5 py-3.5 text-xs text-[#6b6460]">
                  {u.createdAt ? new Date(u.createdAt).toLocaleDateString('en-IN') : '—'}
                </td>
                <td className="px-5 py-3.5">
                  <Badge color={u.isActive !== false ? 'green' : 'gray'}>{u.isActive !== false ? 'Active' : 'Inactive'}</Badge>
                </td>
              </tr>
            ))}
            {!filtered.length && (
              <tr><td colSpan={5} className="px-5 py-10 text-center text-[#6b6460] text-sm">No users found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
