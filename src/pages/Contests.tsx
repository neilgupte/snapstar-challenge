
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  getActiveContests, 
  getUpcomingContests, 
  getCompletedContests 
} from '@/services/contestService';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Link } from 'react-router-dom';
import { CalendarClock, Clock, Trophy, Users } from 'lucide-react';
import { photos } from '@/services/mockData';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

const ContestsPage = () => {
  const { user } = useAuth();
  const [filter, setFilter] = useState<'all' | 'entered'>('all');
  
  const { 
    data: activeContests, 
    isLoading: isLoadingActive 
  } = useQuery({
    queryKey: ['contests', 'active'],
    queryFn: getActiveContests
  });

  const { 
    data: upcomingContests, 
    isLoading: isLoadingUpcoming 
  } = useQuery({
    queryKey: ['contests', 'upcoming'],
    queryFn: getUpcomingContests
  });

  const { 
    data: completedContests, 
    isLoading: isLoadingCompleted 
  } = useQuery({
    queryKey: ['contests', 'completed'],
    queryFn: getCompletedContests
  });

  const getSubmissionCount = (contestId: string) => {
    return photos.filter(photo => photo.contestId === contestId).length;
  };

  const hasSubmittedToContest = (contestId: string) => {
    if (!user) return false;
    return photos.some(photo => 
      photo.contestId === contestId && 
      photo.userId === user.id
    );
  };

  const filterContests = (contests) => {
    if (!contests || filter === 'all' || !user) return contests;
    return contests.filter(contest => hasSubmittedToContest(contest.id));
  };

  const renderContestCards = (contests, isLoading) => {
    if (isLoading) {
      return Array(3).fill(0).map((_, i) => (
        <Card key={i} className="mb-4">
          <CardContent className="p-0">
            <div className="relative">
              <Skeleton className="w-full h-48" />
              <div className="p-4 space-y-2">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-1/4" />
              </div>
            </div>
          </CardContent>
        </Card>
      ));
    }

    if (!contests || contests.length === 0) {
      return (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No contests available</p>
        </div>
      );
    }

    const filteredContests = filterContests(contests);

    return filteredContests.map((contest) => {
      let statusBadge;
      
      if (contest.status === 'active') {
        statusBadge = <Badge className="bg-snapstar-green text-white">Open</Badge>;
      } else if (contest.status === 'voting') {
        statusBadge = <Badge className="bg-snapstar-blue text-white">Voting</Badge>;
      } else if (contest.status === 'upcoming') {
        statusBadge = <Badge className="bg-snapstar-orange text-white">Upcoming</Badge>;
      } else {
        statusBadge = <Badge className="bg-snapstar-gray text-white">Completed</Badge>;
      }
      
      return (
        <Card key={contest.id} className="mb-4 overflow-hidden group">
          <CardContent className="p-0">
            <Link to={`/contests/${contest.id}`} className="block">
              <div className="relative">
                <img 
                  src={contest.coverImageUrl} 
                  alt={contest.title}
                  className="w-full h-48 object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute top-2 right-2">
                  {statusBadge}
                </div>
                <div className="p-4 space-y-3">
                  <h3 className="font-bold text-lg line-clamp-1">{contest.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">{contest.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-muted-foreground">
                      {contest.status === 'upcoming' ? (
                        <>
                          <CalendarClock size={16} className="mr-1" />
                          <span>Starts: {contest.startDate.toLocaleDateString()}</span>
                        </>
                      ) : contest.status === 'active' || contest.status === 'voting' ? (
                        <>
                          <Clock size={16} className="mr-1" />
                          <span>Ends: {contest.endDate.toLocaleDateString()}</span>
                        </>
                      ) : (
                        <>
                          <Trophy size={16} className="mr-1" />
                          <span>Completed: {contest.endDate.toLocaleDateString()}</span>
                        </>
                      )}
                    </div>
                    
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Users size={16} className="mr-1" />
                      <span>{getSubmissionCount(contest.id)} entries</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </CardContent>
        </Card>
      );
    });
  };

  return (
    <div className="container max-w-4xl mx-auto py-6 px-4">
      <h1 className="text-3xl font-bold mb-6">Photography Contests</h1>
      
      <div className="flex justify-end mb-4">
        {user && (
          <div className="flex gap-2">
            <Button 
              variant={filter === 'all' ? 'default' : 'outline'} 
              size="sm" 
              onClick={() => setFilter('all')}
            >
              All Contests
            </Button>
            <Button 
              variant={filter === 'entered' ? 'default' : 'outline'} 
              size="sm" 
              onClick={() => setFilter('entered')}
            >
              Contests I've Entered
            </Button>
          </div>
        )}
      </div>
      
      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid w-full grid-cols-5 mb-8">
          <TabsTrigger value="active">Open Challenges</TabsTrigger>
          <TabsTrigger value="voting">Vote</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="winners">Winners</TabsTrigger>
          <TabsTrigger value="past">Past</TabsTrigger>
        </TabsList>
        
        <TabsContent value="active" className="space-y-4">
          <div className="grid gap-4">
            {renderContestCards(activeContests?.filter(c => c.status === 'active'), isLoadingActive)}
          </div>
        </TabsContent>

        <TabsContent value="voting" className="space-y-4">
          <div className="grid gap-4">
            {renderContestCards(activeContests?.filter(c => c.status === 'voting'), isLoadingActive)}
          </div>
        </TabsContent>
        
        <TabsContent value="upcoming" className="space-y-4">
          <div className="grid gap-4">
            {renderContestCards(upcomingContests, isLoadingUpcoming)}
          </div>
        </TabsContent>
        
        <TabsContent value="winners" className="space-y-4">
          <div className="grid gap-4">
            {renderContestCards(completedContests?.filter(c => c.endDate > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)), isLoadingCompleted)}
          </div>
        </TabsContent>
        
        <TabsContent value="past" className="space-y-4">
          <div className="grid gap-4">
            {renderContestCards(completedContests, isLoadingCompleted)}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ContestsPage;
