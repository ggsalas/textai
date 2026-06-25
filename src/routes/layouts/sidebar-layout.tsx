import { Outlet } from 'react-router'
import { Sidebar } from '@/components/sidebar/Sidebar'

export function SidebarLayout() {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <aside className="w-72 flex-shrink-0 border-r border-gray-200 bg-white flex flex-col overflow-hidden">
        <Sidebar />
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden">
        <Outlet />
      </main>
    </div>
  )
}
