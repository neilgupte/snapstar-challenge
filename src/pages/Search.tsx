
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Search as SearchIcon, Clock, Calendar, Trophy, Users } from 'lucide-react';
import { getActiveContests, getUpcomingContests, getCompletedContests } from '@/services/contestService';
import { photos } from '@/services/mockData';
import { formatDate, getStatusColor } from '@/utils/formatUtils';

interface SearchResult {
  id: string;
  title: string;
  description: string;
  category: { id: string; name: string };
  coverImageUrl: string;
  status: 'draft' | 'upcoming' | 'active' | 'voting' | 'completed';
  startDate: Date;
  endDate: Date;
  score: number; // Relevance score for sorting
}

const SearchPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Get the query parameter
  const queryParams = new URLSearchParams(location.search);
  const queryFromUrl = queryParams.get('q') || '';

  const { data: activeContests, isLoading: isLoadingActive } = useQuery({
    queryKey: ['contests', 'active'],
    queryFn: getActiveContests
  });

  const { data: upcomingContests, isLoading: isLoadingUpcoming } = useQuery({
    queryKey: ['contests', 'upcoming'],
    queryFn: getUpcomingContests
  });

  const { data: completedContests, isLoading: isLoadingCompleted } = useQuery({
    queryKey: ['contests', 'completed'],
    queryFn: getCompletedContests
  });

  const isLoading = isLoadingActive || isLoadingUpcoming || isLoadingCompleted;

  useEffect(() => {
    if (queryFromUrl) {
      setSearchQuery(queryFromUrl);
      performSearch(queryFromUrl);
    }
  }, [queryFromUrl, activeContests, upcomingContests, completedContests]);

  const performSearch = (query: string) => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setIsSearching(true);

    // Combine all contests
    const allContests = [
      ...(activeContests || []),
      ...(upcomingContests || []),
      ...(completedContests || [])
    ];

    if (allContests.length === 0) {
      setIsSearching(false);
      return;
    }

    const searchTerms = query.toLowerCase().split(' ');

    // Search through contests with some AI-like fuzzy matching
    const matchedResults = allContests.map(contest => {
      // Calculate match score based on different fields
      let score = 0;
      const title = contest.title.toLowerCase();
      const description = contest.description.toLowerCase();
      const category = contest.category.name.toLowerCase();

      // Exact matches in title (highest priority)
      if (title.includes(query.toLowerCase())) {
        score += 10;
      }

      // Exact matches in category
      if (category.includes(query.toLowerCase())) {
        score += 8;
      }

      // Exact matches in description
      if (description.includes(query.toLowerCase())) {
        score += 5;
      }

      // Partial matches for individual words
      searchTerms.forEach(term => {
        // Similar word matching (simulating AI understanding)
        const similarWords: Record<string, string[]> = {
          'forest': ['jungle', 'woods', 'trees', 'nature'],
          'urban': ['city', 'street', 'building', 'architecture'],
          'sea': ['ocean', 'water', 'beach', 'coast'],
          'portrait': ['people', 'face', 'person', 'human'],
          'landscape': ['scenery', 'vista', 'panorama', 'nature'],
          'animal': ['wildlife', 'pet', 'creature', 'fauna'],
          'night': ['evening', 'dark', 'stars', 'moon'],
          'macro': ['close-up', 'detail', 'micro', 'tiny'],
        };

        // Check if search term has similar words that match our content
        Object.entries(similarWords).forEach(([keyword, alternatives]) => {
          if (term === keyword) {
            // The search term is a keyword we know
            if (alternatives.some(alt => title.includes(alt) || description.includes(alt) || category.includes(alt))) {
              score += 7; // Good score for semantic matches
            }
          } else if (alternatives.includes(term)) {
            // The search term is an alternative, check if the main keyword is in our content
            if (title.includes(keyword) || description.includes(keyword) || category.includes(keyword)) {
              score += 7; // Good score for semantic matches
            }
          }
        });

        // Word-by-word matching
        if (title.includes(term)) score += 2;
        if (category.includes(term)) score += 1.5;
        if (description.includes(term)) score += 1;
      });

      return {
        ...contest,
        score
      };
    })
    .filter(result => result.score > 0) // Only include results with some relevance
    .sort((a, b) => b.score - a.score); // Sort by relevance

    setResults(matchedResults);
    setIsSearching(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Update URL with search query
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      performSearch(searchQuery.trim());
    }
  };

  const getSubmissionCount = (contestId: string) => {
    return photos.filter(photo => photo.contestId === contestId).length;
  };

  return (
    <div className="container max-w-4xl py-6">
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Search Contests</h1>
          <p className="text-muted-foreground">
            Find photography contests by keyword or category
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex w-full gap-2">
          <Input
            type="text"
            placeholder="Search for contests..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" disabled={!searchQuery.trim()}>
            <SearchIcon className="mr-2 h-4 w-4" />
            Search
          </Button>
        </form>

        {isLoading ? (
          <div className="py-8 grid gap-4">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardHeader className="pb-2">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-24 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : queryFromUrl && results.length === 0 ? (
          <div className="py-8 text-center">
            <h2 className="text-xl font-semibold mb-2">No contests found</h2>
            <p className="text-muted-foreground">
              We couldn't find any contests matching "{queryFromUrl}"
            </p>
            <Button 
              variant="outline" 
              onClick={() => navigate('/contests')} 
              className="mt-4"
            >
              Browse All Contests
            </Button>
          </div>
        ) : results.length > 0 ? (
          <div className="py-4 space-y-6">
            <h2 className="text-xl font-semibold">
              {results.length} result{results.length !== 1 ? 's' : ''} for "{queryFromUrl}"
            </h2>
            <div className="grid gap-4">
              {results.map((contest) => (
                <Card key={contest.id} className="overflow-hidden">
                  <div className="md:flex">
                    <div 
                      className="h-40 md:h-auto md:w-48 bg-cover bg-center"
                      style={{ backgroundImage: `url(${contest.coverImageUrl})` }}
                    />
                    <div className="flex flex-col flex-1">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle>{contest.title}</CardTitle>
                            <CardDescription>{contest.category.name}</CardDescription>
                          </div>
                          <Badge className={getStatusColor(contest.status)}>
                            {contest.status.charAt(0).toUpperCase() + contest.status.slice(1)}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="pb-2 flex-1">
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {contest.description}
                        </p>
                        <div className="flex flex-wrap gap-4 mt-3">
                          <div className="flex items-center gap-1 text-sm">
                            {contest.status === 'upcoming' ? (
                              <>
                                <Calendar size={16} className="text-muted-foreground" />
                                <span>Starts: {formatDate(contest.startDate)}</span>
                              </>
                            ) : contest.status === 'active' || contest.status === 'voting' ? (
                              <>
                                <Clock size={16} className="text-muted-foreground" />
                                <span>Ends: {formatDate(contest.endDate)}</span>
                              </>
                            ) : (
                              <>
                                <Trophy size={16} className="text-muted-foreground" />
                                <span>Completed: {formatDate(contest.endDate)}</span>
                              </>
                            )}
                          </div>
                          <div className="flex items-center gap-1 text-sm">
                            <Users size={16} className="text-muted-foreground" />
                            <span>{getSubmissionCount(contest.id)} entries</span>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button asChild className="w-full">
                          <Link to={`/contests/${contest.id}`}>
                            {contest.status === 'active' 
                              ? 'Submit Photo' 
                              : contest.status === 'voting' 
                                ? 'Vote Now' 
                                : 'View Details'}
                          </Link>
                        </Button>
                      </CardFooter>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ) : !queryFromUrl ? (
          <div className="py-12 text-center">
            <SearchIcon className="mx-auto h-12 w-12 text-muted-foreground" />
            <h2 className="mt-4 text-xl font-semibold">Search for contests</h2>
            <p className="mt-2 text-muted-foreground">
              Enter keywords, categories, or topics to find photography contests
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default SearchPage;
