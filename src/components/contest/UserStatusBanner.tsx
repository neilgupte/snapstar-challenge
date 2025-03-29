
import React from 'react';
import { Check, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface UserStatusBannerProps {
  isLoggedIn: boolean;
  hasSubmitted: boolean;
  isActive: boolean;
  isVoting: boolean;
  navigateToSignIn: () => void;
  navigateToSignUp: () => void;
}

const UserStatusBanner: React.FC<UserStatusBannerProps> = ({
  isLoggedIn,
  hasSubmitted,
  isActive,
  isVoting,
  navigateToSignIn,
  navigateToSignUp
}) => {
  if (isLoggedIn && hasSubmitted) {
    return (
      <div className="mt-8 rounded-lg border bg-snapstar-light-purple p-4">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-snapstar-purple p-2 text-white">
            <Check size={16} />
          </div>
          <div>
            <h3 className="font-medium">You've entered this contest</h3>
            <p className="text-sm text-muted-foreground">
              {isActive
                ? "Your photo has been submitted. You can edit or delete your entry using the buttons at the top."
                : isVoting
                ? "The contest is now in the voting phase. You can't vote on your own photo."
                : "The contest has ended. Check the results to see how your photo performed."}
            </p>
          </div>
        </div>
      </div>
    );
  }
  
  if (!isLoggedIn) {
    return (
      <div className="mt-8 rounded-lg border bg-muted p-4">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-snapstar-orange p-2 text-white">
            <AlertTriangle size={16} />
          </div>
          <div>
            <h3 className="font-medium">Sign in to participate</h3>
            <p className="text-sm text-muted-foreground">
              {isActive
                ? "You need to sign in to submit a photo to this contest."
                : isVoting
                ? "You need to sign in to vote on photos."
                : "Sign in to see your past entries and contest results."}
            </p>
          </div>
        </div>
        <div className="mt-4 flex gap-2">
          <Button onClick={navigateToSignIn}>Sign In</Button>
          <Button variant="outline" onClick={navigateToSignUp}>
            Create Account
          </Button>
        </div>
      </div>
    );
  }
  
  return null;
};

export default UserStatusBanner;
