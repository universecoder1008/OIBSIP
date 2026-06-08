import { Outlet } from 'react-router-dom'
import Navbar from '@/components/layout/Navbar'

export default function UserLayout() {
  return (
    <div className="min-h-screen bg-[#0d0d0d] flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-8">
        <Outlet />
      </main>
    </div>
  )
}
