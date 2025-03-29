
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/contexts/AuthContext';
import { Eye, EyeOff, Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const MAX_BIRTHDATE = new Date();
MAX_BIRTHDATE.setFullYear(MAX_BIRTHDATE.getFullYear() - 12);

const signUpSchema = z.object({
  username: z.string().min(3, { message: 'Username must be at least 3 characters' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters' }),
  dateOfBirth: z.date().max(MAX_BIRTHDATE, { message: 'You must be at least 12 years old to register' }),
  acceptTerms: z.literal(true, {
    errorMap: () => ({ message: 'You must accept the Terms and Conditions' }),
  }),
});

type SignUpFormValues = z.infer<typeof signUpSchema>;

const SignUpForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { signUp, isLoading, isValidAge } = useAuth();
  const navigate = useNavigate();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      dateOfBirth: undefined,
      acceptTerms: false,
    },
  });

  const onSubmit = async (data: SignUpFormValues) => {
    try {
      if (!isValidAge(data.dateOfBirth)) {
        return; // This should be caught by zod validation
      }
      
      await signUp(
        data.email,
        data.password,
        data.username,
        data.dateOfBirth,
        data.acceptTerms
      );
      
      navigate('/');
    } catch (error) {
      // Error is already handled by the auth context
    }
  };

  return (
    <div className="space-y-4 w-full max-w-sm">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Create an account</h1>
        <p className="text-muted-foreground">Enter your details to get started</p>
      </div>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            placeholder="johnsmith"
            {...register('username')}
          />
          {errors.username && (
            <p className="text-sm text-destructive">{errors.username.message}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="email@example.com"
            {...register('email')}
          />
          {errors.email && (
            <p className="text-sm text-destructive">{errors.email.message}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              {...register('password')}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-full px-3"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </Button>
          </div>
          {errors.password && (
            <p className="text-sm text-destructive">{errors.password.message}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="dateOfBirth" className="flex items-center gap-1">
            Date of Birth
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info size={16} className="text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>You must be at least 12 years old to use SnapStar</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </Label>
          <Input
            id="dateOfBirth"
            type="date"
            max={MAX_BIRTHDATE.toISOString().split('T')[0]}
            {...register('dateOfBirth', {
              valueAsDate: true,
            })}
          />
          {errors.dateOfBirth && (
            <p className="text-sm text-destructive">{errors.dateOfBirth.message}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <div className="flex items-start space-x-2">
            <Checkbox
              id="acceptTerms"
              {...register('acceptTerms')}
            />
            <div className="grid gap-1">
              <Label
                htmlFor="acceptTerms"
                className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                I accept the{' '}
                <Link to="/terms" className="text-snapstar-purple hover:underline">
                  Terms and Conditions
                </Link>{' '}
                and{' '}
                <Link to="/privacy" className="text-snapstar-purple hover:underline">
                  Privacy Policy
                </Link>
              </Label>
            </div>
          </div>
          {errors.acceptTerms && (
            <p className="text-sm text-destructive">{errors.acceptTerms.message}</p>
          )}
        </div>
        
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Creating account...' : 'Sign Up'}
        </Button>
      </form>
      
      <div className="text-center text-sm">
        <p>
          Already have an account?{' '}
          <Link to="/signin" className="text-snapstar-purple hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUpForm;
