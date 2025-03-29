
import React from 'react';
import { Button } from '@/components/ui/button';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Upload } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Contest } from '@/types';

interface PhotoSubmissionDialogProps {
  contest: Contest;
  photoPreview: string | null;
  caption: string;
  isPending: boolean;
  setPhotoFile: (file: File | null) => void;
  setPhotoPreview: (preview: string | null) => void;
  setCaption: (caption: string) => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: () => void;
  onClose: () => void;
  isEdit?: boolean;
  currentImageUrl?: string;
}

const PhotoSubmissionDialog: React.FC<PhotoSubmissionDialogProps> = ({
  contest,
  photoPreview,
  caption,
  isPending,
  setPhotoFile,
  setPhotoPreview,
  setCaption,
  handleFileChange,
  handleSubmit,
  onClose,
  isEdit = false,
  currentImageUrl
}) => {
  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>{isEdit ? 'Update your submission' : 'Submit your photo'}</DialogTitle>
        <DialogDescription>
          {isEdit 
            ? `Replace your current photo for the "${contest.title}" contest` 
            : `Upload your best shot for the "${contest.title}" contest`}
        </DialogDescription>
      </DialogHeader>
      
      <div className="space-y-4 py-4">
        {isEdit && currentImageUrl && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Current submission:</h3>
            <div className="relative overflow-hidden rounded-lg">
              <AspectRatio ratio={16 / 9}>
                <img
                  src={currentImageUrl}
                  alt="Current submission"
                  className="h-full w-full object-cover"
                />
              </AspectRatio>
            </div>
          </div>
        )}
        
        {photoPreview ? (
          <div className={isEdit ? "space-y-2" : ""}>
            {isEdit && <h3 className="text-sm font-medium">New photo:</h3>}
            <div className="relative overflow-hidden rounded-lg">
              <AspectRatio ratio={16 / 9}>
                <img
                  src={photoPreview}
                  alt="Preview"
                  className="h-full w-full object-cover"
                />
              </AspectRatio>
              <Button
                variant="destructive"
                size="icon"
                className="absolute right-2 top-2"
                onClick={() => {
                  setPhotoFile(null);
                  setPhotoPreview(null);
                }}
              >
                ✕
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-dashed p-8">
            <Upload className="h-8 w-8 text-muted-foreground" />
            <div className="space-y-1 text-center">
              <p className="text-sm font-medium">
                {isEdit ? 'Upload a new photo' : 'Drag and drop or click to upload'}
              </p>
              <p className="text-xs text-muted-foreground">
                JPEG or PNG, max 10MB
              </p>
            </div>
            <input
              type="file"
              accept="image/jpeg,image/png"
              className="hidden"
              id={isEdit ? "photo-upload-edit" : "photo-upload"}
              onChange={handleFileChange}
            />
            <Button asChild variant="secondary" size="sm">
              <label htmlFor={isEdit ? "photo-upload-edit" : "photo-upload"}>Select File</label>
            </Button>
          </div>
        )}
        
        <div className="space-y-2">
          <Label htmlFor="caption">Caption (optional)</Label>
          <Textarea
            id="caption"
            placeholder="Add a description for your photo..."
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            maxLength={200}
          />
          <div className="text-right text-xs text-muted-foreground">
            {caption.length}/200
          </div>
        </div>
      </div>
      
      <DialogFooter>
        <Button
          variant="ghost"
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button
          variant="outline"
          className="bg-white text-black border-black hover:bg-gray-100"
          onClick={handleSubmit}
          disabled={!photoPreview || isPending}
        >
          {isPending ? (isEdit ? 'Updating...' : 'Submitting...') : (isEdit ? 'Update Entry' : 'Submit Entry')}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};

export default PhotoSubmissionDialog;
