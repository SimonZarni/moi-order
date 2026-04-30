import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { ArrowLeft, Bell } from 'lucide-react';
import { SystemOverview } from './SystemOverview';
import { MerchantOnboarding } from './MerchantOnboarding';
import { UserManagement } from './UserManagement';
import { DisputeCenter } from './DisputeCenter';
import { NinetyDaysReportAdmin } from './NinetyDaysReportAdmin';
import { EmbassyLetterAdmin } from './EmbassyLetterAdmin';
import { WorkPermitAdmin } from './WorkPermitAdmin';

interface AdminMainProps {
  onBack: () => void;
}

export const AdminMain = ({ onBack }: AdminMainProps) => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-gradient-to-r from-primary/5 to-transparent p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">MoiOrder Admin Portal</h1>
            <p className="text-muted-foreground">System Administration Dashboard</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm">
              <Bell className="w-4 h-4 mr-2" />
              Alerts
              <Badge className="ml-2 bg-destructive text-white">2</Badge>
            </Button>
            <Button variant="outline" onClick={onBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Exit
            </Button>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="p-6">
        <TabsList className="grid w-full grid-cols-8 mb-8">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="90days">90 Days Report</TabsTrigger>
          <TabsTrigger value="embassy">Embassy Letter</TabsTrigger>
          <TabsTrigger value="workpermit">Work Permit</TabsTrigger>
          <TabsTrigger value="merchants">Merchants</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="disputes">Disputes</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <SystemOverview />
        </TabsContent>

        <TabsContent value="90days">
          <NinetyDaysReportAdmin />
        </TabsContent>

        <TabsContent value="embassy">
          <EmbassyLetterAdmin />
        </TabsContent>

        <TabsContent value="workpermit">
          <WorkPermitAdmin />
        </TabsContent>

        <TabsContent value="merchants">
          <MerchantOnboarding />
        </TabsContent>

        <TabsContent value="users">
          <UserManagement />
        </TabsContent>

        <TabsContent value="disputes">
          <DisputeCenter />
        </TabsContent>

        <TabsContent value="system">
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold mb-4">System Configuration</h3>
            <p className="text-muted-foreground">Advanced system settings and monitoring tools will be available here.</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};