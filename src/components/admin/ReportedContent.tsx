
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, X, ShieldAlert } from 'lucide-react';
import { Photo } from '@/types';

interface ReportedPhoto extends Photo {
  reportReason: string;
  reportedBy: string;
  reportedAt: Date;
}

interface ReportedContentProps {
  reportedPhotos: ReportedPhoto[];
}

const ReportedContent: React.FC<ReportedContentProps> = ({ reportedPhotos }) => {
  if (reportedPhotos.length === 0) {
    return (
      <div className="rounded-lg border p-8 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
          <Check className="h-6 w-6 text-snapstar-green" />
        </div>
        <h3 className="mt-4 text-lg font-semibold">All Clear</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          There are no reported photos to review at this time.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reportedPhotos.map((photo) => (
        <Card key={photo.id}>
          <div className="flex flex-col sm:flex-row">
            <div className="w-full sm:w-1/3">
              <img
                src={photo.imageUrl}
                alt={photo.caption || 'Reported photo'}
                className="aspect-square h-full w-full object-cover sm:rounded-l-lg"
              />
            </div>
            <div className="flex flex-1 flex-col justify-between p-4">
              <div>
                <div className="flex items-center gap-2">
                  <ShieldAlert className="h-5 w-5 text-snapstar-red" />
                  <h3 className="font-semibold">{photo.caption || 'Untitled'}</h3>
                </div>
                <div className="mt-2 space-y-2 text-sm">
                  <p>
                    <span className="font-medium">Reported by:</span>{' '}
                    {photo.reportedBy}
                  </p>
                  <p>
                    <span className="font-medium">Reason:</span>{' '}
                    {photo.reportReason}
                  </p>
                  <p>
                    <span className="font-medium">Submitted by:</span>{' '}
                    {photo.username}
                  </p>
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <Button size="sm" className="gap-1 bg-snapstar-green hover:bg-snapstar-green/90">
                  <Check className="h-4 w-4" />
                  Approve
                </Button>
                <Button size="sm" variant="destructive" className="gap-1">
                  <X className="h-4 w-4" />
                  Remove
                </Button>
                <Button size="sm" variant="outline">
                  Review Contest
                </Button>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default ReportedContent;
