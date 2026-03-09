import { ChangeEvent, useState } from 'react'
import { usePhotos } from './hooks/usePhotos'
import { Upload, Trash2, X } from 'lucide-react'
import './App.css'

interface Photo {
  id: string
  name: string
  url: string
  uploaded_at: string
}

export default function App() {
  const { photos, loading, error, uploadPhoto, deletePhoto, clearAll } = usePhotos()
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  const handleFileSelect = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.currentTarget.files?.[0]
    if (!file) return

    setIsUploading(true)
    try {
      await uploadPhoto(file)
    } finally {
      setIsUploading(false)
      e.currentTarget.value = ''
    }
  }

  const handleClearAll = async () => {
    if (confirm('Are you sure you want to delete all photos?')) {
      await clearAll()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg p-2">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Photo Repository</h1>
                <p className="text-sm text-slate-600">Store and manage your memories</p>
              </div>
            </div>
            {photos.length > 0 && (
              <button
                onClick={handleClearAll}
                className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
              >
                <Trash2 className="w-4 h-4" />
                Clear All
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Banner */}
      {error && (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 mt-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">{error}</p>
          </div>
        </div>
      )}

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Upload Section */}
        <div className="mb-12">
          <label htmlFor="file-input" className="block">
            <div className="border-2 border-dashed border-purple-300 rounded-xl p-8 bg-purple-50/50 hover:bg-purple-100/50 cursor-pointer transition">
              <div className="flex flex-col items-center justify-center gap-4">
                <div className="bg-purple-500 rounded-full p-4">
                  <Upload className="w-8 h-8 text-white" />
                </div>
                <div className="text-center">
                  <h3 className="font-semibold text-slate-900 mb-1">Upload Your Photos</h3>
                  <p className="text-sm text-slate-600">Drag and drop an image here, or click the button below to browse your files</p>
                </div>
                <button
                  type="button"
                  disabled={isUploading || loading}
                  className="mt-4 px-6 py-2 bg-purple-500 text-white rounded-lg font-medium hover:bg-purple-600 disabled:opacity-50 transition"
                >
                  {isUploading ? 'Uploading...' : 'Choose Photo'}
                </button>
              </div>
            </div>
            <input
              id="file-input"
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              disabled={isUploading || loading}
              className="hidden"
            />
          </label>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block">
              <div className="w-8 h-8 border-4 border-purple-200 border-t-purple-500 rounded-full animate-spin"></div>
            </div>
            <p className="mt-4 text-slate-600">Loading photos...</p>
          </div>
        )}

        {/* Photos Grid */}
        {!loading && photos.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-slate-900 mb-6">
              {photos.length} {photos.length === 1 ? 'photo' : 'photos'} in your repository
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {photos.map((photo) => (
                <div
                  key={photo.id}
                  className="group relative bg-white rounded-lg overflow-hidden shadow hover:shadow-lg transition cursor-pointer"
                  onClick={() => setSelectedPhoto(photo)}
                >
                  <div className="aspect-square overflow-hidden bg-slate-100">
                    <img
                      src={photo.url}
                      alt={photo.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition"
                    />
                  </div>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition flex items-center justify-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        deletePhoto(photo.id)
                      }}
                      className="opacity-0 group-hover:opacity-100 transition bg-red-500 text-white p-2 rounded-full"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="p-3">
                    <p className="text-sm font-medium text-slate-900 truncate">{photo.name}</p>
                    <p className="text-xs text-slate-500">
                      {new Date(photo.uploaded_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && photos.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-4 opacity-50">
              <Upload className="w-8 h-8 text-slate-400" />
            </div>
            <p className="text-slate-600">No photos yet. Upload one to get started!</p>
          </div>
        )}
      </main>

      {/* Photo Modal */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedPhoto(null)}
        >
          <div className="relative max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute -top-10 right-0 text-white hover:text-gray-300"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={selectedPhoto.url}
              alt={selectedPhoto.name}
              className="w-full h-auto rounded-lg"
            />
            <div className="mt-4 bg-white rounded-lg p-4">
              <p className="font-medium text-slate-900">{selectedPhoto.name}</p>
              <p className="text-sm text-slate-600">
                Uploaded {new Date(selectedPhoto.uploaded_at).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
