import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Camera } from 'lucide-react';
import { Dialog } from '@/components/ui/dialog';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { useAuth } from '@/contexts/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { v4 as uuidv4 } from 'uuid';
import { validatePhotoForContest } from '@/utils/photoValidation';
import { 
  getContestById, getPhotosByContestId, submitPhoto, 
  hasUserSubmittedToContest, getUserVote, voteOnPhoto, deletePhoto 
} from '@/services/contestService';

import ContestHeader from '@/components/contest/ContestHeader';
import SubmitPhotoButton from '@/components/contest/SubmitPhotoButton';
import PhotoSubmissionDialog from '@/components/contest/PhotoSubmissionDialog';
import DeletePhotoDialog from '@/components/contest/DeletePhotoDialog';
import PhotoEntry from '@/components/contest/PhotoEntry';
import SignInDialog from '@/components/contest/SignInDialog';
import NoEntries from '@/components/contest/NoEntries';
import UserStatusBanner from '@/components/contest/UserStatusBanner';

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
      <ContestHeader 
        contest={contest} 
        isActive={isActive}
        isVoting={isVoting}
        isCompleted={isCompleted}
        formatDate={formatDate}
        getTimeRemaining={getTimeRemaining}
      />
      
      <div className="flex items-center justify-between mb-8">
        {canSubmit && (
          <SubmitPhotoButton 
            contest={contest} 
            submitDialogOpen={submitDialogOpen} 
            setSubmitDialogOpen={setSubmitDialogOpen} 
          />
        )}
        
        {isActive && user && hasSubmitted && userSubmission && (
          <div className="flex flex-col items-end gap-2">
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                className="bg-white text-black border-black hover:bg-gray-100" 
                onClick={() => setEditSubmissionDialogOpen(true)}
              >
                <Edit size={16} className="mr-2" />
                Edit
              </Button>
              <Button 
                variant="destructive" 
                onClick={() => setDeleteDialogOpen(true)}
              >
                <Trash2 size={16} className="mr-2" />
                Delete
              </Button>
            </div>
          </div>
        )}
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
                  <PhotoEntry 
                    photo={photo}
                    isUserPhoto={isUserPhoto}
                    userVotes={userVotes}
                    isCompleted={isCompleted}
                    isVoting={isVoting}
                    isActive={isActive}
                    selectedPhoto={selectedPhoto}
                    selectedRating={selectedRating}
                    voteMutation={voteMutation}
                    comments={photoComments[photo.id] || []}
                    setSelectedPhoto={setSelectedPhoto}
                    setSelectedRating={setSelectedRating}
                    handleVote={handleVote}
                    setSignInDialogOpen={setSignInDialogOpen}
                    addComment={addComment}
                  />
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
        <NoEntries 
          isActive={isActive}
          isCompleted={isCompleted}
          canSubmit={canSubmit}
          onSubmit={() => setSubmitDialogOpen(true)}
        />
      )}
      
      <UserStatusBanner 
        isLoggedIn={!!user}
        hasSubmitted={!!hasSubmitted}
        isActive={isActive}
        isVoting={isVoting}
        navigateToSignIn={handleSignInClick}
        navigateToSignUp={handleSignUpClick}
      />
      
      <Dialog open={submitDialogOpen} onOpenChange={setSubmitDialogOpen}>
        <PhotoSubmissionDialog
          contest={contest}
          photoPreview={photoPreview}
          caption={caption}
          isPending={submitPhotoMutation.isPending}
          setPhotoFile={setPhotoFile}
          setPhotoPreview={setPhotoPreview}
          setCaption={setCaption}
          handleFileChange={handleFileChange}
          handleSubmit={handleSubmit}
          onClose={() => setSubmitDialogOpen(false)}
        />
      </Dialog>
      
      <Dialog open={editSubmissionDialogOpen} onOpenChange={setEditSubmissionDialogOpen}>
        <PhotoSubmissionDialog
          contest={contest}
          photoPreview={photoPreview}
          caption={caption || userSubmission?.caption || ''}
          isPending={submitPhotoMutation.isPending}
          setPhotoFile={setPhotoFile}
          setPhotoPreview={setPhotoPreview}
          setCaption={setCaption}
          handleFileChange={handleFileChange}
          handleSubmit={handleSubmit}
          onClose={() => {
            setEditSubmissionDialogOpen(false);
            setPhotoFile(null);
            setPhotoPreview(null);
            setCaption('');
          }}
          isEdit={true}
          currentImageUrl={userSubmission?.imageUrl}
        />
      </Dialog>
      
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        {userSubmission && (
          <DeletePhotoDialog
            contest={contest}
            photo={userSubmission}
            isPending={deletePhotoMutation.isPending}
            onDelete={() => handleDelete(userSubmission.id)}
            onClose={() => setDeleteDialogOpen(false)}
          />
        )}
      </Dialog>
      
      <Dialog open={signInDialogOpen} onOpenChange={setSignInDialogOpen}>
        <SignInDialog
          onSignIn={handleSignInClick}
          onSignUp={handleSignUpClick}
          onClose={() => setSignInDialogOpen(false)}
        />
      </Dialog>
    </div>
  );
};

export default ContestDetail;
