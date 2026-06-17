import { Outlet, NavLink, useParams } from 'react-router'
import { useLibrary } from '@/hooks/useLibrary'

export function LibraryLayout() {
  const { libraryId } = useParams<{ libraryId: string }>()
  const { library, loading } = useLibrary(libraryId!)

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          {loading ? 'Loading...' : library?.name || 'Library'}
        </h1>
        <nav className="flex gap-4 border-b border-gray-200 pb-3">
          <NavLink
            to={`/libraries/${libraryId}/documents`}
            className={({ isActive }) =>
              `pb-2 text-sm font-medium ${
                isActive
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-500 hover:text-gray-900'
              }`
            }
          >
            Documents
          </NavLink>
          <NavLink
            to={`/libraries/${libraryId}/search`}
            className={({ isActive }) =>
              `pb-2 text-sm font-medium ${
                isActive
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-500 hover:text-gray-900'
              }`
            }
          >
            Search
          </NavLink>
        </nav>
      </div>
      <Outlet />
    </div>
  )
}
