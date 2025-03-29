
import React from 'react';
import { Button } from '@/components/ui/button';
import { Contest } from '@/types';
import { DialogTrigger, Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ContestListProps {
  contests: Contest[];
}

const ContestList: React.FC<ContestListProps> = ({ contests }) => {
  return (
    <div>
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
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="sm" variant="outline" className="h-8">
                            Settings
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Contest Settings</DialogTitle>
                            <DialogDescription>
                              Configure the parameters for this contest
                            </DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                              <Label htmlFor="submissionDays">Submission Period (days)</Label>
                              <Input id="submissionDays" type="number" defaultValue="7" />
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor="votingDays">Voting Period (days)</Label>
                              <Input id="votingDays" type="number" defaultValue="3" />
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor="featured">Featured Contest</Label>
                              <div className="flex items-center space-x-2">
                                <input type="checkbox" id="featured" />
                                <label htmlFor="featured" className="text-sm">Show on homepage</label>
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
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ContestList;
