import { Flag, Star, FolderKanban, AlertTriangle, Users, Settings, CheckCircle2, XCircle, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const allActivities = [
  {
    icon: Flag,
    iconBg: "bg-blue-50",
    iconColor: "text-primary",
    title: "New report submitted",
    description: "User reported stalled progress on Kusumek Water Project",
    time: "2 hours ago",
    category: "reports",
    type: "info",
  },
  {
    icon: Star,
    iconBg: "bg-green-50",
    iconColor: "text-success",
    title: "Project rated 5 stars",
    description: "Tachasis Village Water Project received excellent rating",
    time: "5 hours ago",
    category: "ratings",
    type: "success",
  },
  {
    icon: FolderKanban,
    iconBg: "bg-purple-50",
    iconColor: "text-purple-500",
    title: "Project status updated",
    description: "Mauche-Bombo-Olenguruone Road progress increased to 45%",
    time: "Yesterday",
    category: "projects",
    type: "info",
  },
  {
    icon: AlertTriangle,
    iconBg: "bg-yellow-50",
    iconColor: "text-warning",
    title: "Urgent report flagged",
    description: "Safety concern reported at Taita Mauche Dispensary site",
    time: "2 days ago",
    category: "reports",
    type: "warning",
  },
  {
    icon: Users,
    iconBg: "bg-blue-50",
    iconColor: "text-primary",
    title: "New user registered",
    description: "John Doe from Mauche Ward joined the platform",
    time: "3 days ago",
    category: "users",
    type: "info",
  },
  {
    icon: CheckCircle2,
    iconBg: "bg-green-50",
    iconColor: "text-success",
    title: "Project completed",
    description: "Tachasis Village Water Project successfully completed and handed over",
    time: "1 week ago",
    category: "projects",
    type: "success",
  },
  {
    icon: Clock,
    iconBg: "bg-orange-50",
    iconColor: "text-orange-500",
    title: "Project deadline approaching",
    description: "Taita Mauche Dispensary deadline in 2 weeks",
    time: "1 week ago",
    category: "projects",
    type: "warning",
  },
  {
    icon: Star,
    iconBg: "bg-green-50",
    iconColor: "text-success",
    title: "High rating received",
    description: "Kaplekwa Borehole Project rated 4.8 stars by community",
    time: "1 week ago",
    category: "ratings",
    type: "success",
  },
  {
    icon: Flag,
    iconBg: "bg-blue-50",
    iconColor: "text-primary",
    title: "Report resolved",
    description: "Issue at Imarisha Barabara Program has been resolved",
    time: "2 weeks ago",
    category: "reports",
    type: "success",
  },
  {
    icon: Settings,
    iconBg: "bg-gray-50",
    iconColor: "text-gray-500",
    title: "System settings updated",
    description: "Notification preferences updated by admin",
    time: "2 weeks ago",
    category: "system",
    type: "info",
  },
];

const Activity = () => {
  const getTypeColor = (type: string) => {
    switch (type) {
      case "success":
        return "bg-success/10 text-success border-success";
      case "warning":
        return "bg-warning/10 text-warning border-warning";
      case "error":
        return "bg-destructive/10 text-destructive border-destructive";
      default:
        return "bg-primary/10 text-primary border-primary";
    }
  };

  const filterActivities = (category: string) => {
    if (category === "all") return allActivities;
    return allActivities.filter(activity => activity.category === category);
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-3xl font-bold">Activity Log</h2>
        <p className="text-muted-foreground mt-2">
          View all system activities and events
        </p>
      </div>

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">All Activity</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="ratings">Ratings</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>All Activities</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {filterActivities("all").map((activity, index) => (
                <div key={index} className="flex items-start gap-4 p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                  <div className={`p-2 rounded-lg ${activity.iconBg} flex-shrink-0`}>
                    <activity.icon className={`h-5 w-5 ${activity.iconColor}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-medium">{activity.title}</p>
                      <Badge variant="outline" className={getTypeColor(activity.type)}>
                        {activity.type}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground text-sm mt-1">{activity.description}</p>
                    <p className="text-muted-foreground text-xs mt-2">{activity.time}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="projects" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Project Activities</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {filterActivities("projects").map((activity, index) => (
                <div key={index} className="flex items-start gap-4 p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                  <div className={`p-2 rounded-lg ${activity.iconBg} flex-shrink-0`}>
                    <activity.icon className={`h-5 w-5 ${activity.iconColor}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-medium">{activity.title}</p>
                      <Badge variant="outline" className={getTypeColor(activity.type)}>
                        {activity.type}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground text-sm mt-1">{activity.description}</p>
                    <p className="text-muted-foreground text-xs mt-2">{activity.time}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Report Activities</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {filterActivities("reports").map((activity, index) => (
                <div key={index} className="flex items-start gap-4 p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                  <div className={`p-2 rounded-lg ${activity.iconBg} flex-shrink-0`}>
                    <activity.icon className={`h-5 w-5 ${activity.iconColor}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-medium">{activity.title}</p>
                      <Badge variant="outline" className={getTypeColor(activity.type)}>
                        {activity.type}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground text-sm mt-1">{activity.description}</p>
                    <p className="text-muted-foreground text-xs mt-2">{activity.time}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ratings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Rating Activities</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {filterActivities("ratings").map((activity, index) => (
                <div key={index} className="flex items-start gap-4 p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                  <div className={`p-2 rounded-lg ${activity.iconBg} flex-shrink-0`}>
                    <activity.icon className={`h-5 w-5 ${activity.iconColor}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-medium">{activity.title}</p>
                      <Badge variant="outline" className={getTypeColor(activity.type)}>
                        {activity.type}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground text-sm mt-1">{activity.description}</p>
                    <p className="text-muted-foreground text-xs mt-2">{activity.time}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Activities</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {filterActivities("users").map((activity, index) => (
                <div key={index} className="flex items-start gap-4 p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                  <div className={`p-2 rounded-lg ${activity.iconBg} flex-shrink-0`}>
                    <activity.icon className={`h-5 w-5 ${activity.iconColor}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-medium">{activity.title}</p>
                      <Badge variant="outline" className={getTypeColor(activity.type)}>
                        {activity.type}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground text-sm mt-1">{activity.description}</p>
                    <p className="text-muted-foreground text-xs mt-2">{activity.time}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>System Activities</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {filterActivities("system").map((activity, index) => (
                <div key={index} className="flex items-start gap-4 p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                  <div className={`p-2 rounded-lg ${activity.iconBg} flex-shrink-0`}>
                    <activity.icon className={`h-5 w-5 ${activity.iconColor}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-medium">{activity.title}</p>
                      <Badge variant="outline" className={getTypeColor(activity.type)}>
                        {activity.type}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground text-sm mt-1">{activity.description}</p>
                    <p className="text-muted-foreground text-xs mt-2">{activity.time}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Activity;
