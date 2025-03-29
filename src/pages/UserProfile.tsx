
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useQuery } from '@tanstack/react-query';
import { photos } from '@/services/mockData';
import { Trophy, Award, Medal } from 'lucide-react';
import { mockRankings } from '@/pages/Rankings';

// Mock function to simulate fetching user data
const fetchUserProfile = async (userId) => {
  // In a real app, this would be an API call
  return new Promise((resolve) => {
    setTimeout(() => {
      const userRanking = mockRankings.find(u => u.id === userId) || {
        id: userId,
        username: `User${userId.substring(0, 4)}`,
        avatarUrl: '/placeholder.svg',
        points: Math.floor(Math.random() * 500),
        wins: Math.floor(Math.random() * 5),
        highlightedAchievement: 'Rising Star'
      };
      
      resolve({
        ...userRanking,
        bio: 'Photography enthusiast sharing my passion with the world.',
        contestsEntered: Math.floor(Math.random() * 20),
      });
    }, 500);
  });
};

const UserProfile = () => {
  const { userId } = useParams();
  
  const { data: user, isLoading } = useQuery({
    queryKey: ['userProfile', userId],
    queryFn: () => fetchUserProfile(userId),
  });
  
  const { data: userPhotos, isLoading: isLoadingPhotos } = useQuery({
    queryKey: ['userPhotos', userId],
    queryFn: () => {
      // In a real app, this would be an API call
      return Promise.resolve(photos.filter(p => p.userId === userId));
    }
  });
  
  const userRank = React.useMemo(() => {
    if (!user) return null;
    if (user.contestsEntered < 10) return null;
    
    const allRankings = [...mockRankings].sort((a, b) => b.points - a.points);
    const rank = allRankings.findIndex(r => r.id === userId) + 1;
    return rank;
  }, [user, userId]);
  
  if (isLoading) {
    return (
      <div className="container max-w-4xl mx-auto py-6 px-4">
        <div className="flex items-start gap-6">
          <Skeleton className="h-24 w-24 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64" />
            <div className="flex gap-2 mt-4">
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-8 w-20" />
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (!user) {
    return (
      <div className="container max-w-4xl mx-auto py-6 px-4">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-2">User Not Found</h1>
          <p className="text-muted-foreground">
            The user you're looking for doesn't exist or is no longer available.
          </p>
          <Link to="/" className="text-snapstar-purple hover:underline mt-4 inline-block">
            Return to home
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container max-w-4xl mx-auto py-6 px-4">
      <div className="flex flex-col md:flex-row items-start gap-6 mb-8">
        <Avatar className="size-24 border-2 border-snapstar-purple">
          <AvatarImage src={user.avatarUrl || '/placeholder.svg'} alt={user.username} />
          <AvatarFallback>{user.username.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold">{user.username}</h1>
            {userRank && (
              <Badge variant="outline" className="text-snapstar-purple border-snapstar-purple">
                Rank #{userRank}
              </Badge>
            )}
          </div>
          
          <p className="text-muted-foreground mt-1 mb-3">{user.bio || 'No bio available'}</p>
          
          <div className="flex flex-wrap gap-6 mt-4">
            <div className="flex items-center">
              <Trophy size={18} className="mr-2 text-yellow-500" />
              <span className="font-medium">{user.wins} {user.wins === 1 ? 'win' : 'wins'}</span>
            </div>
            <div>
              <span className="font-medium">{user.contestsEntered} contests entered</span>
            </div>
            <div className="flex items-center">
              <Award size={18} className="mr-2 text-snapstar-purple" />
              <span className="font-medium">{user.points} points</span>
            </div>
            {user.highlightedAchievement && (
              <Badge variant="outline" className="ml-auto">
                {user.highlightedAchievement}
              </Badge>
            )}
          </div>
        </div>
      </div>
      
      <h2 className="text-xl font-semibold mb-4">Photo Submissions</h2>
      
      {isLoadingPhotos ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-60 w-full" />
          ))}
        </div>
      ) : userPhotos && userPhotos.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {userPhotos.map((photo) => (
            <Card key={photo.id} className="overflow-hidden">
              <Link to={`/contests/${photo.contestId}`}>
                <div className="h-60 relative">
                  <img 
                    src={photo.imageUrl} 
                    alt={photo.caption || 'Photo submission'} 
                    className="object-cover w-full h-full"
                  />
                  {photo.averageRating > 0 && (
                    <div className="absolute top-2 right-2 bg-black/70 text-white rounded px-2 py-1 text-sm flex items-center">
                      <Trophy size={14} className="mr-1 text-yellow-400" />
                      {photo.averageRating.toFixed(1)}
                    </div>
                  )}
                </div>
                <CardContent className="p-3">
                  <p className="text-sm font-medium line-clamp-1">
                    {photo.caption || 'Untitled'}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    View competition
                  </p>
                </CardContent>
              </Link>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 border rounded-md bg-background">
          <p className="text-muted-foreground">No photo submissions yet</p>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
