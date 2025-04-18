import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Flag, MessageSquare, Heart, User, Search, Calendar } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { getPhotosByContestId, voteOnPhoto } from '@/services/contestService';
import { photos } from '@/services/mockData';
import { Photo } from '@/types';
import { formatDate } from '@/utils/formatUtils';
import CommentSection from '@/components/CommentSection';
import { v4 as uuidv4 } from 'uuid';

interface Comment {
  id: string;
  userId: string;
  username: string;
  text: string;
  createdAt: Date;
  avatarUrl?: string;
}

const photoComments: Record<string, Comment[]> = {};

const Explore = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [selectedRating, setSelectedRating] = useState<number>(0);
  const [userVotes, setUserVotes] = useState<Record<string, number>>({});
  
  const { data: allPhotos, isLoading } = useQuery({
    queryKey: ['explorePhotos'],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 800));
      return photos.filter(photo => photo.moderationStatus === 'approved');
    },
  });
  
  const voteMutation = useMutation({
    mutationFn: async (params: { photoId: string; rating: number }) => {
      if (!user) {
        throw new Error('You must be logged in to vote');
      }
      
      return voteOnPhoto(params.photoId, user.id, params.rating);
    },
    onSuccess: (_, variables) => {
      toast.success('Vote submitted!');
      
      setUserVotes(prev => ({
        ...prev,
        [variables.photoId]: variables.rating
      }));
      
      setSelectedPhoto(null);
      setSelectedRating(0);
      
      queryClient.invalidateQueries({ queryKey: ['explorePhotos'] });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to submit vote');
    },
  });
  
  const addComment = (photoId: string, text: string) => {
    if (!user) return;
    
    const newComment: Comment = {
      id: uuidv4(),
      userId: user.id,
      username: user.username || 'User',
      text,
      createdAt: new Date(),
      avatarUrl: user.avatarUrl
    };
    
    if (!photoComments[photoId]) {
      photoComments[photoId] = [];
    }
    
    photoComments[photoId] = [...photoComments[photoId], newComment];
    
    queryClient.invalidateQueries({ queryKey: ['explorePhotos'] });
    
    toast.success('Comment added');
  };
  
  const handleVote = (photoId: string, rating: number) => {
    if (!user) {
      toast.error('Please sign in to vote');
      navigate('/signin');
      return;
    }
    
    voteMutation.mutate({ photoId, rating });
  };
  
  const filteredPhotos = allPhotos?.filter(photo => {
    if (!searchQuery) return true;
    
    const searchLower = searchQuery.toLowerCase();
    return (
      (photo.caption && photo.caption.toLowerCase().includes(searchLower)) ||
      photo.username.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="container max-w-4xl py-6">
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Explore Photos</h1>
          <p className="text-muted-foreground">
            Discover amazing photography and vote on your favorites
          </p>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by caption or photographer..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <Tabs defaultValue="recent">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="recent">Recent</TabsTrigger>
            <TabsTrigger value="popular">Popular</TabsTrigger>
            <TabsTrigger value="unrated" disabled={!user}>
              Unrated
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="recent" className="mt-4">
            {isLoading ? (
              <div className="grid gap-6 sm:grid-cols-2">
                {[1, 2, 3, 4].map((i) => (
                  <Card key={i} className="overflow-hidden">
                    <AspectRatio ratio={4 / 3}>
                      <Skeleton className="h-full w-full" />
                    </AspectRatio>
                    <CardHeader className="pb-2">
                      <Skeleton className="h-5 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                    </CardHeader>
                    <CardFooter>
                      <Skeleton className="h-8 w-full" />
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : filteredPhotos && filteredPhotos.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2">
                {filteredPhotos
                  .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
                  .map((photo) => (
                    <PhotoCard
                      key={photo.id}
                      photo={photo}
                      user={user}
                      selectedPhoto={selectedPhoto}
                      selectedRating={selectedRating}
                      setSelectedPhoto={setSelectedPhoto}
                      setSelectedRating={setSelectedRating}
                      handleVote={handleVote}
                      isPending={voteMutation.isPending}
                      userVote={userVotes[photo.id]}
                      comments={photoComments[photo.id] || []}
                      onAddComment={addComment}
                    />
                  ))}
              </div>
            ) : (
              <div className="py-12 text-center">
                <p className="text-muted-foreground">
                  {searchQuery
                    ? 'No photos found matching your search'
                    : 'No photos available'}
                </p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="popular" className="mt-4">
            {isLoading ? (
              <div className="grid gap-6 sm:grid-cols-2">
                {[1, 2, 3, 4].map((i) => (
                  <Card key={i} className="overflow-hidden">
                    <AspectRatio ratio={4 / 3}>
                      <Skeleton className="h-full w-full" />
                    </AspectRatio>
                    <CardHeader className="pb-2">
                      <Skeleton className="h-5 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                    </CardHeader>
                    <CardFooter>
                      <Skeleton className="h-8 w-full" />
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : filteredPhotos && filteredPhotos.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2">
                {filteredPhotos
                  .sort((a, b) => b.averageRating - a.averageRating)
                  .map((photo) => (
                    <PhotoCard
                      key={photo.id}
                      photo={photo}
                      user={user}
                      selectedPhoto={selectedPhoto}
                      selectedRating={selectedRating}
                      setSelectedPhoto={setSelectedPhoto}
                      setSelectedRating={setSelectedRating}
                      handleVote={handleVote}
                      isPending={voteMutation.isPending}
                      userVote={userVotes[photo.id]}
                      comments={photoComments[photo.id] || []}
                      onAddComment={addComment}
                    />
                  ))}
              </div>
            ) : (
              <div className="py-12 text-center">
                <p className="text-muted-foreground">
                  {searchQuery
                    ? 'No photos found matching your search'
                    : 'No photos available'}
                </p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="unrated" className="mt-4">
            {!user ? (
              <div className="rounded-lg border bg-muted p-6 text-center">
                <h3 className="text-lg font-medium">Sign in to see unrated photos</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  You need to be signed in to view and rate photos you haven't rated yet
                </p>
                <div className="mt-4">
                  <Button onClick={() => navigate('/signin')}>Sign In</Button>
                </div>
              </div>
            ) : isLoading ? (
              <div className="grid gap-6 sm:grid-cols-2">
                {[1, 2].map((i) => (
                  <Card key={i} className="overflow-hidden">
                    <AspectRatio ratio={4 / 3}>
                      <Skeleton className="h-full w-full" />
                    </AspectRatio>
                    <CardHeader className="pb-2">
                      <Skeleton className="h-5 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                    </CardHeader>
                    <CardFooter>
                      <Skeleton className="h-8 w-full" />
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center">
                <p className="text-muted-foreground">
                  You've rated all available photos!
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

interface PhotoCardProps {
  photo: Photo;
  user: any;
  selectedPhoto: string | null;
  selectedRating: number;
  setSelectedPhoto: (id: string | null) => void;
  setSelectedRating: (rating: number) => void;
  handleVote: (photoId: string, rating: number) => void;
  isPending: boolean;
  userVote?: number;
  comments: Comment[];
  onAddComment: (photoId: string, text: string) => void;
}

const PhotoCard: React.FC<PhotoCardProps> = ({
  photo,
  user,
  selectedPhoto,
  selectedRating,
  setSelectedPhoto,
  setSelectedRating,
  handleVote,
  isPending,
  userVote,
  comments,
  onAddComment
}) => {
  return (
    <Card className="overflow-hidden">
      <AspectRatio ratio={4 / 3}>
        <img
          src={photo.imageUrl}
          alt={photo.caption || 'Photo entry'}
          className="h-full w-full object-cover transition-all hover:scale-105"
        />
      </AspectRatio>
      
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-medium leading-none">
              {photo.caption || 'Untitled'}
            </h3>
            <div className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
              <User size={14} />
              <span>{photo.username}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-1 text-xs">
            <Calendar size={12} className="text-muted-foreground" />
            <span className="text-muted-foreground">
              {formatDate(photo.createdAt)}
            </span>
          </div>
        </div>
      </CardHeader>
      
      <CardFooter className="flex flex-col">
        <div className="flex justify-between w-full mb-2">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <div
                className="star-rating"
                onMouseLeave={() => {
                  if (selectedPhoto === photo.id) {
                    setSelectedPhoto(null);
                    setSelectedRating(0);
                  }
                }}
              >
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    className={`star-rating-item ${
                      userVote && rating <= userVote
                        ? 'active'
                        : selectedPhoto === photo.id && rating <= selectedRating
                        ? 'active animate-pulse-star'
                        : rating <= Math.round(photo.averageRating)
                        ? 'active'
                        : ''
                    }`}
                    onClick={() => handleVote(photo.id, rating)}
                    onMouseEnter={() => {
                      setSelectedPhoto(photo.id);
                      setSelectedRating(rating);
                    }}
                    disabled={isPending || photo.userId === user?.id || userVote !== undefined}
                    title={userVote !== undefined ? "You've already voted" : "Rate this photo"}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>
            
            <span className="text-sm">
              {photo.averageRating > 0 ? photo.averageRating.toFixed(1) : '-'}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Heart size={16} className="text-muted-foreground" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Flag size={16} className="text-muted-foreground" />
            </Button>
          </div>
        </div>
        
        <div className="w-full mt-2">
          <CommentSection 
            photoId={photo.id} 
            comments={comments}
            onAddComment={onAddComment}
          />
        </div>
      </CardFooter>
    </Card>
  );
};

export default Explore;
