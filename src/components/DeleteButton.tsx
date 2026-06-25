import { useState, useEffect } from 'react'

interface DeleteButtonProps {
  onDelete: () => void
}

export function DeleteButton({ onDelete }: DeleteButtonProps) {
  const [confirmDelete, setConfirmDelete] = useState(false)

  useEffect(() => {
    if (confirmDelete) {
      const timer = setTimeout(() => setConfirmDelete(false), 3000)
      return () => clearTimeout(timer)
    }
  }, [confirmDelete])

  const handleClick = () => {
    if (!confirmDelete) {
      setConfirmDelete(true)
      return
    }
    onDelete()
  }

  return (
    <button
      onClick={handleClick}
      className={`w-auto h-6 px-2 rounded flex items-center justify-center text-sm transition-colors ${
        confirmDelete
          ? 'bg-red-100 text-red-700 hover:bg-red-200'
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
      }`}
      title={confirmDelete ? 'Click again to confirm' : 'Delete document'}
    >
      {confirmDelete ? '✓ Confirm delete' : '×'}
    </button>
  )
}
