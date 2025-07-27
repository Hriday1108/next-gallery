'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { AnimatePresence, motion } from 'framer-motion';
import { X, ArrowLeft, ArrowRight, Camera } from 'lucide-react';
import Image from 'next/image';
import type { Image as ImageType, Category } from '@/types';
import { cn } from '@/lib/utils';

const categories: Category[] = ['Nature', 'Architecture', 'Animals', 'Cityscapes'];

const initialImages: ImageType[] = [
  { id: '1', src: 'https://placehold.co/600x400.png', 'data-ai-hint': 'nature landscape', category: 'Nature', title: 'Mountain Vista' },
  { id: '2', src: 'https://placehold.co/600x400.png', 'data-ai-hint': 'modern architecture', category: 'Architecture', title: 'Modernist Building' },
  { id: '3', src: 'https://placehold.co/600x400.png', 'data-ai-hint': 'red fox', category: 'Animals', title: 'Curious Fox' },
  { id: '4', src: 'https://placehold.co/600x400.png', 'data-ai-hint': 'new york', category: 'Cityscapes', title: 'City at Dusk' },
  { id: '5', src: 'https://placehold.co/600x400.png', 'data-ai-hint': 'forest path', category: 'Nature', title: 'Forest Trail' },
  { id: '6', src: 'https://placehold.co/600x400.png', 'data-ai-hint': 'cathedral interior', category: 'Architecture', title: 'Gothic Cathedral' },
  { id: '7', src: 'https://placehold.co/600x400.png', 'data-ai-hint': 'wolf howling', category: 'Animals', title: 'Howling Wolf' },
  { id: '8', src: 'https://placehold.co/600x400.png', 'data-ai-hint': 'tokyo street', category: 'Cityscapes', title: 'Tokyo Crossing' },
  { id: '9', src: 'https://placehold.co/600x400.png', 'data-ai-hint': 'beach sunset', category: 'Nature', title: 'Ocean Sunset' },
  { id: '10', src: 'https://placehold.co/600x400.png', 'data-ai-hint': 'abstract building', category: 'Architecture', title: 'Abstract Facade' },
  { id: '11', src: 'https://placehold.co/600x400.png', 'data-ai-hint': 'eagle flying', category: 'Animals', title: 'Soaring Eagle' },
  { id: '12', src: 'https://placehold.co/600x400.png', 'data-ai-hint': 'paris street', category: 'Cityscapes', title: 'Parisian Cafe' },
];


export default function GalleryPage() {
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');
  const [selectedImage, setSelectedImage] = useState<ImageType | null>(null);

  const filteredImages = useMemo(() => {
    if (selectedCategory === 'All') {
      return initialImages;
    }
    return initialImages.filter((image) => image.category === selectedCategory);
  }, [selectedCategory]);

  const openLightbox = (image: ImageType) => {
    setSelectedImage(image);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };
  
  const navigate = (direction: 'next' | 'prev') => {
    if (!selectedImage) return;
    const currentIndex = filteredImages.findIndex(img => img.id === selectedImage.id);
    const newIndex = direction === 'next' ? (currentIndex + 1) % filteredImages.length : (currentIndex - 1 + filteredImages.length) % filteredImages.length;
    setSelectedImage(filteredImages[newIndex]);
  };


  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="py-8 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-primary">Image Gallery</h1>
        <p className="mt-3 text-lg text-muted-foreground">Explore our collection of beautiful images.</p>
      </header>

      <div className="container mx-auto px-4">
        <div className="flex justify-center flex-wrap gap-2 mb-8">
          <Button
            variant={selectedCategory === 'All' ? 'default' : 'outline'}
            onClick={() => setSelectedCategory('All')}
          >
            All
          </Button>
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>

        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <AnimatePresence>
            {filteredImages.length > 0 ? (
              filteredImages.map((image) => (
                <motion.div
                  key={image.id}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3 }}
                  className="group relative overflow-hidden rounded-lg cursor-pointer"
                  onClick={() => openLightbox(image)}
                >
                  <Image
                    src={image.src}
                    alt={image.title}
                    width={600}
                    height={400}
                    data-ai-hint={image['data-ai-hint']}
                    className="w-full h-auto object-cover aspect-square transform transition-transform duration-300 ease-in-out group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center">
                    <p className="text-white text-lg font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300">{image.title}</p>
                  </div>
                </motion.div>
              ))
            ) : (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="col-span-full text-center py-16 px-6 border-2 border-dashed rounded-lg"
                >
                  <Camera className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-medium">No images found</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    There are no images in the &quot;{selectedCategory}&quot; category.
                  </p>
                </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={closeLightbox}
          >
            <motion.div
                layoutId={selectedImage.id}
                className="relative"
                onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={selectedImage.src}
                alt={selectedImage.title}
                width={1200}
                height={800}
                data-ai-hint={selectedImage['data-ai-hint']}
                className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
              />
               <p className="text-white text-center mt-2 text-lg">{selectedImage.title}</p>
            </motion.div>

            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 text-white hover:text-white hover:bg-white/10"
              onClick={closeLightbox}
            >
              <X size={32} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-white hover:bg-white/10"
              onClick={(e) => {
                e.stopPropagation();
                navigate('prev');
              }}
            >
              <ArrowLeft size={32} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-white hover:bg-white/10"
              onClick={(e) => {
                e.stopPropagation();
                navigate('next');
              }}
            >
              <ArrowRight size={32} />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
      <footer className="text-center p-8 text-muted-foreground">
        <p>Gallery created with Next.js and Tailwind CSS.</p>
      </footer>
    </div>
  );
}
