
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { photos, contests } from '@/services/mockData';
import { Flag, Check, X, Alert, ShieldAlert } from 'lucide-react';

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Redirect if not admin
  React.useEffect(() => {
    if (!user || !user.isAdmin) {
      navigate('/');
    }
  }, [user, navigate]);
  
  if (!user || !user.isAdmin) {
    return null;
  }
  
  // Mock content moderation data
  const reportedPhotos = photos.slice(0, 2).map(photo => ({
    ...photo,
    reportReason: 'Possible copyright violation',
    reportedBy: 'user123',
    reportedAt: new Date()
  }));
  
  // Mock contest stats
  const contestStats = {
    total: contests.length,
    active: contests.filter(c => c.status === 'active').length,
    upcoming: contests.filter(c => c.status === 'upcoming').length,
    completed: contests.filter(c => c.status === 'completed').length,
  };
  
  // Mock user stats
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
        <Button asChild>
          <a href="/admin/contests/new">Create New Contest</a>
        </Button>
      </div>
      
      {/* Stats cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Contests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-3xl font-bold">{contestStats.total}</div>
                <div className="text-sm text-muted-foreground">Total</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-snapstar-green">
                  {contestStats.active}
                </div>
                <div className="text-sm text-muted-foreground">Active</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-snapstar-orange">
                  {contestStats.upcoming}
                </div>
                <div className="text-sm text-muted-foreground">Upcoming</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-snapstar-gray">
                  {contestStats.completed}
                </div>
                <div className="text-sm text-muted-foreground">Completed</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-3xl font-bold">{userStats.total}</div>
                <div className="text-sm text-muted-foreground">Total Users</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-snapstar-purple">
                  {userStats.premium}
                </div>
                <div className="text-sm text-muted-foreground">Premium</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-snapstar-blue">
                  {userStats.newToday}
                </div>
                <div className="text-sm text-muted-foreground">New Today</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-snapstar-red">
                  2
                </div>
                <div className="text-sm text-muted-foreground">Reports</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Content</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-3xl font-bold">{photos.length}</div>
                <div className="text-sm text-muted-foreground">Total Photos</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-snapstar-green">
                  {photos.filter(p => p.moderationStatus === 'approved').length}
                </div>
                <div className="text-sm text-muted-foreground">Approved</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-snapstar-orange">
                  {photos.filter(p => p.moderationStatus === 'pending').length}
                </div>
                <div className="text-sm text-muted-foreground">Pending</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-snapstar-red">
                  {reportedPhotos.length}
                </div>
                <div className="text-sm text-muted-foreground">Reported</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Moderation section */}
      <div className="mt-8">
        <Tabs defaultValue="reported">
          <TabsList>
            <TabsTrigger value="reported">
              <Flag className="mr-1 h-4 w-4" />
              Reported Content
            </TabsTrigger>
            <TabsTrigger value="pending">
              <Alert className="mr-1 h-4 w-4" />
              Pending Review
            </TabsTrigger>
            <TabsTrigger value="contests">Contests</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
          </TabsList>
          
          <TabsContent value="reported" className="mt-4 space-y-4">
            <h2 className="text-xl font-semibold">Reported Content</h2>
            
            {reportedPhotos.length > 0 ? (
              <div className="space-y-4">
                {reportedPhotos.map((photo) => (
                  <Card key={photo.id}>
                    <div className="flex flex-col sm:flex-row">
                      <div className="w-full sm:w-1/3">
                        <img
                          src={photo.imageUrl}
                          alt={photo.caption || 'Reported photo'}
                          className="aspect-square h-full w-full object-cover sm:rounded-l-lg"
                        />
                      </div>
                      <div className="flex flex-1 flex-col justify-between p-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <ShieldAlert className="h-5 w-5 text-snapstar-red" />
                            <h3 className="font-semibold">{photo.caption || 'Untitled'}</h3>
                          </div>
                          <div className="mt-2 space-y-2 text-sm">
                            <p>
                              <span className="font-medium">Reported by:</span>{' '}
                              {photo.reportedBy}
                            </p>
                            <p>
                              <span className="font-medium">Reason:</span>{' '}
                              {photo.reportReason}
                            </p>
                            <p>
                              <span className="font-medium">Submitted by:</span>{' '}
                              {photo.username}
                            </p>
                          </div>
                        </div>
                        <div className="mt-4 flex gap-2">
                          <Button size="sm" className="gap-1 bg-snapstar-green hover:bg-snapstar-green/90">
                            <Check className="h-4 w-4" />
                            Approve
                          </Button>
                          <Button size="sm" variant="destructive" className="gap-1">
                            <X className="h-4 w-4" />
                            Remove
                          </Button>
                          <Button size="sm" variant="outline">
                            Review Contest
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="rounded-lg border p-8 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                  <Check className="h-6 w-6 text-snapstar-green" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">All Clear</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  There are no reported photos to review at this time.
                </p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="pending" className="mt-4">
            <h2 className="text-xl font-semibold">Pending Review</h2>
            <div className="mt-4 rounded-lg border p-8 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                <Check className="h-6 w-6 text-snapstar-green" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">All Clear</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                There are no photos pending review at this time.
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="contests" className="mt-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Manage Contests</h2>
              <Button asChild>
                <a href="/admin/contests/new">Create New Contest</a>
              </Button>
            </div>
            
            <div className="mt-4 rounded-lg border">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="px-4 py-2 text-left font-medium">Title</th>
                      <th className="px-4 py-2 text-left font-medium">Category</th>
                      <th className="px-4 py-2 text-left font-medium">Status</th>
                      <th className="px-4 py-2 text-left font-medium">Start Date</th>
                      <th className="px-4 py-2 text-left font-medium">End Date</th>
                      <th className="px-4 py-2 text-left font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contests.map((contest) => (
                      <tr key={contest.id} className="border-b">
                        <td className="px-4 py-2">{contest.title}</td>
                        <td className="px-4 py-2">{contest.category.name}</td>
                        <td className="px-4 py-2">
                          <div
                            className={`inline-block rounded-full px-2 py-1 text-xs font-medium ${
                              contest.status === 'active'
                                ? 'bg-snapstar-green/20 text-snapstar-green'
                                : contest.status === 'upcoming'
                                ? 'bg-snapstar-orange/20 text-snapstar-orange'
                                : contest.status === 'voting'
                                ? 'bg-snapstar-blue/20 text-snapstar-blue'
                                : 'bg-snapstar-gray/20 text-snapstar-gray'
                            }`}
                          >
                            {contest.status.charAt(0).toUpperCase() + contest.status.slice(1)}
                          </div>
                        </td>
                        <td className="px-4 py-2">
                          {contest.startDate.toLocaleDateString()}
                        </td>
                        <td className="px-4 py-2">
                          {contest.endDate.toLocaleDateString()}
                        </td>
                        <td className="px-4 py-2">
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" className="h-8">
                              Edit
                            </Button>
                            <Button size="sm" variant="outline" className="h-8">
                              View
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="users" className="mt-4">
            <h2 className="text-xl font-semibold">Manage Users</h2>
            <p className="mt-2 text-muted-foreground">
              This section will allow you to view and manage user accounts.
            </p>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
