
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Trophy, Award, Medal } from 'lucide-react';
import { Link } from 'react-router-dom';

// Mock data for demonstration - export to be able to use in UserProfile.tsx
export const mockRankings = [
  {
    id: '1',
    username: 'PhotoMaster',
    avatarUrl: '/placeholder.svg',
    points: 1250,
    wins: 12,
    highlightedAchievement: 'Nature Category Champion'
  },
  {
    id: '2',
    username: 'LightCapture',
    avatarUrl: '/placeholder.svg',
    points: 980,
    wins: 8,
    highlightedAchievement: 'Portrait Master'
  },
  {
    id: '3',
    username: 'FrameAndFocus',
    avatarUrl: '/placeholder.svg',
    points: 840,
    wins: 7,
    highlightedAchievement: 'Street Photography Expert'
  },
  {
    id: '4',
    username: 'SnapGuru',
    avatarUrl: '/placeholder.svg',
    points: 720,
    wins: 5,
    highlightedAchievement: 'Macro Photography Star'
  },
  {
    id: '5',
    username: 'LensLegend',
    avatarUrl: '/placeholder.svg',
    points: 650,
    wins: 4,
    highlightedAchievement: 'Landscape Pioneer'
  },
  {
    id: '6',
    username: 'PixelPerfect',
    avatarUrl: '/placeholder.svg',
    points: 580,
    wins: 3,
    highlightedAchievement: 'Wildlife Master'
  },
  {
    id: '7',
    username: 'RegularUser',
    avatarUrl: '/placeholder.svg',
    points: 120,
    wins: 1,
    highlightedAchievement: 'Rising Star'
  },
];

const RankingBadge = ({ position }: { position: number }) => {
  if (position === 1) {
    return (
      <div className="flex items-center justify-center size-8 bg-yellow-500 text-white rounded-full">
        <Trophy size={16} />
      </div>
    );
  } else if (position === 2) {
    return (
      <div className="flex items-center justify-center size-8 bg-gray-400 text-white rounded-full">
        <Award size={16} />
      </div>
    );
  } else if (position === 3) {
    return (
      <div className="flex items-center justify-center size-8 bg-amber-700 text-white rounded-full">
        <Medal size={16} />
      </div>
    );
  } else {
    return (
      <div className="flex items-center justify-center size-8 bg-gray-200 text-gray-700 rounded-full">
        <span className="text-sm font-medium">{position}</span>
      </div>
    );
  }
};

const Rankings = () => {
  const { user } = useAuth();

  return (
    <div className="container max-w-4xl mx-auto py-6 px-4">
      <h1 className="text-3xl font-bold mb-6">Photographer Rankings</h1>
      
      {user && (
        <Card className="mb-8 border-snapstar-purple">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Your Ranking</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Avatar className="size-12 border-2 border-snapstar-purple">
                <AvatarImage src={user.avatarUrl || '/placeholder.svg'} alt={user.username} />
                <AvatarFallback>{user.username.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <Link to="/profile" className="font-medium hover:text-snapstar-purple">
                  {user.username}
                </Link>
                <p className="text-sm text-muted-foreground">
                  {mockRankings.findIndex(r => r.username === 'RegularUser') + 1} of {mockRankings.length} photographers
                </p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold">120 pts</p>
                <Badge variant="outline" className="mt-1">Rising Star</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      <h2 className="text-xl font-semibold mb-4">Top Photographers</h2>
      
      <div className="space-y-4">
        {mockRankings.map((photographer, index) => (
          <Card key={photographer.id} className={`hover:bg-accent/10 transition-colors ${user && photographer.username === 'RegularUser' ? 'border-snapstar-purple bg-accent/5' : ''}`}>
            <CardContent className="p-4">
              <Link to={`/profile/${photographer.id}`} className="flex items-center gap-4">
                <RankingBadge position={index + 1} />
                
                <Avatar className="size-10">
                  <AvatarImage src={photographer.avatarUrl} alt={photographer.username} />
                  <AvatarFallback>{photographer.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate hover:text-snapstar-purple">{photographer.username}</p>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Trophy size={12} className="mr-1" />
                    <span>{photographer.wins} {photographer.wins === 1 ? 'win' : 'wins'}</span>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="font-bold">{photographer.points} pts</p>
                  <Badge variant="outline" className="mt-1 text-xs">{photographer.highlightedAchievement}</Badge>
                </div>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Rankings;
