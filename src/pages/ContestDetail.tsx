import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Calendar, Clock, Upload, Star, AlertTriangle, Flag, 
  User, Trophy, Camera, Vote, Eye, Edit, Trash2 
} from 'lucide-react';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { useAuth } from '@/contexts/AuthContext';
import { 
  getContestById, getPhotosByContestId, submitPhoto, 
  hasUserSubmittedToContest, getUserVote, voteOnPhoto, deletePhoto 
} from '@/services/contestService';
import { Label } from '@/components/ui/label';
import { Check } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { useIsMobile } from '@/hooks/use-mobile';
import CommentSection from '@/components/CommentSection';
import { v4 as uuidv4 } from 'uuid';
import { validatePhotoForContest } from '@/utils/photoValidation';
import { photos } from '@/services/mockData';

interface Comment {
  id: string;
  userId: string;
  username: string;
  text: string;
  createdAt: Date;
  avatarUrl?: string;
}

const photoComments: Record<string, Comment[]> = {};

const ContestDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const [submitDialogOpen, setSubmitDialogOpen] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [selectedRating, setSelectedRating] = useState<number>(0);
  const [signInDialogOpen, setSignInDialogOpen] = useState(false);
  const [editSubmissionDialogOpen, setEditSubmissionDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const isMobile = useIsMobile();
  const [userVotes, setUserVotes] = useState<Record<string, number>>({});
  
  const { data: contest, isLoading: isLoadingContest } = useQuery({
    queryKey: ['contest', id],
    queryFn: () => getContestById(id || ''),
    enabled: !!id,
  });
  
  const { data: photos, isLoading: isLoadingPhotos } = useQuery({
    queryKey: ['contestPhotos', id],
    queryFn: () => getPhotosByContestId(id || ''),
    enabled: !!id,
  });
  
  const { data: hasSubmitted, isLoading: isCheckingSubmission } = useQuery({
    queryKey: ['hasSubmitted', id, user?.id],
    queryFn: () => hasUserSubmittedToContest(user?.id || '', id || ''),
    enabled: !!id && !!user,
  });
  
  const submitPhotoMutation = useMutation({
    mutationFn: async () => {
      if (!photoPreview || !user || !id) {
        throw new Error('Missing required data');
      }
      
      return submitPhoto(id, user.id, user.username, photoPreview, caption);
    },
    onSuccess: () => {
      toast.success('Photo submitted successfully!');
      setPhotoFile(null);
      setPhotoPreview(null);
      setCaption('');
      setSubmitDialogOpen(false);
      setEditSubmissionDialogOpen(false);
      
      queryClient.invalidateQueries({ queryKey: ['contestPhotos', id] });
      queryClient.invalidateQueries({ queryKey: ['hasSubmitted', id, user?.id] });
      queryClient.invalidateQueries({ queryKey: ['submissionCount', user?.id] });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to submit photo');
    },
  });
  
  const deletePhotoMutation = useMutation({
    mutationFn: async (photoId: string) => {
      if (!user) {
        throw new Error('You must be logged in to delete a photo');
      }
      
      return deletePhoto(photoId, user.id);
    },
    onSuccess: () => {
      toast.success('Photo deleted successfully!');
      setDeleteDialogOpen(false);
      
      queryClient.invalidateQueries({ queryKey: ['contestPhotos', id] });
      queryClient.invalidateQueries({ queryKey: ['hasSubmitted', id, user?.id] });
      queryClient.invalidateQueries({ queryKey: ['submissionCount', user?.id] });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete photo');
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
      
      setSelectedPhoto(null);
      setSelectedRating(0);
      
      queryClient.invalidateQueries({ queryKey: ['contestPhotos', id] });
      queryClient.invalidateQueries({ queryKey: ['userVote', variables.photoId, user?.id] });
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
    
    queryClient.invalidateQueries({ queryKey: ['contestPhotos', id] });
    
    toast.success('Comment added');
  };
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }
    
    if (file.size > 10 * 1024 * 1024) {
      toast.error('Image size should be less than 10MB');
      return;
    }
    
    if (contest && contest.status === 'active') {
      const validation = await validatePhotoForContest(file, contest.startDate, contest.endDate);
      
      if (!validation.isValid) {
        toast.error(validation.message);
        return;
      }
    }
    
    setPhotoFile(file);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      setPhotoPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };
  
  const handleSubmit = () => {
    if (!photoPreview) {
      toast.error('Please select a photo to upload');
      return;
    }
    
    submitPhotoMutation.mutate();
  };
  
  const handleDelete = (photoId: string) => {
    deletePhotoMutation.mutate(photoId);
  };
  
  const handleVote = (photoId: string, rating: number) => {
    if (!user) {
      setSignInDialogOpen(true);
      return;
    }
    
    setUserVotes(prev => ({
      ...prev,
      [photoId]: rating
    }));
    
    voteMutation.mutate({ photoId, rating });
  };

  const handleSignInClick = () => {
    navigate('/signin');
  };

  const handleSignUpClick = () => {
    navigate('/signup');
  };
  
  const renderStarRating = (photoId: string) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => handleVote(photoId, star)}
            className={`text-2xl transition-all ${
              star <= selectedRating && selectedPhoto === photoId
                ? 'text-snapstar-orange animate-pulse-star'
                : 'text-gray-300 hover:text-snapstar-orange'
            }`}
            disabled={voteMutation.isPending}
          >
            ★
          </button>
        ))}
      </div>
    );
  };
  
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };
  
  const getTimeRemaining = (date: Date) => {
    const now = new Date();
    const diff = date.getTime() - now.getTime();
    
    if (diff <= 0) return 'Ended';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) {
      return `${days} day${days !== 1 ? 's' : ''} left`;
    }
    return `${hours} hour${hours !== 1 ? 's' : ''} left`;
  };
  
  if (isLoadingContest) {
    return (
      <div className="container py-12 text-center">
        <p>Loading contest...</p>
      </div>
    );
  }
  
  if (!contest) {
    return (
      <div className="container py-12 text-center">
        <h2 className="text-2xl font-bold">Contest Not Found</h2>
        <p className="mt-2 text-muted-foreground">
          The contest you're looking for doesn't exist or has been removed.
        </p>
        <Button className="mt-6" onClick={() => navigate('/contests')}>
          Browse All Contests
        </Button>
      </div>
    );
  }
  
  const isActive = contest.status === 'active';
  const isVoting = contest.status === 'voting';
  const isCompleted = contest.status === 'completed';
  const canSubmit = isActive && user && !hasSubmitted && !isCheckingSubmission;
  
  const userSubmission = user ? photos?.find(photo => photo.userId === user.id) : null;
  
  return (
    <div className="container max-w-4xl py-6">
      <div className="mb-8 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold tracking-tight">{contest.title}</h1>
              <Badge
                className={`${
                  isActive ? 'bg-snapstar-green' :
                  isVoting ? 'bg-snapstar-blue' :
                  isCompleted ? 'bg-snapstar-gray' : 'bg-snapstar-orange'
                } text-white`}
              >
                {isActive ? 'Open for Entries' :
                 isVoting ? 'Voting' :
                 isCompleted ? 'Completed' : 'Upcoming'}
              </Badge>
            </div>
            <p className="mt-1 text-muted-foreground">
              Category: {contest.category.name}
            </p>
          </div>
          
          {canSubmit && (
            <div className="flex flex-col items-end gap-2">
              <Badge className="bg-snapstar-green text-white">
                Open for Entries
              </Badge>
              <Dialog open={submitDialogOpen} onOpenChange={setSubmitDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="bg-white text-black border-black hover:bg-gray-100">
                    <Camera size={16} className="mr-2" />
                    Submit Photo
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Submit your photo</DialogTitle>
                    <DialogDescription>
                      Upload your best shot for the "{contest.title}" contest
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-4 py-4">
                    {photoPreview ? (
                      <div className="relative overflow-hidden rounded-lg">
                        <AspectRatio ratio={16 / 9}>
                          <img
                            src={photoPreview}
                            alt="Preview"
                            className="h-full w-full object-cover"
                          />
                        </AspectRatio>
                        <Button
                          variant="destructive"
                          size="icon"
                          className="absolute right-2 top-2"
                          onClick={() => {
                            setPhotoFile(null);
                            setPhotoPreview(null);
                          }}
                        >
                          ✕
                        </Button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-dashed p-8">
                        <Upload className="h-8 w-8 text-muted-foreground" />
                        <div className="space-y-1 text-center">
                          <p className="text-sm font-medium">
                            Drag and drop or click to upload
                          </p>
                          <p className="text-xs text-muted-foreground">
                            JPEG or PNG, max 10MB
                          </p>
                        </div>
                        <input
                          type="file"
                          accept="image/jpeg,image/png"
                          className="hidden"
                          id="photo-upload"
                          onChange={handleFileChange}
                        />
                        <Button asChild variant="secondary" size="sm">
                          <label htmlFor="photo-upload">Select File</label>
                        </Button>
                      </div>
                    )}
                    
                    <div className="space-y-2">
                      <Label htmlFor="caption">Caption (optional)</Label>
                      <Textarea
                        id="caption"
                        placeholder="Add a description for your photo..."
                        value={caption}
                        onChange={(e) => setCaption(e.target.value)}
                        maxLength={200}
                      />
                      <div className="text-right text-xs text-muted-foreground">
                        {caption.length}/200
                      </div>
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <Button
                      variant="ghost"
                      onClick={() => setSubmitDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="outline"
                      className="bg-white text-black border-black hover:bg-gray-100"
                      onClick={handleSubmit}
                      disabled={!photoPreview || submitPhotoMutation.isPending}
                    >
                      {submitPhotoMutation.isPending ? 'Submitting...' : 'Submit Entry'}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          )}
          
          {isActive && user && hasSubmitted && userSubmission && (
            <div className="flex flex-col items-end gap-2">
              <div className="flex gap-2">
                <Button variant="outline" className="bg-white text-black border-black hover:bg-gray-100" onClick={() => setEditSubmissionDialogOpen(true)}>
                  <Edit size={16} className="mr-2" />
                  Edit
                </Button>
                <Button variant="destructive" onClick={() => setDeleteDialogOpen(true)}>
                  <Trash2 size={16} className="mr-2" />
                  Delete
                </Button>
              </div>
              
              <Dialog open={editSubmissionDialogOpen} onOpenChange={setEditSubmissionDialogOpen}>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Update your submission</DialogTitle>
                    <DialogDescription>
                      Replace your current photo for the "{contest.title}" contest
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium">Current submission:</h3>
                      <div className="relative overflow-hidden rounded-lg">
                        <AspectRatio ratio={16 / 9}>
                          <img
                            src={userSubmission.imageUrl}
                            alt="Current submission"
                            className="h-full w-full object-cover"
                          />
                        </AspectRatio>
                      </div>
                    </div>
                    
                    {photoPreview ? (
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium">New photo:</h3>
                        <div className="relative overflow-hidden rounded-lg">
                          <AspectRatio ratio={16 / 9}>
                            <img
                              src={photoPreview}
                              alt="Preview"
                              className="h-full w-full object-cover"
                            />
                          </AspectRatio>
                          <Button
                            variant="destructive"
                            size="icon"
                            className="absolute right-2 top-2"
                            onClick={() => {
                              setPhotoFile(null);
                              setPhotoPreview(null);
                            }}
                          >
                            ✕
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-dashed p-8">
                        <Upload className="h-8 w-8 text-muted-foreground" />
                        <div className="space-y-1 text-center">
                          <p className="text-sm font-medium">
                            Upload a new photo
                          </p>
                          <p className="text-xs text-muted-foreground">
                            JPEG or PNG, max 10MB
                          </p>
                        </div>
                        <input
                          type="file"
                          accept="image/jpeg,image/png"
                          className="hidden"
                          id="photo-upload-edit"
                          onChange={handleFileChange}
                        />
                        <Button asChild variant="secondary" size="sm">
                          <label htmlFor="photo-upload-edit">Select File</label>
                        </Button>
                      </div>
                    )}
                    
                    <div className="space-y-2">
                      <Label htmlFor="caption">Caption (optional)</Label>
                      <Textarea
                        id="caption"
                        placeholder="Add a description for your photo..."
                        value={caption || userSubmission.caption || ''}
                        onChange={(e) => setCaption(e.target.value)}
                        maxLength={200}
                      />
                      <div className="text-right text-xs text-muted-foreground">
                        {(caption || userSubmission.caption || '').length}/200
                      </div>
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <Button
                      variant="ghost"
                      onClick={() => {
                        setEditSubmissionDialogOpen(false);
                        setPhotoFile(null);
                        setPhotoPreview(null);
                        setCaption('');
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="outline"
                      className="bg-white text-black border-black hover:bg-gray-100"
                      onClick={handleSubmit}
                      disabled={!photoPreview || submitPhotoMutation.isPending}
                    >
                      {submitPhotoMutation.isPending ? 'Updating...' : 'Update Entry'}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              
              <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Delete your submission</DialogTitle>
                    <DialogDescription>
                      Are you sure you want to delete your submission for the "{contest.title}" contest?
                      This action cannot be undone.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="py-4">
                    <div className="relative overflow-hidden rounded-lg">
                      <AspectRatio ratio={16 / 9}>
                        <img
                          src={userSubmission.imageUrl}
                          alt="Submission to delete"
                          className="h-full w-full object-cover"
                        />
                      </AspectRatio>
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <Button
                      variant="ghost"
                      onClick={() => setDeleteDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => handleDelete(userSubmission.id)}
                      disabled={deletePhotoMutation.isPending}
                    >
                      {deletePhotoMutation.isPending ? 'Deleting...' : 'Delete Photo'}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          )}
        </div>
        
        <p className="text-lg">{contest.description}</p>
        
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-1">
            <Calendar size={18} className="text-muted-foreground" />
            <span>
              {isCompleted
                ? `Ended ${formatDate(contest.endDate)}`
                : isActive || isVoting
                ? `Closes ${formatDate(contest.endDate)}`
                : `Opens ${formatDate(contest.startDate)}`}
            </span>
          </div>
          
          {(isActive || isVoting) && (
            <div className="flex items-center gap-1">
              <Clock size={18} className="text-muted-foreground" />
              <span>{getTimeRemaining(contest.endDate)}</span>
            </div>
          )}
        </div>
      </div>
      
      {isLoadingPhotos ? (
        <div className="py-12 text-center">
          <p>Loading photos...</p>
        </div>
      ) : photos && photos.length > 0 ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">
              {isCompleted ? 'Results' : 'Entries'}
            </h2>
            <div className="text-sm text-muted-foreground">
              {photos.length} photo{photos.length !== 1 ? 's' : ''}
            </div>
          </div>
          
          <Carousel className="w-full">
            <CarouselContent>
              {photos.map((photo) => {
                const isUserPhoto = photo.userId === user?.id;
                
                return (
                <CarouselItem key={photo.id}>
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
                          user && !isUserPhoto ? (
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
                            <div>
                              {isUserPhoto ? (
                                <div className="text-xs text-muted-foreground">
                                  You can't vote on your own entry
                                </div>
                              ) : (
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  className="bg-white text-black border-black hover:bg-gray-100"
                                  onClick={() => setSignInDialogOpen(true)}
                                >
                                  <Vote size={14} className="mr-1" />
                                  Sign in to vote
                                </Button>
                              )}
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
                          comments={photoComments[photo.id] || []}
                          onAddComment={addComment}
                          onFlagComment={(commentId) => {
                            console.log(`Comment ${commentId} flagged for review`);
                            toast.success("Comment has been flagged for review");
                          }}
                        />
                      </div>
                    </CardFooter>
                  </Card>
                </CarouselItem>
                );
              })}
            </CarouselContent>
            {!isMobile && (
              <>
                <CarouselPrevious className="left-0" />
                <CarouselNext className="right-0" />
              </>
            )}
          </Carousel>
        </div>
      ) : (
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
              onClick={() => setSubmitDialogOpen(true)}
            >
              <Camera size={16} className="mr-2" />
              Submit Your Photo
            </Button>
          )}
        </div>
      )}
      
      {user && hasSubmitted && (
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
      )}
      
      {!user && (
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
            <Button onClick={() => navigate('/signin')}>Sign In</Button>
            <Button variant="outline" onClick={() => navigate('/signup')}>
              Create Account
            </Button>
          </div>
        </div>
      )}

      <Dialog open={signInDialogOpen} onOpenChange={setSignInDialogOpen}>
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
            <Button variant="outline" onClick={() => setSignInDialogOpen(false)}>
              Maybe Later
            </Button>
            <div className="flex gap-2">
              <Button onClick={handleSignInClick}>
                Sign In
              </Button>
              <Button variant="outline" onClick={handleSignUpClick}>
                Create Account
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ContestDetail;
