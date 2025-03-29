
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Camera } from 'lucide-react';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { Contest } from '@/types';

interface SubmitPhotoButtonProps {
  contest: Contest;
  submitDialogOpen: boolean;
  setSubmitDialogOpen: (open: boolean) => void;
}

const SubmitPhotoButton: React.FC<SubmitPhotoButtonProps> = ({
  contest,
  submitDialogOpen,
  setSubmitDialogOpen
}) => {
  return (
    <div className="flex flex-col items-end gap-2">
      <Badge className="bg-snapstar-green text-white">
        Open for Entries
      </Badge>
      <Dialog open={submitDialogOpen} onOpenChange={setSubmitDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="bg-white text-black border-black hover:bg-gray-100">
            <Camera size={16} className="mr-2" />
            Submit Photo
          </Button>
        </DialogTrigger>
      </Dialog>
    </div>
  );
};

export default SubmitPhotoButton;
