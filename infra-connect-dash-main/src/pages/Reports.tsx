import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Flag, Clock, CheckCircle, XCircle, Calendar, User, AlertTriangle, FileText } from "lucide-react";
import { toast } from "sonner";

// Initial static data - this will be loaded into state
const initialReports = [
  {
    id: 1,
    project: "Kusumek Water Project",
    issue: "Maendeleo Yamekwama",
    description: "Ujenzi umecheleweshwa kwa wiki 2 kutokana na upungufu wa vifaa. Mkokoteni ametaja matatizo ya mnyororo wa usambazaji wa saruji na chuma cha kuimarisha.",
    priority: "High",
    status: "Open",
    date: "2 hours ago",
    reporter: "John Doe",
  },
  {
    id: 2,
    project: "Taita Mauche Dispensary",
    issue: "Safety Concern",
    description: "Workers not using proper safety equipment at the construction site. Specifically, no hard hats or harnesses were observed.",
    priority: "Urgent",
    status: "Open",
    date: "2 days ago",
    reporter: "Jane Smith",
  },
  {
    id: 3,
    project: "Mauche-Bombo-Olenguruone Road",
    issue: "Quality Issue",
    description: "Road surface showing cracks in recently completed section. This could indicate a problem with the foundation or the asphalt mix.",
    priority: "Medium",
    status: "In Review",
    date: "5 days ago",
    reporter: "Mike Johnson",
  },
  {
    id: 4,
    project: "Tachasis Village Water Project",
    issue: "Nyaraka Zinakosekana",
    description: "Ripoti za ukaguzi wa mwisho hazijawasilishwa. Mradi umekamilika kwenye uwanja lakini nyaraka zinasababisha ucheleweshaji wa usaini wa mwisho.",
    priority: "Low",
    status: "Resolved",
    date: "1 week ago",
    reporter: "Sarah Williams",
  },
];

