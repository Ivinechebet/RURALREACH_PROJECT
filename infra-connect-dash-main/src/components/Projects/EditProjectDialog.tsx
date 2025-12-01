import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Save, ChevronDown } from "lucide-react";

interface Project {
  id: number;
  name: string;
  description: string;
  type: string;
  status: string;
  progress: number;
  location: string;
}

interface EditProjectDialogProps {
  project: Project | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: (project: Project) => void;
}

export const EditProjectDialog = ({ project, open, onOpenChange, onEdit }: EditProjectDialogProps) => {
  const [formData, setFormData] = useState<Project | null>(null);

  useEffect(() => {
    if (project) {
      setFormData(project);
    }
  }, [project]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData?.name || !formData?.type || !formData?.location) {
      toast.error("Please fill in all required fields");
      return;
    }

    onEdit(formData);
    onOpenChange(false);
    toast.success("Project updated successfully!");
  };

  if (!formData) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Project</DialogTitle>
          <DialogDescription>
            Update the project information below.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Project Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Kusumek Water Project"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Brief description of the project"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Project Type *</Label>
              <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                <SelectTrigger className="border-2 border-gray-300 focus:border-green-500 rounded-xl transition-all duration-300 group">
                  <SelectValue placeholder="Select type" />
                  <ChevronDown className="h-4 w-4 text-gray-500 group-hover:text-green-600 transition-colors" />
                </SelectTrigger>
                <SelectContent className="bg-white border-2 border-gray-200 rounded-xl shadow-2xl p-2">
                  <SelectItem value="Water" className="cursor-pointer transition-all duration-200 hover:bg-blue-50 hover:text-blue-700 rounded-lg m-1 data-[highlighted]:bg-blue-50 data-[highlighted]:text-blue-700">
                    Water
                  </SelectItem>
                  <SelectItem value="Health" className="cursor-pointer transition-all duration-200 hover:bg-red-50 hover:text-red-700 rounded-lg m-1 data-[highlighted]:bg-red-50 data-[highlighted]:text-red-700">
                    Health
                  </SelectItem>
                  <SelectItem value="Infrastructure" className="cursor-pointer transition-all duration-200 hover:bg-orange-50 hover:text-orange-700 rounded-lg m-1 data-[highlighted]:bg-orange-50 data-[highlighted]:text-orange-700">
                    Infrastructure
                  </SelectItem>
                  <SelectItem value="Education" className="cursor-pointer transition-all duration-200 hover:bg-purple-50 hover:text-purple-700 rounded-lg m-1 data-[highlighted]:bg-purple-50 data-[highlighted]:text-purple-700">
                    Education
                  </SelectItem>
                  <SelectItem value="Agriculture" className="cursor-pointer transition-all duration-200 hover:bg-green-50 hover:text-green-700 rounded-lg m-1 data-[highlighted]:bg-green-50 data-[highlighted]:text-green-700">
                    Agriculture
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                <SelectTrigger className="border-2 border-gray-300 focus:border-green-500 rounded-xl transition-all duration-300 group">
                  <SelectValue />
                  <ChevronDown className="h-4 w-4 text-gray-500 group-hover:text-green-600 transition-colors" />
                </SelectTrigger>
                <SelectContent className="bg-white border-2 border-gray-200 rounded-xl shadow-2xl p-2">
                  <SelectItem value="Planned" className="cursor-pointer transition-all duration-200 hover:bg-blue-50 hover:text-blue-700 rounded-lg m-1 data-[highlighted]:bg-blue-50 data-[highlighted]:text-blue-700">
                    Planned
                  </SelectItem>
                  <SelectItem value="In Progress" className="cursor-pointer transition-all duration-200 hover:bg-orange-50 hover:text-orange-700 rounded-lg m-1 data-[highlighted]:bg-orange-50 data-[highlighted]:text-orange-700">
                    In Progress
                  </SelectItem>
                  <SelectItem value="Completed" className="cursor-pointer transition-all duration-200 hover:bg-green-50 hover:text-green-700 rounded-lg m-1 data-[highlighted]:bg-green-50 data-[highlighted]:text-green-700">
                    Completed
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g., Kusumek Village"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="progress">Progress (%)</Label>
              <Input
                id="progress"
                type="number"
                min="0"
                max="100"
                value={formData.progress}
                onChange={(e) => setFormData({ ...formData, progress: parseInt(e.target.value) || 0 })}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              className="border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 text-gray-700 rounded-xl transition-all duration-300 hover:scale-105"
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white rounded-xl transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};