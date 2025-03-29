
import React from 'react';
import { useNavigate } from 'react-router-dom';
import SignUpForm from '@/components/auth/SignUpForm';
import { useAuth } from '@/contexts/AuthContext';

const SignUp = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Redirect if already logged in
  React.useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">SnapStar</h1>
          <p className="text-sm text-muted-foreground">
            Join the photography contest community
          </p>
        </div>
        
        <SignUpForm />
      </div>
    </div>
  );
};

export default SignUp;
