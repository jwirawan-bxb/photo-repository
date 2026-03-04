// Photo Storage Module
// Currently uses localStorage for demo purposes
// To make photos visible to all users, connect this to a backend service like:
// - Supabase (recommended): https://supabase.com
// - Firebase: https://firebase.google.com
// - Cloudinary + JSONBin
// - Your own backend

export interface Photo {
  id: string;
  url: string;
  name: string;
  uploadedAt: number;
}

const LOCAL_STORAGE_KEY = 'photo-repository-data';

// Get all photos from storage
export async function fetchPhotos(): Promise<Photo[]> {
  // Simulate network delay for realistic feel
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error('Failed to parse stored photos:', e);
    }
  }
  return [];
}

// Save photos to storage
export async function savePhotos(photos: Photo[]): Promise<void> {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(photos));
}

// Upload a new photo
export async function uploadPhoto(file: File): Promise<Photo> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('Please select an image file'));
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const url = e.target?.result as string;
        const newPhoto: Photo = {
          id: Date.now().toString(),
          url,
          name: file.name,
          uploadedAt: Date.now(),
        };

        // Add to existing photos
        const existingPhotos = await fetchPhotos();
        const updatedPhotos = [newPhoto, ...existingPhotos];
        await savePhotos(updatedPhotos);

        resolve(newPhoto);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

// Delete a photo by ID
export async function deletePhoto(photoId: string): Promise<void> {
  const photos = await fetchPhotos();
  const updatedPhotos = photos.filter(p => p.id !== photoId);
  await savePhotos(updatedPhotos);
}

// Clear all photos
export async function clearAllPhotos(): Promise<void> {
  await savePhotos([]);
}

// Subscribe to photo changes (polling for sync)
export function subscribeToPhotos(callback: (photos: Photo[]) => void): () => void {
  // Initial fetch
  fetchPhotos().then(callback);
  
  // Poll every 2 seconds for updates (simulates real-time sync)
  const interval = setInterval(async () => {
    const photos = await fetchPhotos();
    callback(photos);
  }, 2000);
  
  return () => clearInterval(interval);
}
