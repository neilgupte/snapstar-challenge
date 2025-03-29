
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

const SubmissionGuidelines: React.FC = () => {
  const isMobile = useIsMobile();
  
  const GuidelinesContent = () => (
    <div className="space-y-4 p-4">
      <ul className="space-y-3 text-sm text-muted-foreground">
        <li className="flex items-start gap-2">
          <Lock className="mt-0.5 h-4 w-4 flex-shrink-0" />
          <span>You can submit only one photo per contest</span>
        </li>
        <li className="flex items-start gap-2">
          <Lock className="mt-0.5 h-4 w-4 flex-shrink-0" />
          <span>Photos must be in JPEG or PNG format, maximum 10MB</span>
        </li>
        <li className="flex items-start gap-2">
          <Lock className="mt-0.5 h-4 w-4 flex-shrink-0" />
          <span>You must own the rights to any photo you submit</span>
        </li>
        <li className="flex items-start gap-2">
          <Lock className="mt-0.5 h-4 w-4 flex-shrink-0" />
          <span>All photos are subject to moderation before being displayed</span>
        </li>
        <li className="flex items-start gap-2">
          <Lock className="mt-0.5 h-4 w-4 flex-shrink-0" />
          <span>Photos must be taken during the active contest period</span>
        </li>
      </ul>
    </div>
  );
  
  if (isMobile) {
    return (
      <Drawer>
        <DrawerTrigger asChild>
          <Button variant="link" className="px-0 h-auto text-snapstar-purple">
            Submission Guidelines
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Submission Guidelines</DrawerTitle>
          </DrawerHeader>
          <GuidelinesContent />
        </DrawerContent>
      </Drawer>
    );
  }
  
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="link" className="px-0 h-auto text-snapstar-purple">
          Submission Guidelines
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Submission Guidelines</DialogTitle>
        </DialogHeader>
        <GuidelinesContent />
      </DialogContent>
    </Dialog>
  );
};

export default SubmissionGuidelines;
