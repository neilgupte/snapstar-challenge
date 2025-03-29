
import React from 'react';
import { Link } from 'react-router-dom';
import { Camera } from 'lucide-react';

const Logo = () => {
  return (
    <Link to="/" className="flex items-center gap-2 text-xl font-bold">
      <div className="flex items-center justify-center bg-snapstar-purple text-white p-1.5 rounded-md">
        <Camera className="h-5 w-5" />
      </div>
      <span className="hidden sm:inline">SnapStar</span>
    </Link>
  );
};

export default Logo;
