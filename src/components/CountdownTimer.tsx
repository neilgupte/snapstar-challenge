
import React, { useState, useEffect } from 'react';

interface CountdownTimerProps {
  endDate: Date;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ endDate }) => {
  const [timeRemaining, setTimeRemaining] = useState<{
    hours: number;
    minutes: number;
    seconds: number;
  }>({ hours: 0, minutes: 0, seconds: 0 });
  
  const [isLessThanHour, setIsLessThanHour] = useState(false);

  useEffect(() => {
    const calculateTimeRemaining = () => {
      const now = new Date();
      const diff = endDate.getTime() - now.getTime();
      
      if (diff <= 0) {
        setTimeRemaining({ hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      setTimeRemaining({ hours, minutes, seconds });
      setIsLessThanHour(hours < 1);
    };
    
    calculateTimeRemaining();
    const interval = setInterval(calculateTimeRemaining, 1000);
    
    return () => clearInterval(interval);
  }, [endDate]);
  
  if (!isLessThanHour) {
    return null;
  }
  
  return (
    <div className="text-snapstar-red font-medium animate-pulse text-center">
      {timeRemaining.hours > 0 && (
        <span>{timeRemaining.hours}h </span>
      )}
      <span>{timeRemaining.minutes.toString().padStart(2, '0')}:</span>
      <span>{timeRemaining.seconds.toString().padStart(2, '0')}</span>
      <span> remaining!</span>
    </div>
  );
};

export default CountdownTimer;
