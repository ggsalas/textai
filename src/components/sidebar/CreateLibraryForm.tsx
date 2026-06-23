import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router'
import { useLibraryActions } from '@/hooks/useLibraryActions'

interface CreateLibraryFormProps {
  onSuccess?: () => void
}

export function CreateLibraryForm({ onSuccess }: CreateLibraryFormProps) {
  const [name, setName] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { createLibrary } = useLibraryActions()
  const navigate = useNavigate()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const trimmedName = name.trim()
    if (!trimmedName || isSubmitting) return

    setIsSubmitting(true)
    try {
      const library = await createLibrary(trimmedName)
      setName('')
      onSuccess?.()
      navigate(`/libraries/${library.id}`)
    } catch (error) {
      console.error('Failed to create library:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="p-3 border-b border-gray-200">
      <div className="flex gap-2">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Library name"
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isSubmitting}
          autoFocus
        />
        <button
          type="submit"
          disabled={!name.trim() || isSubmitting}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-sm font-medium transition-colors"
        >
          Create
        </button>
      </div>
    </form>
  )
}
