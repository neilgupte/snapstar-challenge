
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, Camera, X, Award } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Upgrade = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  if (!user) {
    // Redirect to sign in if not logged in
    navigate('/signin');
    return null;
  }
  
  if (user.isPremium) {
    return (
      <div className="container max-w-md py-12">
        <Card className="border-snapstar-purple">
          <CardHeader className="pb-2 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-snapstar-purple/10">
              <Award className="h-6 w-6 text-snapstar-purple" />
            </div>
            <CardTitle className="mt-4 text-2xl">You're Already Premium</CardTitle>
            <CardDescription>
              You're already enjoying all the benefits of SnapStar Premium
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-2 text-center">
            <p className="text-sm text-muted-foreground">
              You have unlimited submissions and an ad-free experience.
              Thanks for supporting SnapStar!
            </p>
          </CardContent>
          <CardFooter className="flex justify-center pt-4">
            <Button onClick={() => navigate('/contests')}>
              Browse Contests
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl py-6">
      <div className="space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tight">Upgrade to Premium</h1>
          <p className="text-muted-foreground">
            Get unlimited submissions and an ad-free experience
          </p>
        </div>
        
        <div className="grid gap-6 sm:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Free Plan</CardTitle>
              <CardDescription>Your current plan</CardDescription>
              <div className="mt-4 text-3xl font-bold">$0</div>
            </CardHeader>
            <CardContent className="pb-2">
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 text-snapstar-green" />
                  <span>3 photo submissions per week</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 text-snapstar-green" />
                  <span>Basic profile</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 text-snapstar-green" />
                  <span>Vote on photos</span>
                </li>
                <li className="flex items-start gap-2">
                  <X className="mt-0.5 h-4 w-4 text-snapstar-red" />
                  <span className="text-muted-foreground">
                    Ads shown during browsing
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <X className="mt-0.5 h-4 w-4 text-snapstar-red" />
                  <span className="text-muted-foreground">
                    Limited submissions
                  </span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" disabled>
                Current Plan
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="border-snapstar-purple relative overflow-hidden">
            <div className="absolute -right-12 top-7 rotate-45 bg-snapstar-purple px-12 py-1 text-xs font-semibold text-white">
              RECOMMENDED
            </div>
            <CardHeader>
              <CardTitle>Premium Plan</CardTitle>
              <CardDescription>Unlock all features</CardDescription>
              <div className="mt-4 flex items-end">
                <div className="text-3xl font-bold">$5.99</div>
                <div className="text-muted-foreground">/month</div>
              </div>
              <div className="text-sm text-muted-foreground">
                Or $59.99/year (save 16%)
              </div>
            </CardHeader>
            <CardContent className="pb-2">
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 text-snapstar-purple" />
                  <span className="font-medium">
                    Unlimited photo submissions
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 text-snapstar-purple" />
                  <span>Ad-free experience</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 text-snapstar-purple" />
                  <span>Premium profile badge</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 text-snapstar-purple" />
                  <span>Early access to new contests</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 text-snapstar-purple" />
                  <span>Premium customer support</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full bg-snapstar-purple hover:bg-snapstar-purple/90">
                Upgrade Now
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        <div className="rounded-lg border p-6">
          <h2 className="text-xl font-semibold">Premium Benefits</h2>
          <div className="mt-4 grid gap-6 sm:grid-cols-3">
            <div className="flex flex-col items-center text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-snapstar-purple/10">
                <Camera className="h-6 w-6 text-snapstar-purple" />
              </div>
              <h3 className="mt-4 font-medium">Unlimited Submissions</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Enter as many contests as you want without weekly limits
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-snapstar-purple/10">
                <Award className="h-6 w-6 text-snapstar-purple" />
              </div>
              <h3 className="mt-4 font-medium">Premium Badge</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Stand out with a premium badge on your profile and submissions
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-snapstar-purple/10">
                <div className="relative flex h-6 w-6 items-center justify-center">
                  <div className="absolute h-4 w-4 rounded-sm border-2 border-snapstar-purple"></div>
                  <X className="h-3 w-3 text-snapstar-purple" />
                </div>
              </div>
              <h3 className="mt-4 font-medium">Ad-Free Experience</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Enjoy the platform without any advertisements or distractions
              </p>
            </div>
          </div>
        </div>
        
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Questions about premium? <a href="#" className="text-snapstar-purple hover:underline">Contact support</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Upgrade;
