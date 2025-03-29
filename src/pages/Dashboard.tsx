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
import { Clock, Calendar, Camera, Award, Users, Filter, CheckCircle2, Eye } from 'lucide-react';
import { photos } from '@/services/mockData';
import CountdownTimer from '@/components/CountdownTimer';
import { formatDate, getTimeRemaining, getStatusColor } from '@/utils/formatUtils';

const Dashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('active');
  const [filterMyEntries, setFilterMyEntries] = useState<'all' | 'entered' | 'not-entered'>('all');
  
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
  
  // Helper to check if user has submitted to a specific contest
  const hasSubmittedToContest = (contestId: string) => {
    if (!user) return false;
    return photos.some(photo => 
      photo.contestId === contestId && 
      photo.userId === user.id
    );
  };
  
  const filterContests = (contests: any[] | undefined) => {
    if (!contests || filterMyEntries === 'all') return contests;
    
    if (filterMyEntries === 'entered') {
      return contests.filter(contest => hasSubmittedToContest(contest.id));
    } else {
      return contests.filter(contest => !hasSubmittedToContest(contest.id));
    }
  };
  
  const filteredActiveContests = filterContests(activeContests);
  const filteredCompletedContests = filterContests(completedContests);
  
  const getSubmissionCount = (contestId: string) => {
    return photos.filter(photo => photo.contestId === contestId).length;
  };
  
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
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2 gap-2">
            <TabsList className="grid w-full sm:w-auto grid-cols-3">
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="past">Past</TabsTrigger>
            </TabsList>
            
            {user && (activeTab === 'active' || activeTab === 'past') && (
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <div className="text-sm text-muted-foreground flex items-center gap-1">
                  <Filter size={14} />
                  <span>Filter:</span>
                </div>
                <Button 
                  variant={filterMyEntries === 'all' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setFilterMyEntries('all')}
                  className="text-xs"
                >
                  All
                </Button>
                <Button 
                  variant={filterMyEntries === 'entered' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setFilterMyEntries('entered')}
                  className="text-xs"
                >
                  Entered
                </Button>
                <Button 
                  variant={filterMyEntries === 'not-entered' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setFilterMyEntries('not-entered')}
                  className="text-xs"
                >
                  Not Entered
                </Button>
              </div>
            )}
          </div>
          
          <TabsContent value="active" className="mt-4 space-y-4">
            <div className="space-y-1">
              <h2 className="text-xl font-semibold">Active Competitions</h2>
              <p className="text-sm text-muted-foreground">Enter these contests now and submit your best photos</p>
            </div>
            
            {isLoadingActive ? (
              <div className="py-8 text-center text-muted-foreground">Loading contests...</div>
            ) : filteredActiveContests && filteredActiveContests.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {filteredActiveContests.map(contest => {
                  const userHasSubmitted = hasSubmittedToContest(contest.id);
                  const timeLeft = getTimeRemaining(contest.endDate);
                  const hasLessThanOneHourLeft = 
                    contest.endDate.getTime() - new Date().getTime() < 60 * 60 * 1000 && 
                    contest.endDate.getTime() - new Date().getTime() > 0;
                  
                  return (
                    <Card key={contest.id} className="contest-card overflow-hidden">
                      <div 
                        className="h-40 bg-cover bg-center relative"
                        style={{ backgroundImage: `url(${contest.coverImageUrl})` }}
                      >
                        {userHasSubmitted && (
                          <div className="absolute top-2 right-2 bg-snapstar-green text-white rounded-full p-1">
                            <CheckCircle2 size={16} />
                          </div>
                        )}
                      </div>
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
                            <span>{timeLeft}</span>
                          </div>
                          {hasLessThanOneHourLeft && (
                            <CountdownTimer endDate={contest.endDate} />
                          )}
                          <div className="flex items-center gap-2">
                            <Calendar size={16} className="text-muted-foreground" />
                            <span>Closes {formatDate(contest.endDate)}</span>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="relative">
                        {contest.status === 'active' && (
                          <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-snapstar-green text-white text-xs px-2 py-0.5 rounded">
                            Open for entries
                          </div>
                        )}
                        <Button 
                          asChild 
                          className={`w-full ${userHasSubmitted 
                            ? 'bg-white text-black border border-gray-300 hover:bg-gray-100' 
                            : 'bg-white text-black border border-black hover:bg-gray-100'}`}
                        >
                          <Link to={`/contests/${contest.id}`}>
                            {contest.status === 'active' ? (
                              userHasSubmitted ? (
                                <>
                                  <Eye size={16} className="mr-2" />
                                  View Current Entries
                                </>
                              ) : (
                                <>
                                  <Camera size={16} className="mr-2" />
                                  Submit Photo
                                </>
                              )
                            ) : (
                              <>
                                <Award size={16} className="mr-2" />
                                Vote Now
                              </>
                            )}
                          </Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <div className="py-8 text-center text-muted-foreground">
                {filterMyEntries !== 'all' 
                  ? `No ${filterMyEntries === 'entered' ? 'entered' : 'unentered'} contests found.` 
                  : 'No active contests right now. Check back soon!'}
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
            ) : filteredCompletedContests && filteredCompletedContests.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {filteredCompletedContests.map(contest => {
                  const userHasSubmitted = hasSubmittedToContest(contest.id);
                  
                  return (
                    <Card key={contest.id} className="contest-card overflow-hidden">
                      <div 
                        className="h-40 bg-cover bg-center relative"
                        style={{ backgroundImage: `url(${contest.coverImageUrl})` }}
                      >
                        {userHasSubmitted && (
                          <div className="absolute top-2 right-2 bg-snapstar-green text-white rounded-full p-1">
                            <CheckCircle2 size={16} />
                          </div>
                        )}
                      </div>
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
                  );
                })}
              </div>
            ) : (
              <div className="py-8 text-center text-muted-foreground">
                {filterMyEntries !== 'all' 
                  ? `No ${filterMyEntries === 'entered' ? 'entered' : 'unentered'} past contests found.` 
                  : 'No past contests available.'}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
