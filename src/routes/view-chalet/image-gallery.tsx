import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ChevronRight, X } from 'lucide-react';
import { ChaletImage } from './view-chalet-types';

export const ImageGallery = ({ images }: { images: ChaletImage[] }) => {
  const [showAll, setShowAll] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_selectedImage, setSelectedImage] = useState<number | null>(null);

  // Find main image
  const mainImage = images.find((img) => img.isMain) || images[0];
  const otherImages = images.filter((img) => img !== mainImage).slice(0, 4);

  return (
    <>
      <div className="relative">
        {/* Mobile View */}
        <div className="lg:hidden">
          <img src={mainImage.url} alt={mainImage.alt} className="w-full h-[300px] object-cover" />
          <Button
            className="absolute bottom-4 right-4 bg-white text-black hover:bg-gray-100"
            onClick={() => setShowAll(true)}
          >
            <ChevronRight className="h-4 w-4 mr-2" />
            Show all photos
          </Button>
        </div>

        {/* Desktop View */}
        <div className="hidden lg:grid grid-cols-4 gap-2">
          <div className="col-span-2 relative">
            <img
              src={mainImage.url}
              alt={mainImage.alt}
              className="w-full h-[400px] object-cover rounded-l-xl"
              onClick={() => setSelectedImage(0)}
            />
          </div>
          <div className="col-span-2 grid grid-cols-2 gap-2">
            {otherImages.map((image, index) => (
              <div key={image.id} className="relative h-[198px]">
                <img
                  src={image.url}
                  alt={image.alt}
                  className={`w-full h-full object-cover cursor-pointer ${
                    index === 1 ? 'rounded-tr-xl' : index === 3 ? 'rounded-br-xl' : ''
                  }`}
                  onClick={() => setSelectedImage(index + 1)}
                />
              </div>
            ))}
          </div>
          <Button
            className="absolute bottom-4 right-4 bg-white text-black hover:bg-gray-100"
            onClick={() => setShowAll(true)}
          >
            <ChevronRight className="h-4 w-4 mr-2" />
            Show all photos
          </Button>
        </div>
      </div>

      <Dialog open={showAll} onOpenChange={setShowAll}>
        <DialogContent className="max-w-5xl h-[90vh]">
          <DialogHeader>
            <DialogTitle className="flex justify-between items-center">
              <span>All Photos</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowAll(false)}
                className="absolute right-2 top-2 z-50 bg-rose-400 rounded-full hover:bg-red-500"
              >
                <X className="h-4 w-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 overflow-y-auto p-6">
            {images.map((image) => (
              <div key={image.id} className="space-y-2">
                <img
                  src={image.url}
                  alt={image.alt}
                  className="w-full h-64 object-cover rounded-lg"
                />
                {image.label && <p className="text-sm text-gray-600 px-1">{image.label}</p>}
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
