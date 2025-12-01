import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { MapPin, Calendar, Briefcase, TrendingUp, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Project {
  id: number;
  name: string;
  description: string;
  type: string;
  status: string;
  progress: number;
  location: string;
}

interface ViewProjectDialogProps {
  project: Project | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "Completed":
      return "bg-green-100 text-green-700 border-green-200 hover:bg-green-200";
    case "In Progress":
      return "bg-orange-100 text-orange-700 border-orange-200 hover:bg-orange-200";
    case "Planned":
      return "bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200";
    default:
      return "bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200";
  }
};

const getTypeColor = (type: string) => {
  switch (type) {
    case "Water":
      return "bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200";
    case "Health":
      return "bg-red-100 text-red-700 border-red-200 hover:bg-red-200";
    case "Infrastructure":
      return "bg-purple-100 text-purple-700 border-purple-200 hover:bg-purple-200";
    case "Education":
      return "bg-orange-100 text-orange-700 border-orange-200 hover:bg-orange-200";
    case "Agriculture":
      return "bg-green-100 text-green-700 border-green-200 hover:bg-green-200";
    default:
      return "bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200";
  }
};

const getProgressColor = (progress: number) => {
  if (progress >= 80) return "bg-green-500";
  if (progress >= 50) return "bg-orange-500";
  return "bg-blue-500";
};

export const ViewProjectDialog = ({ project, open, onOpenChange }: ViewProjectDialogProps) => {
  if (!project) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] sm:max-w-[650px] max-h-[90vh] overflow-y-auto bg-white border-2 border-gray-200 rounded-2xl shadow-2xl p-0">
        <DialogHeader className="bg-gradient-to-r from-blue-50 to-blue-100 border-b border-gray-200 rounded-t-2xl p-6">
          <div className="flex items-start justify-between">
            <DialogTitle className="text-2xl font-bold text-gray-900 pr-6">
              {project.name}
            </DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
              className="h-8 w-8 rounded-lg hover:bg-white/50 transition-all duration-300 hover:scale-110"
            >
              <X className="h-4 w-4 text-gray-600" />
            </Button>
          </div>
        </DialogHeader>
        
        <div className="space-y-6 p-6">
          {/* Badges */}
          <div className="flex flex-wrap gap-3">
            <Badge className={`${getTypeColor(project.type)} transition-all duration-300 hover:scale-105 px-3 py-1.5 font-medium`} variant="outline">
              <Briefcase className="w-3 h-3 mr-2" />
              {project.type}
            </Badge>
            <Badge className={`${getStatusColor(project.status)} transition-all duration-300 hover:scale-105 px-3 py-1.5 font-medium`} variant="outline">
              {project.status}
            </Badge>
          </div>

          {/* Description */}
          {project.description && (
            <div className="bg-gray-50 rounded-xl p-4 border-2 border-gray-200 transition-all duration-300 hover:shadow-md">
              <h4 className="font-semibold mb-3 text-gray-700 flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                Project Description
              </h4>
              <p className="text-gray-700 leading-relaxed">{project.description}</p>
            </div>
          )}

          {/* Location and Progress */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-gray-50 rounded-xl p-4 border-2 border-gray-200 transition-all duration-300 hover:shadow-md">
              <div className="flex items-center text-gray-600 mb-2">
                <MapPin className="w-5 h-5 mr-3 text-blue-500" />
                <span className="font-medium">Location</span>
              </div>
              <p className="font-semibold text-gray-900 text-lg pl-8">{project.location}</p>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 border-2 border-gray-200 transition-all duration-300 hover:shadow-md">
              <div className="flex items-center text-gray-600 mb-2">
                <TrendingUp className="w-5 h-5 mr-3 text-green-500" />
                <span className="font-medium">Progress</span>
              </div>
              <p className="font-semibold text-gray-900 text-lg pl-8">{project.progress}% Complete</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="bg-gray-50 rounded-xl p-4 border-2 border-gray-200 transition-all duration-300 hover:shadow-md">
            <h4 className="font-semibold mb-4 text-gray-700 flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              Project Progress
            </h4>
            <div className="space-y-3">
              <Progress 
                value={project.progress} 
                className={`h-3 bg-gray-200 ${getProgressColor(project.progress)}`}
              />
              <div className="flex justify-between text-sm text-gray-600 font-medium">
                <span className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Started
                </span>
                <span className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  {project.progress}% Complete
                </span>
                <span className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  {project.status === "Completed" ? "Completed" : "Target"}
                </span>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border-2 border-blue-200 transition-all duration-300 hover:shadow-md">
            <h4 className="font-semibold mb-3 text-gray-700 flex items-center gap-2">
              <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
              Project Timeline
            </h4>
            <div className="space-y-2">
              <div className="flex items-center text-gray-700 bg-white/50 rounded-lg p-3 transition-all duration-300 hover:bg-white">
                <Calendar className="w-4 h-4 mr-3 text-blue-500" />
                <div>
                  <span className="font-medium">Created:</span>
                  <span className="ml-2">{new Date().toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}</span>
                </div>
              </div>
              {project.status === "Completed" && (
                <div className="flex items-center text-green-700 bg-green-50/50 rounded-lg p-3 transition-all duration-300 hover:bg-green-50">
                  <Calendar className="w-4 h-4 mr-3 text-green-500" />
                  <div>
                    <span className="font-medium">Completed:</span>
                    <span className="ml-2">{new Date().toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <Button 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              className="border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 text-gray-700 rounded-xl transition-all duration-300 hover:scale-105"
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};