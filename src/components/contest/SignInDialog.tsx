
import React from 'react';
import { Button } from '@/components/ui/button';
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';

interface SignInDialogProps {
  onSignIn: () => void;
  onSignUp: () => void;
  onClose: () => void;
}

const SignInDialog: React.FC<SignInDialogProps> = ({
  onSignIn,
  onSignUp,
  onClose
}) => {
  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Sign in required</DialogTitle>
        <DialogDescription>
          You need to sign in to vote on photos. It only takes a few moments.
        </DialogDescription>
      </DialogHeader>
      
      <div className="flex flex-col gap-4 py-4">
        <p className="text-center text-sm text-muted-foreground">
          Join our community to participate in contests, vote for photos, and showcase your photography skills.
        </p>
      </div>
      
      <DialogFooter className="gap-2 sm:gap-0">
        <Button variant="outline" onClick={onClose}>
          Maybe Later
        </Button>
        <div className="flex gap-2">
          <Button onClick={onSignIn}>
            Sign In
          </Button>
          <Button variant="outline" onClick={onSignUp}>
            Create Account
          </Button>
        </div>
      </DialogFooter>
    </DialogContent>
  );
};

export default SignInDialog;
