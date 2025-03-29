
import React from 'react';
import { Link } from 'react-router-dom';
import { Camera } from 'lucide-react';

const Logo = () => {
  return (
    <Link to="/" className="flex items-center gap-2 text-xl font-bold">
      <Camera className="h-6 w-6 text-snapstar-purple" />
      <span>SnapStar</span>
    </Link>
  );
};

export default Logo;
