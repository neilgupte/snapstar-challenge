
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { getActiveContests, getUpcomingContests, getCompletedContests, getUserSubmissionCount } from '@/services/contestService';
import { Clock, Calendar, Camera, Award, Users } from 'lucide-react';
import { photos } from '@/services/mockData';

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
};

const getTimeRemaining = (endDate: Date) => {
  const now = new Date();
  const diff = endDate.getTime() - now.getTime();
  
  // If contest has ended
  if (diff <= 0) return 'Ended';
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  
  if (days > 0) {
    return `${days} day${days !== 1 ? 's' : ''} left`;
  }
  return `${hours} hour${hours !== 1 ? 's' : ''} left`;
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active':
      return 'bg-snapstar-green text-white';
    case 'voting':
      return 'bg-snapstar-blue text-white';
    case 'upcoming':
      return 'bg-snapstar-orange text-white';
    case 'completed':
      return 'bg-snapstar-gray text-white';
    default:
      return 'bg-muted text-muted-foreground';
  }
};

const getSubmissionCount = (contestId: string) => {
  return photos.filter(photo => photo.contestId === contestId).length;
};

const Dashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('active');
  
  const { data: activeContests, isLoading: isLoadingActive } = useQuery({
    queryKey: ['activeContests'],
    queryFn: getActiveContests,
  });
  
  const { data: upcomingContests, isLoading: isLoadingUpcoming } = useQuery({
    queryKey: ['upcomingContests'],
    queryFn: getUpcomingContests,
  });
  
  const { data: completedContests, isLoading: isLoadingCompleted } = useQuery({
    queryKey: ['completedContests'],
    queryFn: getCompletedContests,
  });
  
  const { data: submissionCount, isLoading: isLoadingSubmissions } = useQuery({
    queryKey: ['submissionCount', user?.id],
    queryFn: () => getUserSubmissionCount(user?.id || ''),
    enabled: !!user,
  });
  
  const submissionsRemaining = user ? (user.maxSubmissionsPerWeek - (submissionCount || 0)) : 0;
  
  useEffect(() => {
    // Show welcome toast only once
    if (user && sessionStorage.getItem('welcomed') !== 'true') {
      toast.success(`Welcome back, ${user.username}!`);
      sessionStorage.setItem('welcomed', 'true');
    }
  }, [user]);
  
  return (
    <div className="container max-w-4xl py-6">
      <div className="flex flex-col gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Welcome to SnapStar</h1>
          <p className="text-muted-foreground">
            Join photography contests and showcase your talent
          </p>
        </div>
        
        {/* Submission status */}
        {user && (
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
                      {isLoadingSubmissions ? '...' : submissionCount} of {user.maxSubmissionsPerWeek} free submissions used
                    </span>
                  </div>
                </div>
                {user.isPremium ? (
                  <Badge className="bg-snapstar-purple">Premium</Badge>
                ) : (
                  <Button variant="outline" size="sm" asChild>
                    <Link to="/upgrade">Upgrade to Premium</Link>
                  </Button>
                )}
              </div>
              {!user.isPremium && submissionsRemaining === 0 && (
                <div className="mt-3 text-sm text-snapstar-red">
                  You've used all your free submissions this week. Upgrade to Premium for unlimited entries!
                </div>
              )}
            </CardContent>
          </Card>
        )}
        
        {/* Contests tabs */}
        <Tabs defaultValue="active" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="past">Past</TabsTrigger>
          </TabsList>
          
          <TabsContent value="active" className="mt-4 space-y-4">
            <div className="space-y-1">
              <h2 className="text-xl font-semibold">Active Competitions</h2>
              <p className="text-sm text-muted-foreground">Enter these contests now and submit your best photos</p>
            </div>
            
            {isLoadingActive ? (
              <div className="py-8 text-center text-muted-foreground">Loading contests...</div>
            ) : activeContests && activeContests.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {activeContests.map(contest => (
                  <Card key={contest.id} className="contest-card overflow-hidden">
                    <div 
                      className="h-40 bg-cover bg-center"
                      style={{ backgroundImage: `url(${contest.coverImageUrl})` }}
                    />
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{contest.title}</CardTitle>
                        <Badge className={getStatusColor(contest.status)}>
                          {contest.status === 'active' ? 'Open' : 'Voting'}
                        </Badge>
                      </div>
                      <CardDescription className="flex justify-between">
                        <span>{contest.category.name}</span>
                        <span className="text-sm text-muted-foreground flex items-center">
                          <Users size={14} className="mr-1" />
                          {getSubmissionCount(contest.id)} entries
                        </span>
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <Clock size={16} className="text-muted-foreground" />
                          <span>{getTimeRemaining(contest.endDate)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar size={16} className="text-muted-foreground" />
                          <span>Closes {formatDate(contest.endDate)}</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button asChild className="w-full">
                        <Link to={`/contests/${contest.id}`}>
                          {contest.status === 'active' ? 'Submit Photo' : 'Vote Now'}
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-muted-foreground">
                No active contests right now. Check back soon!
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="upcoming" className="mt-4 space-y-4">
            <div className="space-y-1">
              <h2 className="text-xl font-semibold">Upcoming Competitions</h2>
              <p className="text-sm text-muted-foreground">Get ready for these upcoming contests</p>
            </div>
            
            {isLoadingUpcoming ? (
              <div className="py-8 text-center text-muted-foreground">Loading contests...</div>
            ) : upcomingContests && upcomingContests.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {upcomingContests.map(contest => (
                  <Card key={contest.id} className="contest-card overflow-hidden">
                    <div 
                      className="h-40 bg-cover bg-center"
                      style={{ backgroundImage: `url(${contest.coverImageUrl})` }}
                    />
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{contest.title}</CardTitle>
                        <Badge className={getStatusColor(contest.status)}>Upcoming</Badge>
                      </div>
                      <CardDescription>{contest.category.name}</CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <Calendar size={16} className="text-muted-foreground" />
                          <span>Starts {formatDate(contest.startDate)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar size={16} className="text-muted-foreground" />
                          <span>Ends {formatDate(contest.endDate)}</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" asChild className="w-full">
                        <Link to={`/contests/${contest.id}`}>View Details</Link>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-muted-foreground">
                No upcoming contests scheduled. Check back soon!
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="past" className="mt-4 space-y-4">
            <div className="space-y-1">
              <h2 className="text-xl font-semibold">Past Competitions</h2>
              <p className="text-sm text-muted-foreground">View results from previous contests</p>
            </div>
            
            {isLoadingCompleted ? (
              <div className="py-8 text-center text-muted-foreground">Loading contests...</div>
            ) : completedContests && completedContests.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {completedContests.map(contest => (
                  <Card key={contest.id} className="contest-card overflow-hidden">
                    <div 
                      className="h-40 bg-cover bg-center"
                      style={{ backgroundImage: `url(${contest.coverImageUrl})` }}
                    />
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{contest.title}</CardTitle>
                        <Badge className={getStatusColor(contest.status)}>Completed</Badge>
                      </div>
                      <CardDescription className="flex justify-between">
                        <span>{contest.category.name}</span>
                        <span className="text-sm text-muted-foreground flex items-center">
                          <Users size={14} className="mr-1" />
                          {getSubmissionCount(contest.id)} entries
                        </span>
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <Award size={16} className="text-muted-foreground" />
                          <span>Winners announced</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar size={16} className="text-muted-foreground" />
                          <span>Ended {formatDate(contest.endDate)}</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" asChild className="w-full">
                        <Link to={`/contests/${contest.id}`}>View Results</Link>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-muted-foreground">
                No past contests available.
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
