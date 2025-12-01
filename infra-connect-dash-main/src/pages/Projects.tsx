import { useState } from "react";
import { ProjectsTable } from "@/components/Projects/ProjectsTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download } from "lucide-react";
import { exportToCSV } from "@/utils/exportUtils";
import { toast } from "sonner";

const projectData = [
  { month: "Jan", completed: 2, inProgress: 3, planned: 1 },
  { month: "Feb", completed: 3, inProgress: 4, planned: 2 },
  { month: "Mar", completed: 1, inProgress: 6, planned: 4 },
  { month: "Apr", completed: 2, inProgress: 5, planned: 3 },
  { month: "May", completed: 3, inProgress: 4, planned: 2 },
  { month: "Jun", completed: 2, inProgress: 5, planned: 1 },
  { month: "Jul", completed: 1, inProgress: 6, planned: 3 },
  { month: "Aug", completed: 2, inProgress: 5, planned: 2 },
  { month: "Sep", completed: 3, inProgress: 4, planned: 1 },
  { month: "Oct", completed: 2, inProgress: 5, planned: 2 },
  { month: "Nov", completed: 1, inProgress: 6, planned: 3 },
  { month: "Dec", completed: 2, inProgress: 4, planned: 2 },
];

const Projects = () => {
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  const handleExport = () => {
    // Get the projects data from the table (in a real app, this would come from state or props)
    const exportData = [
      { name: "Kusumek Water Project", type: "Water", status: "In Progress", progress: 90, location: "Kusumek Village" },
      { name: "Tach Asis Water Project", type: "Water", status: "In Progress", progress: 85, location: "Tachasis Village" },
      { name: "Tachasis Village Water Project", type: "Water", status: "Completed", progress: 100, location: "Tachasis Village" },
      { name: "Kaplekwa Borehole Project", type: "Water", status: "In Progress", progress: 70, location: "Teret Area" },
      { name: "Taita Mauche Dispensary", type: "Health", status: "In Progress", progress: 60, location: "Mauche Ward" },
      { name: "Mauche-Bombo-Olenguruone Road", type: "Infrastructure", status: "In Progress", progress: 45, location: "Mauche Section" },
      { name: "Mauche Road Grading Program", type: "Infrastructure", status: "Planned", progress: 0, location: "Mauche Ward" },
      { name: "Likia Police-Chorwet Primary Road", type: "Infrastructure", status: "Planned", progress: 0, location: "Likia to Chorwet" },
      { name: "Mauche Culverts Installation", type: "Infrastructure", status: "Planned", progress: 0, location: "Mauche Ward" },
      { name: "Imarisha Barabara Program", type: "Infrastructure", status: "In Progress", progress: 30, location: "Mauche Ward" },
      { name: "Boda-Boda Sheds Construction", type: "Other", status: "In Progress", progress: 75, location: "Mauche Trading Center" },
    ];
    
    exportToCSV(exportData, "projects");
    toast.success("Projects exported successfully!");
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold">Projects</h2>
          <p className="text-muted-foreground mt-2">
            Manage and monitor all rural development projects
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
              <SelectItem value="In Progress">In Progress</SelectItem>
              <SelectItem value="Planned">Planned</SelectItem>
            </SelectContent>
          </Select>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="Water">Water</SelectItem>
              <SelectItem value="Health">Health</SelectItem>
              <SelectItem value="Infrastructure">Infrastructure</SelectItem>
              <SelectItem value="Education">Education</SelectItem>
              <SelectItem value="Agriculture">Agriculture</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleExport} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Project Timeline Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={projectData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="completed" fill="hsl(var(--success))" name="Completed" />
                <Bar dataKey="inProgress" fill="hsl(var(--primary))" name="In Progress" />
                <Bar dataKey="planned" fill="hsl(var(--warning))" name="Planned" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <ProjectsTable statusFilter={statusFilter} typeFilter={typeFilter} />
    </div>
  );
};

export default Projects;
