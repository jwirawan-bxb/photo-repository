import { useState, useEffect, useCallback } from 'react';
import { 
  uploadPhoto as uploadPhotoToStorage, 
  deletePhoto as deletePhotoFromStorage, 
  fetchPhotos,
  subscribeToPhotos,
  clearAllPhotos as clearAllPhotosFromStorage,
  type Photo
} from '@/lib/storage';

export { type Photo };

export function usePhotos() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load initial photos and subscribe to updates
  useEffect(() => {
    let mounted = true;

    const loadPhotos = async () => {
      try {
        const initialPhotos = await fetchPhotos();
        if (mounted) {
          setPhotos(initialPhotos);
        }
      } catch (error) {
        console.error('Failed to load photos:', error);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    loadPhotos();

    // Subscribe to updates (polling for changes)
    const unsubscribe = subscribeToPhotos((updatedPhotos) => {
      if (mounted) {
        setPhotos(updatedPhotos);
      }
    });

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, []);

  const uploadPhoto = useCallback(async (file: File): Promise<void> => {
    await uploadPhotoToStorage(file);
    // Refresh photos after upload
    const updatedPhotos = await fetchPhotos();
    setPhotos(updatedPhotos);
  }, []);

  const deletePhoto = useCallback(async (photoId: string): Promise<void> => {
    await deletePhotoFromStorage(photoId);
    // Refresh photos after delete
    const updatedPhotos = await fetchPhotos();
    setPhotos(updatedPhotos);
  }, []);

  const clearAllPhotos = useCallback(async (): Promise<void> => {
    await clearAllPhotosFromStorage();
    setPhotos([]);
  }, []);

  return {
    photos,
    isLoading,
    uploadPhoto,
    deletePhoto,
    clearAllPhotos,
  };
}
