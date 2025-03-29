
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { User, MessageSquare } from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';
import { formatDate } from '@/utils/formatUtils';

interface Comment {
  id: string;
  userId: string;
  username: string;
  text: string;
  createdAt: Date;
  avatarUrl?: string;
}

interface CommentSectionProps {
  photoId: string;
  comments: Comment[];
  onAddComment: (photoId: string, text: string) => void;
}

const CommentSection: React.FC<CommentSectionProps> = ({ 
  photoId, 
  comments, 
  onAddComment 
}) => {
  const { user } = useAuth();
  const [newComment, setNewComment] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      onAddComment(photoId, newComment);
      setNewComment('');
    }
  };

  if (comments.length === 0 && !isExpanded && !user) {
    return (
      <Button 
        variant="ghost" 
        size="sm" 
        className="flex items-center gap-1 text-muted-foreground"
        onClick={() => setIsExpanded(true)}
      >
        <MessageSquare size={16} />
        <span>Add comment</span>
      </Button>
    );
  }

  return (
    <div className="space-y-3">
      {(!isExpanded && comments.length > 0) ? (
        <Button 
          variant="ghost" 
          size="sm" 
          className="flex items-center gap-1 text-muted-foreground"
          onClick={() => setIsExpanded(true)}
        >
          <MessageSquare size={16} />
          <span>{comments.length} {comments.length === 1 ? 'comment' : 'comments'}</span>
        </Button>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium">
              {comments.length > 0 ? `Comments (${comments.length})` : 'Comments'}
            </h4>
            {isExpanded && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setIsExpanded(false)}
              >
                Close
              </Button>
            )}
          </div>

          {comments.length > 0 && (
            <div className="space-y-3">
              {comments.map((comment) => (
                <Card key={comment.id} className="bg-muted/50">
                  <CardContent className="p-3">
                    <div className="flex gap-3">
                      <Avatar className="h-8 w-8">
                        {comment.avatarUrl ? (
                          <AvatarImage src={comment.avatarUrl} />
                        ) : (
                          <AvatarFallback>
                            <User size={16} />
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium">{comment.username}</p>
                          <span className="text-xs text-muted-foreground">
                            {formatDate(comment.createdAt)}
                          </span>
                        </div>
                        <p className="mt-1 text-sm">{comment.text}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {user ? (
            <form onSubmit={handleSubmit} className="space-y-2">
              <Textarea
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="min-h-[80px]"
              />
              <div className="flex justify-end">
                <Button 
                  type="submit" 
                  disabled={!newComment.trim()}
                  size="sm"
                >
                  Post
                </Button>
              </div>
            </form>
          ) : (
            <Card className="bg-muted/50">
              <CardContent className="p-3">
                <p className="text-sm text-muted-foreground text-center">
                  Please sign in to comment
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default CommentSection;
