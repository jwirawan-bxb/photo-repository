import { useState, useRef, useCallback } from 'react';
import './App.css';
import { usePhotos } from './hooks/usePhotos';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Upload, Trash2, Image as ImageIcon, X, Camera, Info } from 'lucide-react';
import { toast } from 'sonner';

function App() {
  const { photos, isLoading, uploadPhoto, deletePhoto, clearAllPhotos } = usePhotos();
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      setIsUploading(true);
      try {
        await uploadPhoto(file);
        toast.success('Photo uploaded successfully!');
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Failed to upload photo');
      } finally {
        setIsUploading(false);
      }
    },
    [uploadPhoto]
  );

  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer.files?.[0];
      if (!file) return;

      setIsUploading(true);
      try {
        await uploadPhoto(file);
        toast.success('Photo uploaded successfully!');
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Failed to upload photo');
      } finally {
        setIsUploading(false);
      }
    },
    [uploadPhoto]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const handleDelete = useCallback(
    async (id: string, e: React.MouseEvent) => {
      e.stopPropagation();
      try {
        await deletePhoto(id);
        toast.success('Photo deleted');
      } catch (error) {
        toast.error('Failed to delete photo');
      }
    },
    [deletePhoto]
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-violet-500 to-purple-600 p-2.5 rounded-xl shadow-lg shadow-violet-200">
                <Camera className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                  Photo Repository
                </h1>
                <p className="text-sm text-slate-500">Store and manage your memories</p>
              </div>
            </div>
            {photos.length > 0 && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm" className="gap-2">
                    <Trash2 className="w-4 h-4" />
                    Clear All
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete all photos?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete all {photos.length} photos from your repository.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={async () => {
                        try {
                          await clearAllPhotos();
                          toast.success('All photos deleted');
                        } catch (error) {
                          toast.error('Failed to delete all photos');
                        }
                      }} 
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Delete All
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </div>
      </header>

      {/* Info Banner */}
      <div className="bg-amber-50 border-b border-amber-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-amber-800">
              <p className="font-medium">Demo Mode: Photos are stored locally in your browser</p>
              <p className="text-amber-700 mt-1">
                To make photos visible to all visitors, connect to a backend service like{' '}
                <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-amber-900">Supabase</a>,{' '}
                <a href="https://firebase.google.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-amber-900">Firebase</a>, or your own server.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Upload Section */}
        <Card className="mb-8 border-2 border-dashed border-violet-200 bg-violet-50/50 hover:bg-violet-50 transition-colors">
          <CardContent className="p-8">
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              className="text-center"
            >
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-violet-200">
                <Upload className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">
                Upload Your Photos
              </h3>
              <p className="text-slate-500 mb-6 max-w-md mx-auto">
                Drag and drop an image here, or click the button below to browse your files
              </p>
              <div className="flex items-center justify-center gap-4">
                <Input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="photo-input"
                />
                <label htmlFor="photo-input">
                  <Button
                    asChild
                    disabled={isUploading}
                    className="bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white shadow-lg shadow-violet-200"
                  >
                    <span className="cursor-pointer">
                      {isUploading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <ImageIcon className="w-4 h-4 mr-2" />
                          Choose Photo
                        </>
                      )}
                    </span>
                  </Button>
                </label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        {!isLoading && (
          <div className="flex items-center justify-between mb-6">
            <p className="text-slate-600">
              <span className="font-semibold text-slate-800">{photos.length}</span>{' '}
              {photos.length === 1 ? 'photo' : 'photos'} in your repository
            </p>
          </div>
        )}

        {/* Gallery */}
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="aspect-square bg-slate-200 rounded-xl animate-pulse"
              />
            ))}
          </div>
        ) : photos.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ImageIcon className="w-12 h-12 text-slate-300" />
            </div>
            <h3 className="text-lg font-medium text-slate-700 mb-2">
              No photos yet
            </h3>
            <p className="text-slate-500">
              Upload your first photo to get started
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {photos.map((photo) => (
              <Dialog key={photo.id}>
                <DialogTrigger asChild>
                  <div className="group relative aspect-square cursor-pointer overflow-hidden rounded-xl bg-slate-100 shadow-sm hover:shadow-md transition-all duration-300">
                    <img
                      src={photo.url}
                      alt={photo.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                    <button
                      onClick={(e) => handleDelete(photo.id, e)}
                      className="absolute top-2 right-2 p-2 bg-white/90 hover:bg-white text-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-sm hover:shadow-md"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </DialogTrigger>
                <DialogContent className="max-w-4xl p-0 overflow-hidden bg-black/95 border-none">
                  <DialogHeader className="absolute top-4 left-4 z-10">
                    <DialogTitle className="text-white/80 text-sm font-normal">
                      {photo.name}
                    </DialogTitle>
                  </DialogHeader>
                  <img
                    src={photo.url}
                    alt={photo.name}
                    className="w-full h-auto max-h-[80vh] object-contain"
                  />
                </DialogContent>
              </Dialog>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-sm text-slate-500">
            Photo Repository - Store and manage your memories
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
