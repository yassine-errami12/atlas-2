import { Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";

export function ImageUpload({
  onImagesChange,
  maxImages = 5,
  className,
}: {
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
  className?: string;
}) {
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    if (images.length + files.length > maxImages) {
      alert(`Vous pouvez télécharger maximum ${maxImages} images`);
      return;
    }

    setLoading(true);
    const newImages: string[] = [];
    let loaded = 0;

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          newImages.push(event.target.result as string);
        }
        loaded++;
        if (loaded === files.length) {
          const updated = [...images, ...newImages];
          setImages(updated);
          onImagesChange(updated);
          setLoading(false);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    const updated = images.filter((_, i) => i !== index);
    setImages(updated);
    onImagesChange(updated);
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div className="rounded-lg border-2 border-dashed border-muted-foreground/25 p-6 hover:border-muted-foreground/50 transition-colors">
        <label className="flex flex-col items-center gap-2 cursor-pointer">
          <Upload className="h-6 w-6 text-muted-foreground" />
          <div className="text-center">
            <p className="text-sm font-medium">Glissez les images ou cliquez pour sélectionner</p>
            <p className="text-xs text-muted-foreground">
              PNG, JPG ou WebP • Taille max 5MB • {images.length}/{maxImages}
            </p>
          </div>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            disabled={loading || images.length >= maxImages}
            className="hidden"
          />
        </label>
      </div>

      {images.length > 0 && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {images.map((image, index) => (
            <div key={index} className="relative group">
              <img
                src={image}
                alt={`Upload ${index + 1}`}
                className="w-full h-24 object-cover rounded-lg"
              />
              <Button
                type="button"
                size="icon"
                variant="destructive"
                className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => removeImage(index)}
              >
                <X className="h-3 w-3" />
              </Button>
              <p className="text-xs text-muted-foreground text-center mt-1">
                {index === 0 ? "Image principale" : `Image ${index + 1}`}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
