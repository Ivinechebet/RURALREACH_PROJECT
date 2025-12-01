import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { FolderKanban, Flag, Star, Smartphone } from "lucide-react";
import { StatsCard } from "@/components/Dashboard/StatsCard";
import { ProjectStatusChart } from "@/components/Dashboard/ProjectStatusChart";
import { ActivityFeed } from "@/components/Dashboard/ActivityFeed";
import { BudgetOverview } from "@/components/Dashboard/BudgetOverview";
import { ProjectsTable } from "@/components/Projects/ProjectsTable";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { getDashboardStats } from "@/services/api"; 
import { Button } from "@/components/ui/button";

const Dashboard = () => {
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");


   const { data: stats, isLoading, error, refetch } = useQuery({
    queryKey: ["dashboardStats"], 
    queryFn: getDashboardStats,  
    staleTime: 0,    
    refetchInterval: 1000 * 15, 
  });
if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="animate-pulse">Loading dashboard...</div>
      </div>
    );
  }

  if (error) {
    toast.error("Failed to load dashboard data");
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div>Error loading dashboard. Please try refreshing.</div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto bg-background min-h-screen">
      
     {/* Header Section with Title and Refresh Button */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">RuralReach Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back. Here's an overview of your projects and community activity.
          </p>
        </div>
        <Button onClick={() => refetch()} variant="outline" size="sm">
          Refresh Data
        </Button>
      </div>

      {/* Main Stats Grid - Clear and Responsive */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
         <StatsCard
          title="Total Projects"
          value={stats?.totalProjects?.toString() || "0"}
          icon={FolderKanban}
          trend={{ value: "2 new", label: "this month", isPositive: true }}
          iconBgColor="bg-blue-50"
           borderColor="border-purple-500"
          iconColor="text-blue-600"
        />
        <StatsCard
          title="Active Reports"
          value={stats?.activeReports?.toString() || "0"}
          icon={Flag}
          trend={{ value: "5 urgent", label: "need attention", isPositive: false }}
          iconBgColor="bg-red-50"
           borderColor="border-purple-500"
          iconColor="text-red-600"
        />
        <StatsCard
          title="Average Rating"
          value={stats?.avgRating?.toString() || "0.0"}
          icon={Star}
          trend={{ value: "0.3", label: "from last month", isPositive: true }}
          iconBgColor="bg-yellow-50"
           borderColor="border-purple-500"
          iconColor="text-yellow-600"
        />
        <StatsCard
          title="USSD Sessions"
          value={stats?.ussdSessions?.toString() || "0"}
          icon={Smartphone}
          trend={{ value: "12%", label: "from last week", isPositive: true }}
          borderColor="border-purple-500"
          iconBgColor="bg-purple-50"
          iconColor="text-purple-500"
        />
       
        
      </div>
      
      
      {/* Charts and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProjectStatusChart />
        <ActivityFeed />
      </div>

      {/* Budget Overview */}
      <BudgetOverview />
      
      {/* Projects Table with Filters */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <CardTitle  className="text-lg">All Projects</CardTitle>
            <div className="flex flex-wrap gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[130px] h-9 text-sm">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent className="bg-white ...">
                  <SelectItem className="hover:bg-green-500 ..."value="all">All Status</SelectItem>
                  <SelectItem className="hover:bg-green-500 ..."value="Completed">Completed</SelectItem>
                  <SelectItem className="hover:bg-green-500 ..."value="In Progress">In Progress</SelectItem>
                  <SelectItem className="hover:bg-green-500 ..."value="Planned">Planned</SelectItem>
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[130px] h-9 text-sm">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent className="bg-white ...">
                  <SelectItem className="hover:bg-sky-500 ..."value="all">All Types</SelectItem>
                  <SelectItem className="hover:bg-sky-500 ..." value="Water">Water</SelectItem>
                  <SelectItem className="hover:bg-sky-500 ..."value="Health">Health</SelectItem>
                  <SelectItem className="hover:bg-sky-500 ..."value="Infrastructure">Infrastructure</SelectItem>
                  <SelectItem className="hover:bg-sky-500 ..."value="Education">Education</SelectItem>
                  <SelectItem className="hover:bg-sky-500 ..."value="Agriculture">Agriculture</SelectItem>
                  <SelectItem className="hover:bg-sky-500 ..."value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <ProjectsTable showAll={true} statusFilter={statusFilter} typeFilter={typeFilter} />
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
