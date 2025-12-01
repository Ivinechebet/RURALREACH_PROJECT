import { useState, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearch } from "@/contexts/SearchContext";
import { getProjects, addProject, updateProject, deleteProject } from "@/services/api";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Edit, Eye, Trash2, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { AddProjectDialog } from "./AddProjectDialog";
import { ViewProjectDialog } from "./ViewProjectDialog";
import { EditProjectDialog } from "./EditProjectDialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

interface ProjectsTableProps {
  onAddProject?: () => void;
  statusFilter?: string;
  typeFilter?: string;
  showAll?: boolean;
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
    case "Other":
      return "bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200";
    default:
      return "bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200";
  }
};

const getProgressColor = (progress: number) => {
  if (progress >= 80) return "bg-green-500";
  if (progress >= 50) return "bg-orange-500";
  return "bg-blue-500";
};

export const ProjectsTable = ({ onAddProject, statusFilter = "all", typeFilter = "all", showAll = false }: ProjectsTableProps) => {
  const queryClient = useQueryClient();
  const { searchQuery } = useSearch();
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const projectsPerPage = 4;

  const { data: projects = [], isLoading, error } = useQuery({
    queryKey: ["projects", statusFilter, typeFilter],
    queryFn: () => getProjects({ status: statusFilter, type: typeFilter }),
    staleTime: 0,
    refetchInterval: 1000 * 15,
  });

  const filteredProjects = useMemo(() => {
    return projects.filter((project: any) => {
      const matchesSearch = searchQuery === "" ||
        project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.location.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === "all" || project.status === statusFilter;
      const matchesType = typeFilter === "all" || project.type === typeFilter;

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [projects, searchQuery, statusFilter, typeFilter]);

  const indexOfLastProject = currentPage * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;
  const currentProjects = showAll ? filteredProjects : filteredProjects.slice(indexOfFirstProject, indexOfLastProject);
  const totalPages = Math.ceil(filteredProjects.length / projectsPerPage);

  const handleAddProject = async (newProject: any) => {
    try {
      await addProject(newProject);
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast.success("Project added successfully! 🎉");
      setAddDialogOpen(false);
    } catch (error) {
      toast.error("Failed to add project.");
      console.error(error);
    }
  };

  const handleEditProject = async (updatedProject: any) => {
    try {
      await updateProject(updatedProject.id, updatedProject);
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast.success("Project updated successfully! ✅");
      setEditDialogOpen(false);
    } catch (error) {
      toast.error("Failed to update project.");
      console.error(error);
    }
  };

  const handleDeleteProject = async () => {
    if (selectedProject) {
      try {
        await deleteProject(selectedProject.id);
        queryClient.invalidateQueries({ queryKey: ["projects"] });
        toast.success("Project deleted successfully! 🗑️");
        setDeleteDialogOpen(false);
        setSelectedProject(null);
      } catch (error) {
        toast.error("Failed to delete project.");
        console.error(error);
      }
    }
  };

  const handleViewProject = (project: any) => {
    setSelectedProject(project);
    setViewDialogOpen(true);
  };

  const handleEditClick = (project: any) => {
    setSelectedProject(project);
    setEditDialogOpen(true);
  };

  const handleDeleteClick = (project: any) => {
    setSelectedProject(project);
    setDeleteDialogOpen(true);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  if (isLoading) {
    return (
      <Card className="border-2 border-gray-200 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 border-b border-gray-200">
          <CardTitle className="text-gray-900 flex items-center justify-between">
            Recent Projects
            <Button disabled size="sm" className="bg-blue-600 text-white rounded-xl">
              <Plus className="mr-2 h-4 w-4" />
              Add New Project
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {[...Array(projectsPerPage)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4 p-4 border-2 border-gray-200 rounded-xl bg-gray-50">
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-5 w-48 bg-gray-300 rounded-lg" />
                  <Skeleton className="h-4 w-64 bg-gray-300 rounded-lg" />
                </div>
                <Skeleton className="h-7 w-20 bg-gray-300 rounded-full" />
                <Skeleton className="h-7 w-24 bg-gray-300 rounded-full" />
                <Skeleton className="h-3 w-32 bg-gray-300 rounded-full" />
                <Skeleton className="h-9 w-9 bg-gray-300 rounded-lg" />
                <Skeleton className="h-9 w-9 bg-gray-300 rounded-lg" />
                <Skeleton className="h-9 w-9 bg-gray-300 rounded-lg" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center bg-red-50 border-2 border-red-200 rounded-2xl">
        <p className="text-red-700 font-medium">Failed to load projects. Please try again later.</p>
      </div>
    );
  }

  return (
    <>
      {!showAll && (
        <Card className="border-2 border-gray-200 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 border-b border-gray-200">
            <CardTitle className="text-gray-900 flex items-center justify-between">
              Recent Projects
              <Button 
                onClick={() => setAddDialogOpen(true)} 
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add New Project
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent border-b-2 border-gray-200">
                    <TableHead className="font-semibold text-gray-700 text-base">Project Name</TableHead>
                    <TableHead className="font-semibold text-gray-700 text-base">Type</TableHead>
                    <TableHead className="font-semibold text-gray-700 text-base">Status</TableHead>
                    <TableHead className="font-semibold text-gray-700 text-base">Progress</TableHead>
                    <TableHead className="font-semibold text-gray-700 text-base">Location</TableHead>
                    <TableHead className="font-semibold text-gray-700 text-base">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentProjects.map((project: any) => (
                    <TableRow 
                      key={project.id} 
                      className="border-b border-gray-200 hover:bg-blue-50/50 transition-all duration-300 group"
                    >
                      <TableCell>
                        <div className="font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">
                          {project.name}
                        </div>
                        <div className="text-gray-600 text-sm mt-1 line-clamp-2">
                          {project.description}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline" 
                          className={`${getTypeColor(project.type)} transition-all duration-300 hover:scale-105 font-medium px-3 py-1`}
                        >
                          {project.type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline" 
                          className={`${getStatusColor(project.status)} transition-all duration-300 hover:scale-105 font-medium px-3 py-1`}
                        >
                          {project.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Progress 
                            value={project.progress} 
                            className={`w-28 h-3 bg-gray-200 ${getProgressColor(project.progress)}`}
                          />
                          <span className="text-sm font-semibold text-gray-700 min-w-[3ch]">
                            {project.progress}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-700 font-medium">
                        {project.location}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9 border-2 border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300 transition-all duration-300 hover:scale-110 rounded-xl"
                            onClick={() => handleEditClick(project)}
                            title="Edit project"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9 border-2 border-green-200 text-green-600 hover:bg-green-50 hover:border-green-300 transition-all duration-300 hover:scale-110 rounded-xl"
                            onClick={() => handleViewProject(project)}
                            title="View details"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9 border-2 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 transition-all duration-300 hover:scale-110 rounded-xl"
                            onClick={() => handleDeleteClick(project)}
                            title="Delete project"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {!showAll && (
              <div className="flex flex-col sm:flex-row justify-between items-center mt-8 gap-4 pt-4 border-t border-gray-200">
                <p className="text-gray-600 text-sm font-medium">
                  Showing {indexOfFirstProject + 1} to {Math.min(indexOfLastProject, filteredProjects.length)} of {filteredProjects.length} projects
                </p>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1}
                    className="border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 text-gray-700 rounded-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
                  >
                    <ChevronLeft className="h-4 w-4 mr-2" />
                    Previous
                  </Button>
                  <div className="flex items-center px-4 text-sm font-medium text-gray-700 bg-gray-100 rounded-xl">
                    Page {currentPage} of {totalPages}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className="border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 text-gray-700 rounded-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
                  >
                    Next
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {showAll && (
        <>
          <div className="flex justify-end mb-6">
            <Button 
              onClick={() => setAddDialogOpen(true)} 
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add New Project
            </Button>
          </div>
          <div className="overflow-x-auto border-2 border-gray-200 rounded-2xl shadow-lg">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-b-2 border-gray-200 bg-blue-50">
                  <TableHead className="font-semibold text-gray-700 text-base">Project Name</TableHead>
                  <TableHead className="font-semibold text-gray-700 text-base">Type</TableHead>
                  <TableHead className="font-semibold text-gray-700 text-base">Status</TableHead>
                  <TableHead className="font-semibold text-gray-700 text-base">Progress</TableHead>
                  <TableHead className="font-semibold text-gray-700 text-base">Location</TableHead>
                  <TableHead className="font-semibold text-gray-700 text-base">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentProjects.map((project: any) => (
                  <TableRow 
                    key={project.id} 
                    className="border-b border-gray-200 hover:bg-blue-50/50 transition-all duration-300 group"
                  >
                    <TableCell>
                      <div className="font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">
                        {project.name}
                      </div>
                      <div className="text-gray-600 text-sm mt-1 line-clamp-2">
                        {project.description}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline" 
                        className={`${getTypeColor(project.type)} transition-all duration-300 hover:scale-105 font-medium px-3 py-1`}
                      >
                        {project.type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline" 
                        className={`${getStatusColor(project.status)} transition-all duration-300 hover:scale-105 font-medium px-3 py-1`}
                      >
                        {project.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Progress 
                          value={project.progress} 
                          className={`w-28 h-3 bg-gray-200 ${getProgressColor(project.progress)}`}
                        />
                        <span className="text-sm font-semibold text-gray-700 min-w-[3ch]">
                          {project.progress}%
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-700 font-medium">
                      {project.location}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 border-2 border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300 transition-all duration-300 hover:scale-110 rounded-xl"
                          onClick={() => handleEditClick(project)}
                          title="Edit project"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 border-2 border-green-200 text-green-600 hover:bg-green-50 hover:border-green-300 transition-all duration-300 hover:scale-110 rounded-xl"
                          onClick={() => handleViewProject(project)}
                          title="View details"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 border-2 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 transition-all duration-300 hover:scale-110 rounded-xl"
                          onClick={() => handleDeleteClick(project)}
                          title="Delete project"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </>
      )}

      <AddProjectDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        onAdd={handleAddProject}
      />

      <ViewProjectDialog
        project={selectedProject}
        open={viewDialogOpen}
        onOpenChange={setViewDialogOpen}
      />

      <EditProjectDialog
        project={selectedProject}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onEdit={handleEditProject}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-white border-2 border-gray-200 rounded-2xl shadow-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-gray-900 text-xl">Are you sure?</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600 text-base">
              This action cannot be undone. This will permanently delete the project
              <strong className="text-red-600"> {selectedProject?.name}</strong> and remove all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 text-gray-700 rounded-xl transition-all duration-300 hover:scale-105">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteProject} 
              className="bg-red-600 hover:bg-red-700 text-white rounded-xl transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Delete Project
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};