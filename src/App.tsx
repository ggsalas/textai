import { createBrowserRouter, Navigate, RouterProvider } from 'react-router'
import { RootLayout } from '@/routes/root'
import { LibrariesPage } from '@/routes/libraries'
import { LibraryLayout } from '@/routes/library-layout'
import { DocumentsPage } from '@/routes/documents'
import { SearchPage } from '@/routes/search'

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/libraries" replace />
      },
      {
        path: 'libraries',
        element: <LibrariesPage />
      },
      {
        path: 'libraries/:libraryId',
        element: <LibraryLayout />,
        children: [
          {
            index: true,
            element: <Navigate to="documents" replace />
          },
          {
            path: 'documents',
            element: <DocumentsPage />
          },
          {
            path: 'search',
            element: <SearchPage />
          }
        ]
      }
    ]
  }
])

export function App() {
  return <RouterProvider router={router} />
}
