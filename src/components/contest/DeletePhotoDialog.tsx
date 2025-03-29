
import React from 'react';
import { Button } from '@/components/ui/button';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Contest } from '@/types';
import { Photo } from '@/types';

interface DeletePhotoDialogProps {
  contest: Contest;
  photo: Photo;
  isPending: boolean;
  onDelete: () => void;
  onClose: () => void;
}

const DeletePhotoDialog: React.FC<DeletePhotoDialogProps> = ({
  contest,
  photo,
  isPending,
  onDelete,
  onClose
}) => {
  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Delete your submission</DialogTitle>
        <DialogDescription>
          Are you sure you want to delete your submission for the "{contest.title}" contest?
          This action cannot be undone.
        </DialogDescription>
      </DialogHeader>
      
      <div className="py-4">
        <div className="relative overflow-hidden rounded-lg">
          <AspectRatio ratio={16 / 9}>
            <img
              src={photo.imageUrl}
              alt="Submission to delete"
              className="h-full w-full object-cover"
            />
          </AspectRatio>
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
          variant="destructive"
          onClick={onDelete}
          disabled={isPending}
        >
          {isPending ? 'Deleting...' : 'Delete Photo'}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};

export default DeletePhotoDialog;
