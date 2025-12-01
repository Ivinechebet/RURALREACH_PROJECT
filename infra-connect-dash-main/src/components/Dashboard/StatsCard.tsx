import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: string;
    label: string;
    isPositive: boolean;
  };
  borderColor: string;
  iconBgColor: string;
  iconColor: string;
}

export const StatsCard = ({
  title,
  value,
  icon: Icon,
  trend,
  borderColor,
  iconBgColor,
  iconColor,
}: StatsCardProps) => {
  return (
    <Card className={`border-l-4 ${borderColor}`}>
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-muted-foreground text-sm">{title}</p>
            <h3 className="text-2xl font-bold mt-1">{value}</h3>
          </div>
          <div className={`p-3 rounded-lg ${iconBgColor}`}>
            <Icon className={`h-5 w-5 ${iconColor}`} />
          </div>
        </div>
        {trend && (
          <p className="text-sm text-muted-foreground mt-4">
            <span className={trend.isPositive ? "text-success" : "text-destructive"}>
              {trend.isPositive ? "↑" : "↓"} {trend.value}
            </span>{" "}
            {trend.label}
          </p>
        )}
      </CardContent>
    </Card>
  );
};
