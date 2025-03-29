
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Calendar, Clock, Upload, Star, AlertTriangle, Flag, User, Trophy } from 'lucide-react';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { useAuth } from '@/contexts/AuthContext';
import { getContestById, getPhotosByContestId, submitPhoto, hasUserSubmittedToContest, getUserVote, voteOnPhoto } from '@/services/contestService';

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
      
      // In a real app, we would upload the file to a storage service here
      // and then get the URL. For now, we'll just use the preview URL.
      return submitPhoto(id, user.id, user.username, photoPreview, caption);
    },
    onSuccess: () => {
      toast.success('Photo submitted successfully!');
      setPhotoFile(null);
      setPhotoPreview(null);
      setCaption('');
      setSubmitDialogOpen(false);
      
      // Refetch data
      queryClient.invalidateQueries({ queryKey: ['contestPhotos', id] });
      queryClient.invalidateQueries({ queryKey: ['hasSubmitted', id, user?.id] });
      queryClient.invalidateQueries({ queryKey: ['submissionCount', user?.id] });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to submit photo');
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
      
      // Reset UI state
      setSelectedPhoto(null);
      setSelectedRating(0);
      
      // Refetch data
      queryClient.invalidateQueries({ queryKey: ['contestPhotos', id] });
      queryClient.invalidateQueries({ queryKey: ['userVote', variables.photoId, user?.id] });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to submit vote');
    },
  });
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Basic validation
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }
    
    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      toast.error('Image size should be less than 10MB');
      return;
    }
    
    setPhotoFile(file);
    
    // Create preview
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
  
  const handleVote = (photoId: string, rating: number) => {
    if (!user) {
      toast.error('Please sign in to vote');
      navigate('/signin');
      return;
    }
    
    voteMutation.mutate({ photoId, rating });
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
            <Dialog open={submitDialogOpen} onOpenChange={setSubmitDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Upload size={16} className="mr-2" />
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
                    onClick={handleSubmit}
                    disabled={!photoPreview || submitPhotoMutation.isPending}
                  >
                    {submitPhotoMutation.isPending ? 'Submitting...' : 'Submit Entry'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
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
          
          <div className="grid gap-6 sm:grid-cols-2">
            {photos.map((photo) => (
              <Card key={photo.id} className="overflow-hidden">
                <AspectRatio ratio={4 / 3}>
                  <img
                    src={photo.imageUrl}
                    alt={photo.caption || 'Contest entry'}
                    className="h-full w-full object-cover transition-all hover:scale-105"
                  />
                </AspectRatio>
                <CardHeader className="pb-2">
                  <div className="flex justify-between">
                    <div>
                      <CardTitle className="text-lg">
                        {photo.caption || 'Untitled'}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-1">
                        <User size={14} />
                        {photo.username}
                      </CardDescription>
                    </div>
                    
                    {isCompleted && photo.averageRating >= 4.5 && (
                      <Badge className="bg-snapstar-orange font-bold">
                        <Trophy size={14} className="mr-1" /> Winner
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                
                <CardFooter className="flex justify-between pt-0">
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
                  ) : isVoting && user && photo.userId !== user.id ? (
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
                          >
                            ★
                          </button>
                        ))}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        Rate this photo
                      </span>
                    </div>
                  ) : (
                    <div>
                      {photo.userId === user?.id ? (
                        <Badge variant="outline">Your Entry</Badge>
                      ) : (
                        <span className="text-xs text-muted-foreground">
                          {isVoting
                            ? 'Sign in to vote'
                            : isActive
                            ? 'Voting starts after submission period'
                            : ''}
                        </span>
                      )}
                    </div>
                  )}
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-destructive"
                    title="Report Photo"
                  >
                    <Flag size={16} />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
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
              className="mt-6"
              onClick={() => setSubmitDialogOpen(true)}
            >
              <Upload size={16} className="mr-2" />
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
                  ? "Your photo has been submitted. You can't submit another photo to this contest."
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
    </div>
  );
};

export default ContestDetail;
