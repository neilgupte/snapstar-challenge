
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock } from 'lucide-react';
import { Contest } from '@/types';

interface ContestHeaderProps {
  contest: Contest;
  isActive: boolean;
  isVoting: boolean;
  isCompleted: boolean;
  formatDate: (date: Date) => string;
  getTimeRemaining: (date: Date) => string;
}

const ContestHeader: React.FC<ContestHeaderProps> = ({
  contest,
  isActive,
  isVoting,
  isCompleted,
  formatDate,
  getTimeRemaining
}) => {
  return (
    <div className="mb-8 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold tracking-tight">{contest.title}</h1>
            <Badge
              className={`${
                isActive ? 'bg-snapstar-green' :
                isVoting ? 'bg-snapstar-blue' :
                isCompleted ? 'bg-snapstar-gray' : 'bg-snapstar-orange'
              } text-white`}
            >
              {isActive ? 'Open for Entries' :
               isVoting ? 'Voting' :
               isCompleted ? 'Completed' : 'Upcoming'}
            </Badge>
          </div>
          <p className="mt-1 text-muted-foreground">
            Category: {contest.category.name}
          </p>
        </div>
      </div>
      
      <p className="text-lg">{contest.description}</p>
      
      <div className="flex flex-wrap gap-4">
        <div className="flex items-center gap-1">
          <Calendar size={18} className="text-muted-foreground" />
          <span>
            {isCompleted
              ? `Ended ${formatDate(contest.endDate)}`
              : isActive || isVoting
              ? `Closes ${formatDate(contest.endDate)}`
              : `Opens ${formatDate(contest.startDate)}`}
          </span>
        </div>
        
        {(isActive || isVoting) && (
          <div className="flex items-center gap-1">
            <Clock size={18} className="text-muted-foreground" />
            <span>{getTimeRemaining(contest.endDate)}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContestHeader;
