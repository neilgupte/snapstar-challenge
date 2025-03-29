
import React, { useState } from 'react';
import { Flag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { isProfanity } from '@/utils/profanityFilter';

interface CommentFlaggingProps {
  commentId: string;
  text: string;
  onFlagged: (commentId: string) => void;
  flagCount?: number;
}

const CommentFlagging: React.FC<CommentFlaggingProps> = ({ 
  commentId, 
  text, 
  onFlagged,
  flagCount = 0 
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  
  const handleFlag = async () => {
    if (!user) {
      toast.error('Please sign in to flag comments');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Check if the comment contains profanity
      if (isProfanity(text)) {
        toast.success('Comment has been flagged and will be reviewed');
        onFlagged(commentId);
        return;
      }
      
      // If this is the second or more flag, re-check for profanity with stricter rules
      if (flagCount >= 1) {
        // More thorough profanity check (simulated for now)
        const containsProfanity = isProfanity(text, true);
        
        if (containsProfanity) {
          toast.success('Comment has been flagged and will be removed');
          onFlagged(commentId);
          return;
        }
      }
      
      // If this is the third flag or more, remove the comment
      if (flagCount >= 2) {
        toast.success('Comment has been flagged and will be removed due to multiple reports');
        onFlagged(commentId);
        return;
      }
      
      toast.success('Comment has been flagged for review');
      onFlagged(commentId);
      
    } catch (error) {
      toast.error('Failed to flag comment');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Button 
      variant="ghost" 
      size="icon" 
      className="h-8 w-8" 
      onClick={handleFlag}
      disabled={isLoading}
    >
      <Flag size={16} className={`${flagCount > 0 ? 'text-snapstar-red' : 'text-muted-foreground'}`} />
    </Button>
  );
};

export default CommentFlagging;
