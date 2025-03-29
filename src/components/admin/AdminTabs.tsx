
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Flag, AlertCircle } from 'lucide-react';
import { Contest, Photo } from '@/types';
import ReportedContent from './ReportedContent';
import ContestList from './ContestList';
import EmptyTabContent from './EmptyTabContent';

interface AdminTabsProps {
  reportedPhotos: Array<Photo & { reportReason: string; reportedBy: string; reportedAt: Date }>;
  contests: Contest[];
}

const AdminTabs: React.FC<AdminTabsProps> = ({ reportedPhotos, contests }) => {
  return (
    <Tabs defaultValue="reported">
      <TabsList>
        <TabsTrigger value="reported">
          <Flag className="mr-1 h-4 w-4" />
          Reported Content
        </TabsTrigger>
        <TabsTrigger value="pending">
          <AlertCircle className="mr-1 h-4 w-4" />
          Pending Review
        </TabsTrigger>
        <TabsTrigger value="contests">Contests</TabsTrigger>
        <TabsTrigger value="users">Users</TabsTrigger>
      </TabsList>
      
      <TabsContent value="reported" className="mt-4 space-y-4">
        <h2 className="text-xl font-semibold">Reported Content</h2>
        <ReportedContent reportedPhotos={reportedPhotos} />
      </TabsContent>
      
      <TabsContent value="pending" className="mt-4">
        <EmptyTabContent 
          title="Pending Review" 
          message="There are no photos pending review at this time." 
        />
      </TabsContent>
      
      <TabsContent value="contests" className="mt-4">
        <ContestList contests={contests} />
      </TabsContent>
      
      <TabsContent value="users" className="mt-4">
        <EmptyTabContent 
          title="Manage Users" 
          message="This section will allow you to view and manage user accounts." 
        />
      </TabsContent>
    </Tabs>
  );
};

export default AdminTabs;
