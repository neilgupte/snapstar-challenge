
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { getActiveContests, getUserSubmissionCount } from '@/services/contestService';
import { Upload, Image, Camera, AlertTriangle, Lock, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { toast } from 'sonner';

const PhotoSubmission = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraOpen, setCameraOpen] = useState(false);
  
  const { data: activeContests, isLoading: isLoadingContests } = useQuery({
    queryKey: ['activeContests'],
    queryFn: getActiveContests,
  });
  
  const { data: submissionCount, isLoading: isLoadingSubmissions } = useQuery({
    queryKey: ['submissionCount', user?.id],
    queryFn: () => getUserSubmissionCount(user?.id || ''),
    enabled: !!user,
  });
  
  const submissionsRemaining = user ? (user.maxSubmissionsPerWeek - (submissionCount || 0)) : 0;
  const canSubmit = user && (user.isPremium || submissionsRemaining > 0);
  
  useEffect(() => {
    // Redirect to login if not authenticated
    if (!user) {
      navigate('/signin');
    }
  }, [user, navigate]);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      
      setStream(mediaStream);
      setCameraActive(true);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      toast.error('Could not access camera. Please check permissions.');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
      setCameraActive(false);
    }
  };

  const takePhoto = () => {
    if (!videoRef.current) return;
    
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0);
      
      const photoDataUrl = canvas.toDataURL('image/jpeg');
      
      // Here you would typically set this data URL to your state or pass it to the contest detail page
      // For demo purposes, we'll just show a success toast
      toast.success('Photo captured! Ready to submit to a contest');
      stopCamera();
      setCameraOpen(false);
    }
  };

  useEffect(() => {
    return () => {
      // Clean up camera when component unmounts
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  if (!user) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="container max-w-4xl py-6">
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Submit a Photo</h1>
          <p className="text-muted-foreground">
            Choose a contest to enter with your best shot
          </p>
        </div>
        
        {/* Submission status */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Your Submission Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">
                  This week's submissions
                </p>
                <div className="flex items-center gap-2">
                  <Camera size={18} />
                  <span className="font-medium">
                    {isLoadingSubmissions ? '...' : submissionCount} of {user.maxSubmissionsPerWeek} 
                    {user.isPremium ? '' : ' free'} submissions used
                  </span>
                </div>
              </div>
              {user.isPremium ? (
                <div className="rounded-md bg-snapstar-purple px-2 py-1 text-xs font-medium text-white">
                  Premium
                </div>
              ) : (
                <Button variant="outline" size="sm" asChild>
                  <Link to="/upgrade">Upgrade to Premium</Link>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
        
        {/* Camera Dialog */}
        <Dialog open={cameraOpen} onOpenChange={setCameraOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Take a Photo</DialogTitle>
              <DialogDescription>
                Use your camera to take a photo for a contest submission
              </DialogDescription>
            </DialogHeader>
            
            <div className="relative overflow-hidden rounded-lg bg-black">
              {cameraActive ? (
                <>
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-full h-full"
                  />
                  <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                    <Button 
                      onClick={takePhoto}
                      size="lg"
                      className="rounded-full p-3 bg-white"
                    >
                      <div className="w-12 h-12 rounded-full border-2 border-black"></div>
                    </Button>
                  </div>
                  <Button
                    onClick={stopCamera}
                    variant="destructive"
                    size="icon"
                    className="absolute right-2 top-2"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center p-12 space-y-4">
                  <Camera size={48} className="text-muted-foreground" />
                  <Button onClick={startCamera}>Start Camera</Button>
                </div>
              )}
            </div>
            
            <DialogFooter>
              <Button
                variant="ghost"
                onClick={() => {
                  stopCamera();
                  setCameraOpen(false);
                }}
              >
                Cancel
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {isLoadingContests ? (
          <div className="py-8 text-center text-muted-foreground">
            Loading contests...
          </div>
        ) : !canSubmit ? (
          <Card className="border-snapstar-orange bg-snapstar-orange/5">
            <CardHeader>
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-snapstar-orange" />
                <CardTitle className="text-lg">Submission Limit Reached</CardTitle>
              </div>
              <CardDescription>
                You've used all your free submissions for this week
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                As a free user, you can submit up to {user.maxSubmissionsPerWeek} photos per week.
                Your limit will reset in a few days, or you can upgrade to Premium for unlimited submissions.
              </p>
            </CardContent>
            <CardFooter>
              <Button className="w-full" asChild>
                <Link to="/upgrade">Upgrade to Premium</Link>
              </Button>
            </CardFooter>
          </Card>
        ) : activeContests && activeContests.length > 0 ? (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Choose a Contest</h2>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
              <Button 
                onClick={() => setCameraOpen(true)} 
                className="w-full sm:w-auto flex items-center gap-2"
              >
                <Camera size={18} />
                Take a Photo
              </Button>
              <span className="text-muted-foreground hidden sm:inline">or</span>
              <Button 
                variant="outline" 
                className="w-full sm:w-auto flex items-center gap-2"
                asChild
              >
                <label>
                  <Upload size={18} />
                  Upload from Device
                  <input type="file" accept="image/*" className="hidden" />
                </label>
              </Button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {activeContests.map((contest) => (
                <Card key={contest.id} className="contest-card overflow-hidden">
                  <div 
                    className="h-40 bg-cover bg-center"
                    style={{ backgroundImage: `url(${contest.coverImageUrl})` }}
                  />
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{contest.title}</CardTitle>
                    <CardDescription className="flex justify-between">
                      <span>{contest.category.name}</span>
                      <span className="text-sm text-muted-foreground">
                        {photos.filter(p => p.contestId === contest.id).length} submissions
                      </span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <p className="text-sm line-clamp-2">{contest.description}</p>
                  </CardContent>
                  <CardFooter>
                    <Button asChild className="w-full">
                      <Link to={`/contests/${contest.id}`}>
                        <Upload size={16} className="mr-2" />
                        Submit Photo
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>No Active Contests</CardTitle>
              <CardDescription>
                There are no contests currently accepting submissions
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center py-8">
              <div className="mb-4 rounded-full bg-muted p-4">
                <Image className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="text-center text-muted-foreground">
                Check back soon for new contests or explore past entries
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" asChild>
                <Link to="/contests">View All Contests</Link>
              </Button>
            </CardFooter>
          </Card>
        )}
        
        <div className="rounded-lg border p-4">
          <h3 className="mb-2 font-semibold">Submission Guidelines</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <Lock className="mt-0.5 h-4 w-4 flex-shrink-0" />
              <span>You can submit only one photo per contest</span>
            </li>
            <li className="flex items-start gap-2">
              <Lock className="mt-0.5 h-4 w-4 flex-shrink-0" />
              <span>Photos must be in JPEG or PNG format, maximum 10MB</span>
            </li>
            <li className="flex items-start gap-2">
              <Lock className="mt-0.5 h-4 w-4 flex-shrink-0" />
              <span>You must own the rights to any photo you submit</span>
            </li>
            <li className="flex items-start gap-2">
              <Lock className="mt-0.5 h-4 w-4 flex-shrink-0" />
              <span>All photos are subject to moderation before being displayed</span>
            </li>
            <li className="flex items-start gap-2">
              <Lock className="mt-0.5 h-4 w-4 flex-shrink-0" />
              <span>Photos must be taken during the active contest period</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

// Missing Link component - adding here
interface LinkProps {
  to: string;
  children: React.ReactNode;
}

const Link: React.FC<LinkProps> = ({ to, children }) => {
  const navigate = useNavigate();
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate(to);
  };
  
  return (
    <a href={to} onClick={handleClick}>
      {children}
    </a>
  );
};

export default PhotoSubmission;
