
import React from 'react';
import { Button } from '@/components/ui/button';
import { Camera } from 'lucide-react';

interface NoEntriesProps {
  isActive: boolean;
  isCompleted: boolean;
  canSubmit: boolean;
  onSubmit: () => void;
}

const NoEntries: React.FC<NoEntriesProps> = ({
  isActive,
  isCompleted,
  canSubmit,
  onSubmit
}) => {
  return (
    <div className="rounded-lg border py-12 text-center">
      <div className="mx-auto flex w-16 h-16 items-center justify-center rounded-full bg-muted">
        <Camera size={24} className="text-muted-foreground" />
      </div>
      <h3 className="mt-4 text-lg font-semibold">No entries yet</h3>
      <p className="mt-2 text-sm text-muted-foreground">
        {isActive
          ? 'Be the first to submit a photo to this contest!'
          : isCompleted
          ? 'This contest ended without any entries.'
          : 'Check back later for entries.'}
      </p>
      {canSubmit && (
        <Button
          className="mt-6 bg-white text-black border border-black hover:bg-gray-100"
          onClick={onSubmit}
        >
          <Camera size={16} className="mr-2" />
          Submit Your Photo
        </Button>
      )}
    </div>
  );
};

export default NoEntries;
