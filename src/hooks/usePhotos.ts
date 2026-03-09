import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

interface Photo {
  id: string
  name: string
  url: string
  uploaded_at: string
}

export function usePhotos() {
  const [photos, setPhotos] = useState<Photo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch photos from Supabase on component mount
  useEffect(() => {
    fetchPhotos()
  }, [])

  const fetchPhotos = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('photos')
        .select('*')
        .order('uploaded_at', { ascending: false })

      if (error) throw error
      setPhotos(data || [])
      setError(null)
    } catch (err) {
      console.error('Error fetching photos:', err)
      setError('Failed to load photos')
    } finally {
      setLoading(false)
    }
  }

  const uploadPhoto = async (file: File) => {
    try {
      setError(null)

      // Step 1: Upload image file to Supabase Storage
      const fileName = `${Date.now()}-${file.name}`
      const { error: uploadError } = await supabase.storage
        .from('photos')
        .upload(`public/${fileName}`, file)

      if (uploadError) throw uploadError

      // Step 2: Get the public URL of the uploaded file
      const { data: urlData } = supabase.storage
        .from('photos')
        .getPublicUrl(`public/${fileName}`)

      // Step 3: Save the photo data to the database
      const { error: dbError } = await supabase
        .from('photos')
        .insert({
          name: file.name,
          url: urlData.publicUrl,
          storage_path: `public/${fileName}`,
          uploaded_at: new Date().toISOString()
        })

      if (dbError) throw dbError

      // Step 4: Refresh the photos list
      await fetchPhotos()
    } catch (err) {
      console.error('Error uploading photo:', err)
      setError('Failed to upload photo')
    }
  }

  const deletePhoto = async (id: string) => {
    try {
      setError(null)

      // Delete from database
      const { error } = await supabase
        .from('photos')
        .delete()
        .eq('id', id)

      if (error) throw error

      // Refresh the photos list
      await fetchPhotos()
    } catch (err) {
      console.error('Error deleting photo:', err)
      setError('Failed to delete photo')
    }
  }

  const clearAll = async () => {
    try {
      setError(null)

      // Delete all photos from database
      const { error } = await supabase
        .from('photos')
        .delete()
        .neq('id', '')

      if (error) throw error

      // Refresh the photos list
      await fetchPhotos()
    } catch (err) {
      console.error('Error clearing photos:', err)
      setError('Failed to clear photos')
    }
  }

  return { 
    photos, 
    loading, 
    error,
    uploadPhoto, 
    deletePhoto, 
    clearAll 
  }
}
