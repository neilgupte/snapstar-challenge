
/**
 * Format a date to a locale-friendly string
 * @param date Date to format
 * @returns Formatted date string
 */
export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
};

/**
 * Format time remaining until a given date
 * @param date Future date to calculate time remaining to
 * @returns String representation of the time remaining
 */
export const getTimeRemaining = (date: Date): string => {
  const now = new Date();
  const diff = date.getTime() - now.getTime();
  
  if (diff <= 0) return 'Ended';
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  if (days > 0) {
    return `${days} day${days !== 1 ? 's' : ''} left`;
  }
  
  if (hours > 0) {
    return `${hours} hour${hours !== 1 ? 's' : ''} left`;
  }
  
  return `${minutes} minute${minutes !== 1 ? 's' : ''} left`;
};

/**
 * Get a CSS class name based on a contest status
 * @param status The contest status
 * @returns CSS class string
 */
export const getStatusColor = (status: string): string => {
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
