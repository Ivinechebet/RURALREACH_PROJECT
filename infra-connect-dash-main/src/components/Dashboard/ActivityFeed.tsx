import { Flag, Star, FolderKanban, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const activities = [
  {
    icon: Flag,
    iconBg: "bg-blue-50",
    iconColor: "text-primary",
    title: "New report submitted",
    description: "User reported stalled progress on Kusumek Water Project",
    time: "2 hours ago",
  },
  {
    icon: Star,
    iconBg: "bg-green-50",
    iconColor: "text-success",
    title: "Project rated 5 stars",
    description: "Tachasis Village Water Project received excellent rating",
    time: "5 hours ago",
  },
  {
    icon: FolderKanban,
    iconBg: "bg-purple-50",
    iconColor: "text-purple-500",
    title: "Project status updated",
    description: "Mauche-Bombo-Olenguruone Road progress increased to 45%",
    time: "Yesterday",
  },
  {
    icon: AlertTriangle,
    iconBg: "bg-yellow-50",
    iconColor: "text-warning",
    title: "Urgent report flagged",
    description: "Safety concern reported at Taita Mauche Dispensary site",
    time: "2 days ago",
  },
];

export const ActivityFeed = () => {
  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.map((activity, index) => (
          <div key={index} className="flex items-start gap-4">
            <div className={`p-2 rounded-lg ${activity.iconBg}`}>
              <activity.icon className={`h-4 w-4 ${activity.iconColor}`} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm">{activity.title}</p>
              <p className="text-muted-foreground text-sm mt-1">{activity.description}</p>
              <p className="text-muted-foreground text-xs mt-1">{activity.time}</p>
            </div>
          </div>
        ))}
        <Button variant="outline" className="w-full mt-4" onClick={() => navigate("/activity")}>
          View All Activity
        </Button>
      </CardContent>
    </Card>
  );
};
