
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { photos, contests } from '@/services/mockData';
import StatsCard from '@/components/admin/StatsCard';
import AdminTabs from '@/components/admin/AdminTabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { DialogTrigger } from '@radix-ui/react-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  React.useEffect(() => {
    if (!user || !user.isAdmin) {
      navigate('/');
    }
  }, [user, navigate]);
  
  if (!user || !user.isAdmin) {
    return null;
  }
  
  const reportedPhotos = photos.slice(0, 2).map(photo => ({
    ...photo,
    reportReason: 'Possible copyright violation',
    reportedBy: 'user123',
    reportedAt: new Date()
  }));
  
  const contestStats = {
    total: contests.length,
    active: contests.filter(c => c.status === 'active').length,
    upcoming: contests.filter(c => c.status === 'upcoming').length,
    completed: contests.filter(c => c.status === 'completed').length,
  };
  
  const userStats = {
    total: 125,
    premium: 28,
    newToday: 5,
  };
  
  return (
    <div className="container max-w-6xl py-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Manage contests, moderate content, and monitor platform activity
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild>
            <a href="/admin/contests/new">Create New Contest</a>
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Premium Settings</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Premium Settings</DialogTitle>
                <DialogDescription>
                  Configure premium pricing and access
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="monthlyPrice">Monthly Price ($)</Label>
                  <Input id="monthlyPrice" type="number" defaultValue="9.99" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="yearlyPrice">Yearly Price ($)</Label>
                  <Input id="yearlyPrice" type="number" defaultValue="99.99" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="grantAccess">Grant Premium Access</Label>
                  <div className="flex items-center gap-2">
                    <Input id="userEmail" placeholder="Enter user email" />
                    <Button>Grant</Button>
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline">Cancel</Button>
                <Button>Save Changes</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-3">
        <StatsCard 
          title="Contests" 
          stats={[
            { value: contestStats.total, label: 'Total' },
            { value: contestStats.active, label: 'Active', className: 'text-snapstar-green' },
            { value: contestStats.upcoming, label: 'Upcoming', className: 'text-snapstar-orange' },
            { value: contestStats.completed, label: 'Completed', className: 'text-snapstar-gray' }
          ]} 
        />
        
        <StatsCard 
          title="Users" 
          stats={[
            { value: userStats.total, label: 'Total Users' },
            { value: userStats.premium, label: 'Premium', className: 'text-snapstar-purple' },
            { value: userStats.newToday, label: 'New Today', className: 'text-snapstar-blue' },
            { value: reportedPhotos.length, label: 'Reports', className: 'text-snapstar-red' }
          ]} 
        />
        
        <StatsCard 
          title="Content" 
          stats={[
            { value: photos.length, label: 'Total Photos' },
            { 
              value: photos.filter(p => p.moderationStatus === 'approved').length, 
              label: 'Approved', 
              className: 'text-snapstar-green' 
            },
            { 
              value: photos.filter(p => p.moderationStatus === 'pending').length, 
              label: 'Pending', 
              className: 'text-snapstar-orange' 
            },
            { 
              value: reportedPhotos.length, 
              label: 'Reported', 
              className: 'text-snapstar-red' 
            }
          ]} 
        />
      </div>
      
      <div className="mt-8">
        <AdminTabs reportedPhotos={reportedPhotos} contests={contests} />
      </div>
    </div>
  );
};

export default AdminDashboard;
