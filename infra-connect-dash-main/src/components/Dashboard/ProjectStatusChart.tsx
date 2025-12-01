import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { useState, useEffect } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const allData = {
  "7days": [
    { name: "Completed", value: 1, color: "hsl(var(--success))" },
    { name: "In Progress", value: 6, color: "hsl(var(--primary))" },
    { name: "Planned", value: 4, color: "hsl(var(--warning))" },
  ],
  "30days": [
    { name: "Completed", value: 8, color: "hsl(var(--success))" },
    { name: "In Progress", value: 12, color: "hsl(var(--primary))" },
    { name: "Planned", value: 5, color: "hsl(var(--warning))" },
  ],
  "90days": [
    { name: "Completed", value: 25, color: "hsl(var(--success))" },
    { name: "In Progress", value: 15, color: "hsl(var(--primary))" },
    { name: "Planned", value: 10, color: "hsl(var(--warning))" },
  ],
};

export const ProjectStatusChart = () => {
  const [timeRange, setTimeRange] = useState("7days");
  const [data, setData] = useState([]); // State for the fetched data
  const [isLoading, setIsLoading] = useState(true); 

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      // Simulate a network delay
      await new Promise(resolve => setTimeout(resolve, 300)); 
      
      const result = allData[timeRange];
      
      setData(result);
      setIsLoading(false);
    };

    fetchData();
  }, [timeRange]); // This effect runs when timeRange changes

  if (isLoading) {
    return <div>Loading chart...</div>;
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Project Status Distribution</CardTitle>
        <Select 
          value={timeRange} // <-- CHANGE HERE
          onValueChange={setTimeRange} // <-- CHANGE HERE
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Select range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7days">Last 7 days</SelectItem>
            <SelectItem value="30days">Last 30 days</SelectItem>
            <SelectItem value="90days">Last 90 days</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};