const Reports = () => {
  // 1. State for managing the reports list
  const [reports, setReports] = useState(initialReports);

  // 2. State for controlling the "View Details" dialog
  const [selectedReport, setSelectedReport] = useState<typeof initialReports[0] | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);

  // 3. Memoize the stats to avoid re-calculating on every render
  const stats = useMemo(() => {
    const urgent = reports.filter(r => r.priority === "Urgent").length;
    const open = reports.filter(r => r.status === "Open").length;
    const resolved = reports.filter(r => r.status === "Resolved").length;
    return { urgent, open, resolved };
  }, [reports]);

  // Get priority icon and color
  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "Urgent":
        return { icon: AlertTriangle, color: "text-red-600" };
      case "High":
        return { icon: Flag, color: "text-orange-500" };
      case "Medium":
        return { icon: Clock, color: "text-yellow-500" };
      case "Low":
        return { icon: FileText, color: "text-blue-500" };
      default:
        return { icon: Flag, color: "text-gray-500" };
    }
  };

  // Get status icon and color
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Open":
        return { icon: Clock, color: "text-orange-500" };
      case "Resolved":
        return { icon: CheckCircle, color: "text-green-500" };
      case "In Review":
        return { icon: User, color: "text-blue-500" };
      default:
        return { icon: Clock, color: "text-gray-500" };
    }
  };

  // --- Handler Functions ---

  const handleViewReport = (report: typeof initialReports[0]) => {
    setSelectedReport(report);
    setIsDetailsDialogOpen(true);
  };

  const handleResolveReport = (reportId: number) => {
    // Confirmation dialog
    const isConfirmed = window.confirm("Are you sure you want to mark this report as resolved?");
    if (isConfirmed) {
      // Update the state
      setReports(currentReports =>
        currentReports.map(report =>
          report.id === reportId ? { ...report, status: "Resolved" } : report
        )
      );
      toast.success(`Report #${reportId} has been marked as resolved.`);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Project Reports</h2>
          <p className="text-gray-600 mt-2">
            View and manage community reports about projects
          </p>
        </div>
        {/* 4. Stats cards now use dynamic values */}
        <div className="flex gap-4">
          <Card className="px-6 py-4 border-2 border-red-200 bg-red-50 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-6 w-6 text-red-600" />
              <div>
                <div className="text-2xl font-bold text-red-700">{stats.urgent}</div>
                <div className="text-sm text-red-600 font-medium">Urgent</div>
              </div>
            </div>
          </Card>
          <Card className="px-6 py-4 border-2 border-orange-200 bg-orange-50 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center gap-3">
              <Clock className="h-6 w-6 text-orange-500" />
              <div>
                <div className="text-2xl font-bold text-orange-700">{stats.open}</div>
                <div className="text-sm text-orange-600 font-medium">Open</div>
              </div>
            </div>
          </Card>
          <Card className="px-6 py-4 border-2 border-green-200 bg-green-50 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-6 w-6 text-green-500" />
              <div>
                <div className="text-2xl font-bold text-green-700">{stats.resolved}</div>
                <div className="text-sm text-green-600 font-medium">Resolved</div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <div className="grid gap-6">
        {reports.map((report) => {
          const PriorityIcon = getPriorityIcon(report.priority).icon;
          const priorityColor = getPriorityIcon(report.priority).color;
          const StatusIcon = getStatusIcon(report.status).icon;
          const statusColor = getStatusIcon(report.status).color;
          
          return (
            <Card 
              key={report.id} 
              className="border-2 border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <CardHeader>
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <Badge
                        className={`flex items-center gap-1 ${
                          report.priority === "Urgent"
                            ? "bg-red-100 text-red-700 border-red-200 hover:bg-red-200"
                            : report.priority === "High"
                            ? "bg-orange-100 text-orange-700 border-orange-200 hover:bg-orange-200"
                            : report.priority === "Medium"
                            ? "bg-yellow-100 text-yellow-700 border-yellow-200 hover:bg-yellow-200"
                            : "bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200"
                        }`}
                      >
                        <PriorityIcon className="h-3 w-3" />
                        {report.priority}
                      </Badge>
                      <Badge
                        className={`flex items-center gap-1 ${
                          report.status === "Open"
                            ? "bg-orange-100 text-orange-700 border-orange-200 hover:bg-orange-200"
                            : report.status === "Resolved"
                            ? "bg-green-100 text-green-700 border-green-200 hover:bg-green-200"
                            : "bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200"
                        }`}
                      >
                        <StatusIcon className="h-3 w-3" />
                        {report.status}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl text-gray-900 flex items-center gap-2">
                      {report.issue}
                    </CardTitle>
                    <p className="text-sm text-gray-600 mt-2 font-medium">{report.project}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-all duration-300"
                      onClick={() => handleViewReport(report)}
                    >
                      View Details
                    </Button>
                    {report.status !== "Resolved" && (
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 text-white transition-all duration-300 hover:scale-105"
                        onClick={() => handleResolveReport(report.id)}
                      >
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Resolve
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4 leading-relaxed">{report.description}</p>
                <div className="flex flex-col sm:flex-row justify-between text-sm text-gray-500 gap-2">
                  <span className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    Reported by {report.reporter}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {report.date}
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* 6. The "View Details" Dialog */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="sm:max-w-[600px] bg-white border-2 border-gray-200 rounded-2xl shadow-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-2xl text-gray-900">
              {selectedReport?.issue}
              <Badge 
                className={
                  selectedReport?.priority === "Urgent"
                    ? "bg-red-100 text-red-700 border-red-200"
                    : selectedReport?.priority === "High"
                    ? "bg-orange-100 text-orange-700 border-orange-200"
                    : selectedReport?.priority === "Medium"
                    ? "bg-yellow-100 text-yellow-700 border-yellow-200"
                    : "bg-blue-100 text-blue-700 border-blue-200"
                }
              >
                {selectedReport?.priority}
              </Badge>
            </DialogTitle>
            <DialogDescription asChild>
              <div className="mt-4 space-y-6">
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-lg font-semibold text-gray-900 mb-2">{selectedReport?.project}</p>
                  <p className="text-gray-700 leading-relaxed">{selectedReport?.description}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Flag className="h-5 w-5 text-gray-600" />
                    <div>
                      <span className="text-gray-500">Priority:</span>
                      <span className="font-semibold text-gray-900 ml-2">{selectedReport?.priority}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <User className="h-5 w-5 text-gray-600" />
                    <div>
                      <span className="text-gray-500">Reporter:</span>
                      <span className="font-semibold text-gray-900 ml-2">{selectedReport?.reporter}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Calendar className="h-5 w-5 text-gray-600" />
                    <div>
                      <span className="text-gray-500">Date:</span>
                      <span className="font-semibold text-gray-900 ml-2">{selectedReport?.date}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    
                    <div>
                      <span className="text-gray-500">Status:</span>
                      <span className="font-semibold text-gray-900 ml-2">{selectedReport?.status}</span>
                    </div>
                  </div>
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Reports;