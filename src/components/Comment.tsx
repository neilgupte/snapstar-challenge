
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { User, Flag } from "lucide-react";
import { toast } from 'sonner';
import { formatDate } from '@/utils/formatUtils';

interface CommentProps {
  id: string;
  userId: string;
  username: string;
  text: string;
  createdAt: Date;
  avatarUrl?: string;
  flagCount?: number;
  onFlagComment: (commentId: string) => void;
}

const Comment: React.FC<CommentProps> = ({
  id,
  userId,
  username,
  text,
  createdAt,
  avatarUrl,
  flagCount = 0,
  onFlagComment
}) => {
  const [isFlagged, setIsFlagged] = useState(false);
  
  const handleFlag = () => {
    if (isFlagged) {
      toast.error("You've already flagged this comment");
      return;
    }
    
    setIsFlagged(true);
    onFlagComment(id);
    toast.success("Comment has been flagged for review");
  };
  
  // If flagged by more than 2 accounts, add a muted style
  const isHighlyFlagged = flagCount >= 2;
  
  return (
    <Card className={`bg-muted/50 ${isHighlyFlagged ? 'opacity-50' : ''}`}>
      <CardContent className="p-3">
        <div className="flex gap-3">
          <Avatar className="h-8 w-8">
            {avatarUrl ? (
              <AvatarImage src={avatarUrl} />
            ) : (
              <AvatarFallback>
                <User size={16} />
              </AvatarFallback>
            )}
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">{username}</p>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">
                  {formatDate(createdAt)}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className={`h-6 w-6 ${isFlagged ? 'text-destructive' : 'text-muted-foreground hover:text-destructive'}`}
                  onClick={handleFlag}
                  title="Flag inappropriate content"
                >
                  <Flag size={14} />
                </Button>
              </div>
            </div>
            <p className="mt-1 text-sm">
              {isHighlyFlagged ? "This comment has been flagged for review" : text}
            </p>
            {isHighlyFlagged && (
              <p className="mt-1 text-xs text-muted-foreground">
                This comment is under review for possibly inappropriate content
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Comment;
