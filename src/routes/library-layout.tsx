import { Outlet, NavLink, useParams } from 'react-router'

export function LibraryLayout() {
  const { libraryId } = useParams<{ libraryId: string }>()

  return (
    <div>
      <div className="mb-6">
        <nav className="flex gap-4 border-b border-surface-light pb-3">
          <NavLink
            to={`/libraries/${libraryId}/documents`}
            className={({ isActive }) =>
              `pb-2 text-sm font-medium ${
                isActive
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-slate-400 hover:text-white'
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
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-slate-400 hover:text-white'
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
