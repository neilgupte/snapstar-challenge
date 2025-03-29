
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search as SearchIcon, Calendar, Image, User, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Contest, Photo } from '@/types';
import { contests, photos } from '@/services/mockData';

type SearchResult = {
  contests: Contest[];
  photos: Photo[];
  users: { id: string; username: string; avatarUrl?: string }[];
};

const SearchPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<SearchResult | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  // Mock search function
  const performSearch = (query: string) => {
    setIsSearching(true);
    
    // Simulate API delay
    setTimeout(() => {
      if (!query.trim()) {
        setResults(null);
        setIsSearching(false);
        return;
      }
      
      const lowercaseQuery = query.toLowerCase();
      
      // Search contests
      const matchedContests = contests.filter(contest => 
        contest.title.toLowerCase().includes(lowercaseQuery) || 
        contest.description.toLowerCase().includes(lowercaseQuery) ||
        contest.category.name.toLowerCase().includes(lowercaseQuery)
      );
      
      // Search photos (only approved ones)
      const matchedPhotos = photos.filter(photo => 
        photo.moderationStatus === 'approved' && (
          (photo.caption && photo.caption.toLowerCase().includes(lowercaseQuery)) ||
          photo.username.toLowerCase().includes(lowercaseQuery)
        )
      );
      
      // Extract unique users from photos
      const userMap = new Map();
      photos.forEach(photo => {
        if (photo.username.toLowerCase().includes(lowercaseQuery)) {
          userMap.set(photo.userId, {
            id: photo.userId,
            username: photo.username,
            avatarUrl: '/placeholder.svg' // Using placeholder for mock data
          });
        }
      });
      
      const matchedUsers = Array.from(userMap.values());
      
      setResults({
        contests: matchedContests,
        photos: matchedPhotos,
        users: matchedUsers
      });
      
      setIsSearching(false);
    }, 500);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(searchQuery);
  };

  return (
    <div className="container max-w-4xl mx-auto py-6 px-4">
      <h1 className="text-3xl font-bold mb-6">Search</h1>
      
      <form onSubmit={handleSearch} className="mb-8">
        <div className="relative">
          <SearchIcon className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search contests, photos, or photographers..."
            className="pl-10 pr-32"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button 
            type="submit" 
            size="sm" 
            className="absolute right-1 top-1"
            disabled={isSearching || !searchQuery.trim()}
          >
            {isSearching ? 'Searching...' : 'Search'}
          </Button>
        </div>
      </form>
      
      {results && (
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="contests">Contests</TabsTrigger>
            <TabsTrigger value="photos">Photos</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            {results.contests.length === 0 && results.photos.length === 0 && results.users.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No results found for "{searchQuery}"</p>
              </div>
            ) : (
              <div className="space-y-8">
                {results.contests.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-semibold">Contests</h2>
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Calendar size={14} />
                        <span>{results.contests.length}</span>
                      </Badge>
                    </div>
                    <div className="space-y-4">
                      {results.contests.slice(0, 3).map(contest => (
                        <Card key={contest.id} className="overflow-hidden">
                          <Link to={`/contests/${contest.id}`}>
                            <CardContent className="p-0">
                              <div className="flex items-center">
                                <img 
                                  src={contest.coverImageUrl} 
                                  alt={contest.title}
                                  className="h-24 w-24 object-cover"
                                />
                                <div className="p-4">
                                  <h3 className="font-medium">{contest.title}</h3>
                                  <p className="text-sm text-muted-foreground mt-1">
                                    {contest.category.name} · {contest.status}
                                  </p>
                                </div>
                              </div>
                            </CardContent>
                          </Link>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
                
                {results.photos.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-semibold">Photos</h2>
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Image size={14} />
                        <span>{results.photos.length}</span>
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      {results.photos.slice(0, 4).map(photo => (
                        <Card key={photo.id} className="overflow-hidden">
                          <Link to={`/contests/${photo.contestId}`}>
                            <CardContent className="p-0">
                              <img 
                                src={photo.imageUrl} 
                                alt={photo.caption || "Contest photo"}
                                className="w-full h-40 object-cover"
                              />
                              <div className="p-3">
                                <p className="text-sm font-medium line-clamp-1">
                                  {photo.caption || "Untitled"}
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                  by {photo.username}
                                </p>
                              </div>
                            </CardContent>
                          </Link>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
                
                {results.users.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-semibold">Photographers</h2>
                      <Badge variant="outline" className="flex items-center gap-1">
                        <User size={14} />
                        <span>{results.users.length}</span>
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      {results.users.slice(0, 3).map(user => (
                        <Card key={user.id}>
                          <CardContent className="p-3">
                            <div className="flex items-center gap-3">
                              <Avatar>
                                <AvatarImage src={user.avatarUrl} alt={user.username} />
                                <AvatarFallback>{user.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{user.username}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="contests">
            {results.contests.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No contests found</p>
              </div>
            ) : (
              <div className="space-y-4">
                {results.contests.map(contest => (
                  <Card key={contest.id} className="overflow-hidden">
                    <Link to={`/contests/${contest.id}`}>
                      <CardContent className="p-0">
                        <div className="md:flex items-center">
                          <img 
                            src={contest.coverImageUrl} 
                            alt={contest.title}
                            className="h-48 md:h-32 md:w-48 w-full object-cover"
                          />
                          <div className="p-4">
                            <h3 className="font-medium">{contest.title}</h3>
                            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                              {contest.description}
                            </p>
                            <div className="flex items-center mt-2">
                              <Badge className={
                                contest.status === 'active' ? 'bg-snapstar-green text-white' :
                                contest.status === 'voting' ? 'bg-snapstar-blue text-white' :
                                contest.status === 'upcoming' ? 'bg-snapstar-orange text-white' :
                                'bg-snapstar-gray text-white'
                              }>
                                {contest.status.charAt(0).toUpperCase() + contest.status.slice(1)}
                              </Badge>
                              <span className="text-xs text-muted-foreground ml-2">
                                {contest.status === 'upcoming' 
                                  ? `Starts: ${contest.startDate.toLocaleDateString()}`
                                  : `Ends: ${contest.endDate.toLocaleDateString()}`
                                }
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Link>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="photos">
            {results.photos.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No photos found</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {results.photos.map(photo => (
                  <Card key={photo.id} className="overflow-hidden">
                    <Link to={`/contests/${photo.contestId}`}>
                      <CardContent className="p-0">
                        <img 
                          src={photo.imageUrl} 
                          alt={photo.caption || "Contest photo"}
                          className="w-full h-48 object-cover"
                        />
                        <div className="p-3">
                          <p className="text-sm font-medium line-clamp-1">
                            {photo.caption || "Untitled"}
                          </p>
                          <div className="flex justify-between items-center mt-1">
                            <p className="text-xs text-muted-foreground">
                              by {photo.username}
                            </p>
                            <div className="flex items-center text-yellow-500 text-xs">
                              <span className="mr-1">★</span>
                              <span>{photo.averageRating.toFixed(1)}</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Link>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="users">
            {results.users.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No users found</p>
              </div>
            ) : (
              <div className="space-y-4">
                {results.users.map(user => (
                  <Card key={user.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <Avatar className="size-12">
                          <AvatarImage src={user.avatarUrl} alt={user.username} />
                          <AvatarFallback>{user.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{user.username}</p>
                          <p className="text-sm text-muted-foreground mt-1">Photographer</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      )}
      
      {!results && !isSearching && (
        <div className="text-center py-16">
          <SearchIcon className="mx-auto size-16 text-muted-foreground mb-4" />
          <h2 className="text-lg font-medium mb-2">Search for contests, photos, and photographers</h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Enter a search term above to find contests, photos, or photographers that match your interests.
          </p>
        </div>
      )}
    </div>
  );
};

export default SearchPage;
