import { Outlet, Link } from 'react-router-dom'

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-[#0d0d0d] flex flex-col">
      <div className="h-16 flex items-center px-8 border-b border-[#222]">
        <Link to="/" className="font-display text-xl text-brand">
          Pizz<span className="text-[#f0ebe3]">AIa</span>
        </Link>
      </div>
      <div className="flex-1 flex items-center justify-center p-4">
        <Outlet />
      </div>
    </div>
  )
}
