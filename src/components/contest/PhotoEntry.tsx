
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CardItem } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Card, CardHeader, CardFooter, CardTitle, CardDescription } from '@/components/ui/card';
import { User, Star, Trophy, Vote, Flag, Check } from 'lucide-react';
import CommentSection from '@/components/CommentSection';
import { Photo } from '@/types';
import { toast } from 'sonner';

interface PhotoEntryProps {
  photo: Photo;
  isUserPhoto: boolean;
  userVotes: Record<string, number>;
  isCompleted: boolean;
  isVoting: boolean;
  isActive: boolean;
  selectedPhoto: string | null;
  selectedRating: number;
  voteMutation: {
    isPending: boolean;
  };
  comments: any[];
  setSelectedPhoto: (id: string | null) => void;
  setSelectedRating: (rating: number) => void;
  handleVote: (photoId: string, rating: number) => void;
  setSignInDialogOpen: (open: boolean) => void;
  addComment: (photoId: string, text: string) => void;
}

const PhotoEntry: React.FC<PhotoEntryProps> = ({
  photo,
  isUserPhoto,
  userVotes,
  isCompleted,
  isVoting,
  isActive,
  selectedPhoto,
  selectedRating,
  voteMutation,
  comments,
  setSelectedPhoto,
  setSelectedRating,
  handleVote,
  setSignInDialogOpen,
  addComment
}) => {
  return (
    <Card className="mx-1 overflow-hidden">
      <AspectRatio ratio={4 / 3}>
        <img
          src={photo.imageUrl}
          alt={photo.caption || 'Contest entry'}
          className="h-full w-full object-cover"
        />
        {isUserPhoto && (
          <div className="absolute top-2 right-2 bg-snapstar-green text-white rounded-full p-1">
            <Check size={16} />
          </div>
        )}
      </AspectRatio>
      <CardHeader className="pb-2">
        <div className="flex justify-between">
          <div>
            <CardTitle className="text-lg">
              {photo.caption || 'Untitled'}
            </CardTitle>
            <CardDescription className="flex items-center gap-1">
              <User size={14} />
              <Link to={`/profile/${photo.userId}`}>
                {photo.username}
              </Link>
            </CardDescription>
          </div>
          
          {isCompleted && photo.averageRating >= 4.5 && (
            <Badge className="bg-snapstar-orange font-bold">
              <Trophy size={14} className="mr-1" /> Winner
            </Badge>
          )}
          
          {isUserPhoto && (
            <Badge variant="outline" className="border-snapstar-purple text-snapstar-purple">
              Your Entry
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardFooter className="flex flex-col">
        <div className="flex justify-between w-full">
          {isCompleted ? (
            <div className="flex items-center gap-2">
              <div className="flex text-snapstar-orange">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    fill={i < Math.round(photo.averageRating) ? 'currentColor' : 'none'}
                    className={i < Math.round(photo.averageRating) ? 'text-snapstar-orange' : 'text-gray-300'}
                  />
                ))}
              </div>
              <span className="text-sm font-medium">
                {photo.averageRating.toFixed(1)}
              </span>
              <span className="text-xs text-muted-foreground">
                ({photo.voteCount} votes)
              </span>
            </div>
          ) : isVoting ? (
            !isUserPhoto ? (
              <div className="flex flex-col items-start gap-1">
                <div
                  className="star-rating"
                  onMouseLeave={() => {
                    if (selectedPhoto === photo.id) {
                      setSelectedPhoto(null);
                      setSelectedRating(0);
                    }
                  }}
                >
                  {userVotes[photo.id] !== undefined ? (
                    <div className="flex items-center gap-2">
                      <div className="flex text-snapstar-orange">
                        {[1, 2, 3, 4, 5].map((rating) => (
                          <Star
                            key={rating}
                            size={16}
                            fill={rating <= userVotes[photo.id] ? 'currentColor' : 'none'}
                            className={rating <= userVotes[photo.id] ? 'text-snapstar-orange' : 'text-gray-300'}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-muted-foreground">Your vote: {userVotes[photo.id]}/5</span>
                    </div>
                  ) : (
                    <>
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <button
                          key={rating}
                          className={`star-rating-item ${
                            selectedPhoto === photo.id && rating <= selectedRating
                              ? 'active animate-pulse-star'
                              : ''
                          }`}
                          onClick={() => handleVote(photo.id, rating)}
                          onMouseEnter={() => {
                            setSelectedPhoto(photo.id);
                            setSelectedRating(rating);
                          }}
                          disabled={voteMutation.isPending}
                          title="Rate this photo"
                        >
                          ★
                        </button>
                      ))}
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="ml-2 bg-white text-black border-black hover:bg-gray-100"
                        onClick={() => {
                          if (selectedPhoto === photo.id && selectedRating > 0) {
                            handleVote(photo.id, selectedRating);
                          }
                        }}
                        disabled={selectedPhoto !== photo.id || selectedRating === 0 || voteMutation.isPending}
                      >
                        <Vote size={14} className="mr-1" />
                        Vote
                      </Button>
                    </>
                  )}
                </div>
                {userVotes[photo.id] === undefined && (
                  <span className="text-xs text-muted-foreground">
                    Rate this photo
                  </span>
                )}
              </div>
            ) : (
              <div className="text-xs text-muted-foreground">
                You can't vote on your own entry
              </div>
            )
          ) : (
            <div>
              {isUserPhoto ? (
                <div className="text-xs text-muted-foreground">
                  {isActive ? 'Voting starts after submission period' : ''}
                </div>
              ) : (
                <span className="text-xs text-muted-foreground">
                  {isActive
                    ? 'Voting starts after submission period'
                    : ''}
                </span>
              )}
            </div>
          )}
          
          {!isUserPhoto && (
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-destructive"
              title="Report Photo"
            >
              <Flag size={16} />
            </Button>
          )}
        </div>
        
        <div className="w-full mt-4">
          <CommentSection 
            photoId={photo.id} 
            comments={comments || []}
            onAddComment={addComment}
            onFlagComment={(commentId) => {
              console.log(`Comment ${commentId} flagged for review`);
              toast.success("Comment has been flagged for review");
            }}
          />
        </div>
      </CardFooter>
    </Card>
  );
};

export default PhotoEntry;
