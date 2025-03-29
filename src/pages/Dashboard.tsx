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
import { Clock, Calendar, Camera, Award, Users, CheckCircle2, Eye, Trophy } from 'lucide-react';
import { photos } from '@/services/mockData';
import CountdownTimer from '@/components/CountdownTimer';
import { formatDate, getTimeRemaining, getStatusColor } from '@/utils/formatUtils';

const Dashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('open');
  const [challengeFilter, setChallengFilter] = useState<'all' | 'entered' | 'not-entered'>('all');
  
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
    if (user && sessionStorage.getItem('welcomed') !== 'true') {
      toast.success(`Welcome back, ${user.username}!`);
      sessionStorage.setItem('welcomed', 'true');
    }
  }, [user]);
  
  const hasSubmittedToContest = (contestId: string) => {
    if (!user) return false;
    return photos.some(photo => 
      photo.contestId === contestId && 
      photo.userId === user.id
    );
  };
  
  const hasVotedInContest = (contestId: string) => {
    if (!user) return false;
    // This is a placeholder - in a real app, this would check if the user has voted in the contest
    return false;
  };
  
  const filterContests = (contests: any[] | undefined, filter: 'all' | 'entered' | 'not-entered') => {
    if (!contests || filter === 'all') return contests;
    
    if (filter === 'entered') {
      return contests.filter(contest => hasSubmittedToContest(contest.id));
    } else {
      return contests.filter(contest => !hasSubmittedToContest(contest.id));
    }
  };
  
  // Filter recent completed contests (past 7 days)
  const getRecentWinners = () => {
    if (!completedContests) return [];
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    // Return at most 6 winners
    return completedContests.filter(contest => 
      contest.endDate > sevenDaysAgo
    ).slice(0, 6);
  };
  
  const recentWinners = getRecentWinners();
  
  // Filter contests that are in voting phase
  const votingContests = activeContests?.filter(contest => contest.status === 'voting') || [];
  
  // Filter contests that are open for submissions
  const openContests = activeContests?.filter(contest => contest.status === 'active') || [];
  const filteredOpenContests = filterContests(openContests, challengeFilter);
  
  const getSubmissionCount = (contestId: string) => {
    return photos.filter(photo => photo.contestId === contestId).length;
  };

  // Function to get a winner's name
  const getWinnerName = (contestId: string) => {
    // In a real app, this would fetch the actual winner
    return "Jane Doe";
  };
  
  return (
    <div className="container max-w-4xl py-6">
      <div className="flex flex-col gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Welcome to SnapStar</h1>
        </div>
        
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
                    <Link to="/upgrade">Upgrade</Link>
                  </Button>
                )}
              </div>
              {!user.isPremium && submissionsRemaining === 0 && (
                <div className="mt-3 text-sm text-snapstar-red">
                  You've used all your free submissions this week. Upgrade for unlimited entries!
                </div>
              )}
            </CardContent>
          </Card>
        )}
        
        <Tabs defaultValue="open" onValueChange={setActiveTab}>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2 gap-2">
            <TabsList className="grid w-full sm:w-auto grid-cols-3">
              <TabsTrigger value="winners">Winners</TabsTrigger>
              <TabsTrigger value="open">Open Challenges</TabsTrigger>
              <TabsTrigger value="vote">Vote</TabsTrigger>
            </TabsList>
            
            {user && activeTab === 'open' && (
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Button 
                  variant={challengeFilter === 'entered' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setChallengFilter('entered')}
                  className="text-xs"
                >
                  Entered
                </Button>
                <Button 
                  variant={challengeFilter === 'not-entered' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setChallengFilter('not-entered')}
                  className="text-xs"
                >
                  Not Entered
                </Button>
              </div>
            )}
          </div>
          
          <TabsContent value="winners" className="mt-4 space-y-4">
            <div className="space-y-1">
              <h2 className="text-xl font-semibold">Recent Winners</h2>
              <p className="text-sm text-muted-foreground">Check out the results from these recently completed contests</p>
            </div>
            
            {isLoadingCompleted ? (
              <div className="py-8 text-center text-muted-foreground">Loading contests...</div>
            ) : recentWinners.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {recentWinners.map(contest => {
                  const userHasSubmitted = hasSubmittedToContest(contest.id);
                  const winnerName = getWinnerName(contest.id);
                  
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
                            <Trophy size={14} className="mr-1" />
                            {winnerName}
                          </span>
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <Calendar size={16} className="text-muted-foreground" />
                            <span>Ended {formatDate(contest.endDate)}</span>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button variant="outline" asChild className="w-full">
                          <Link to={`/contests/${contest.id}`}>
                            See Results
                          </Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <div className="py-8 text-center text-muted-foreground">
                No recent winners to display. Check back soon!
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="open" className="mt-4 space-y-4">
            <div className="space-y-1">
              <h2 className="text-xl font-semibold">Open Challenges</h2>
              <p className="text-sm text-muted-foreground">Enter these contests now and submit your best photos</p>
            </div>
            
            {isLoadingActive ? (
              <div className="py-8 text-center text-muted-foreground">Loading contests...</div>
            ) : filteredOpenContests && filteredOpenContests.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {filteredOpenContests.map(contest => {
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
                          <Badge className="bg-snapstar-green text-white">Open</Badge>
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
                      <CardFooter>
                        <Button 
                          asChild 
                          className={`w-full ${userHasSubmitted 
                            ? 'bg-white text-black border border-gray-300 hover:bg-gray-100' 
                            : 'bg-white text-black border border-black hover:bg-gray-100'}`}
                        >
                          <Link to={`/contests/${contest.id}`} className="py-2 flex items-center justify-center w-full">
                            {userHasSubmitted ? (
                              <>
                                <Eye size={16} className="mr-2" />
                                View Your Entry
                              </>
                            ) : (
                              <>
                                <Camera size={16} className="mr-2" />
                                Enter Competition
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
                {challengeFilter !== 'all' 
                  ? `No ${challengeFilter === 'entered' ? 'entered' : 'unentered'} challenges found.` 
                  : 'No open challenges right now. Check back soon!'}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="vote" className="mt-4 space-y-4">
            <div className="space-y-1">
              <h2 className="text-xl font-semibold">Vote on Entries</h2>
              <p className="text-sm text-muted-foreground">Help decide the winners by voting on these contest entries</p>
            </div>
            
            {isLoadingActive ? (
              <div className="py-8 text-center text-muted-foreground">Loading contests...</div>
            ) : votingContests && votingContests.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {votingContests.map(contest => {
                  const userHasSubmitted = hasSubmittedToContest(contest.id);
                  const userHasVoted = hasVotedInContest(contest.id);
                  const timeLeft = getTimeRemaining(contest.endDate);
                  
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
                        {userHasVoted && (
                          <div className="absolute top-2 left-2 bg-snapstar-blue text-white rounded-full p-1">
                            <CheckCircle2 size={16} />
                          </div>
                        )}
                      </div>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg">{contest.title}</CardTitle>
                          <Badge className="bg-snapstar-blue text-white">Voting</Badge>
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
                          <div className="flex items-center gap-2">
                            <Calendar size={16} className="text-muted-foreground" />
                            <span>Voting ends {formatDate(contest.endDate)}</span>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button 
                          asChild 
                          className="w-full bg-snapstar-purple hover:bg-snapstar-purple/90 text-white"
                        >
                          <Link to={`/contests/${contest.id}`} className="py-2 flex items-center justify-center w-full">
                            {userHasVoted ? (
                              <>
                                <CheckCircle2 size={16} className="mr-2" />
                                Voted
                              </>
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
                No contests are currently in the voting phase. Check back soon!
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
