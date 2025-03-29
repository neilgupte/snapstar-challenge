
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { LogOut, Settings, Camera, Trophy, Heart, Award, User as UserIcon, Star } from 'lucide-react';
import { photos } from '@/services/mockData';

const Profile = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  
  // Filter mock photos for the current user
  const userPhotos = photos.filter(photo => user && photo.userId === user.id);
  
  // Simulate top-rated photos
  const topRatedPhotos = [...userPhotos].sort((a, b) => b.averageRating - a.averageRating);
  
  // Get user initials for avatar fallback
  const getUserInitials = () => {
    if (!user) return '';
    return user.username.charAt(0).toUpperCase();
  };
  
  // Handle sign out
  const handleSignOut = () => {
    signOut();
    navigate('/');
  };
  
  if (!user) {
    // Redirect to sign in if not logged in
    navigate('/signin');
    return null;
  }

  return (
    <div className="container max-w-4xl py-6">
      <div className="space-y-6">
        {/* Profile header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={user.avatarUrl} alt={user.username} />
              <AvatarFallback className="bg-snapstar-purple text-white">
                {getUserInitials()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold">{user.username}</h1>
              <p className="text-muted-foreground">{user.email}</p>
              <div className="mt-1 flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  Joined {new Date(user.createdAt).toLocaleDateString()}
                </Badge>
                {user.isPremium && (
                  <Badge className="bg-snapstar-purple text-white">Premium</Badge>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" className="gap-1">
              <Settings size={16} />
              <span>Settings</span>
            </Button>
            <Button variant="outline" size="sm" className="gap-1 text-snapstar-red" onClick={handleSignOut}>
              <LogOut size={16} />
              <span>Sign Out</span>
            </Button>
          </div>
        </div>
        
        {/* Stats cards */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Card>
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Submissions
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="flex items-center gap-2">
                <Camera className="h-5 w-5 text-snapstar-blue" />
                <span className="text-2xl font-bold">{userPhotos.length}</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Contest Wins
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-snapstar-orange" />
                <span className="text-2xl font-bold">0</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Avg Rating
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-snapstar-purple" />
                <span className="text-2xl font-bold">
                  {userPhotos.length > 0
                    ? (userPhotos.reduce((sum, photo) => sum + photo.averageRating, 0) / userPhotos.length).toFixed(1)
                    : '-'}
                </span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Plan
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="flex items-center gap-2">
                {user.isPremium ? (
                  <>
                    <Award className="h-5 w-5 text-snapstar-green" />
                    <span className="text-xl font-bold">Premium</span>
                  </>
                ) : (
                  <>
                    <UserIcon className="h-5 w-5 text-muted-foreground" />
                    <span className="text-xl font-bold">Free</span>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Submissions tabs */}
        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">All Photos</TabsTrigger>
            <TabsTrigger value="top">Top Rated</TabsTrigger>
            <TabsTrigger value="saved">Saved</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Your Submissions</h2>
              <Button size="sm" asChild>
                <a href="/submit">Submit New Photo</a>
              </Button>
            </div>
            
            {userPhotos.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2">
                {userPhotos.map((photo) => (
                  <Card key={photo.id} className="overflow-hidden">
                    <img
                      src={photo.imageUrl}
                      alt={photo.caption || 'Photo submission'}
                      className="aspect-[4/3] w-full object-cover"
                    />
                    <CardHeader className="pb-2">
                      <div className="flex justify-between">
                        <CardTitle className="text-lg">
                          {photo.caption || 'Untitled'}
                        </CardTitle>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-snapstar-orange" />
                          <span className="font-medium">
                            {photo.averageRating.toFixed(1)}
                          </span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardFooter>
                      <div className="flex w-full items-center justify-between">
                        <div className="text-sm text-muted-foreground">
                          {photo.voteCount} votes
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="gap-1"
                          asChild
                        >
                          <a href={`/contests/${photo.contestId}`}>
                            View Contest
                          </a>
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="py-12 text-center">
                <CardContent>
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                    <Camera className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold">No submissions yet</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    You haven't submitted any photos to contests yet.
                  </p>
                  <Button className="mt-6" asChild>
                    <a href="/submit">Submit Your First Photo</a>
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="top" className="space-y-4">
            <h2 className="text-xl font-semibold">Your Top Rated Photos</h2>
            
            {topRatedPhotos.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2">
                {topRatedPhotos.slice(0, 4).map((photo) => (
                  <Card key={photo.id} className="overflow-hidden">
                    <img
                      src={photo.imageUrl}
                      alt={photo.caption || 'Photo submission'}
                      className="aspect-[4/3] w-full object-cover"
                    />
                    <CardHeader className="pb-2">
                      <div className="flex justify-between">
                        <CardTitle className="text-lg">
                          {photo.caption || 'Untitled'}
                        </CardTitle>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-snapstar-orange" />
                          <span className="font-medium">
                            {photo.averageRating.toFixed(1)}
                          </span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardFooter>
                      <div className="flex w-full items-center justify-between">
                        <div className="text-sm text-muted-foreground">
                          {photo.voteCount} votes
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="gap-1"
                          asChild
                        >
                          <a href={`/contests/${photo.contestId}`}>
                            View Contest
                          </a>
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="py-8 text-center">
                <CardContent>
                  <p className="text-muted-foreground">
                    You don't have any rated photos yet.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="saved" className="space-y-4">
            <h2 className="text-xl font-semibold">Saved Photos</h2>
            
            <Card className="py-8 text-center">
              <CardContent>
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                  <Heart className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">No saved photos</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  You haven't saved any photos yet. Like photos while browsing to save them here.
                </p>
                <Button variant="outline" className="mt-6" asChild>
                  <a href="/explore">Explore Photos</a>
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        {/* Subscription card */}
        {!user.isPremium && (
          <Card className="border-snapstar-purple">
            <CardHeader>
              <CardTitle>Upgrade to Premium</CardTitle>
              <CardDescription>
                Get unlimited photo submissions and an ad-free experience
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <span className="text-snapstar-purple">✓</span>
                  <span>Submit unlimited photos (no weekly cap)</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-snapstar-purple">✓</span>
                  <span>Ad-free browsing experience</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-snapstar-purple">✓</span>
                  <span>Premium badge on your profile</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full bg-snapstar-purple hover:bg-snapstar-purple/90" asChild>
                <a href="/upgrade">Upgrade Now</a>
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Profile;
