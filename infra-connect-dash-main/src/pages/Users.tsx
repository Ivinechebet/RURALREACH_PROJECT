import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { UserPlus, Mail, Phone, MapPin, Trash2, Edit, MoreVertical, Save, X } from "lucide-react";
import { toast } from "sonner";

// 1. Import new components and the search context
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSearch } from "@/contexts/SearchContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Initial static data - this will be loaded into state
const initialUsers = [
  {
    id: 1,
    name: "Admin User",
    email: "admin@ruralreach.com",
    phone: "+254 700 000 001",
    location: "Nairobi Headquarters",
    role: "Administrator",
    status: "Active",
    lastLogin: "2023-11-15 14:30",
    reports: 0,
    ratings: 0,
  },
  {
    id: 2,
    name: "Project Manager",
    email: "manager@ruralreach.com",
    phone: "+254 700 000 002",
    location: "Mauche Ward",
    role: "Manager",
    status: "Active",
    lastLogin: "2023-11-14 09:15",
    reports: 0,
    ratings: 0,
  },
  {
    id: 3,
    name: "Data Analyst",
    email: "analyst@ruralreach.com",
    phone: "+254 700 000 003",
    location: "Nairobi Office",
    role: "Analyst",
    status: "Active",
    lastLogin: "2023-11-13 16:45",
    reports: 0,
    ratings: 0,
  },
  {
    id: 4,
    name: "Field Officer",
    email: "field@ruralreach.com",
    phone: "+254 700 000 004",
    location: "Tachasis Village",
    role: "Officer",
    status: "Inactive",
    lastLogin: "2023-10-28 11:20",
    reports: 0,
    ratings: 0,
  },
  {
    id: 5,
    name: "Sarah Johnson",
    email: "sarah.johnson@ruralreach.com",
    phone: "+254 700 000 005",
    location: "Kusumek Area",
    role: "Field Officer",
    status: "Active",
    lastLogin: "2023-11-14 08:30",
    reports: 12,
    ratings: 8,
  },
  {
    id: 6,
    name: "Michael Chen",
    email: "michael.chen@ruralreach.com",
    phone: "+254 700 000 006",
    location: "Bombo Section",
    role: "Project Manager",
    status: "Active",
    lastLogin: "2023-11-15 10:15",
    reports: 8,
    ratings: 15,
  },
  {
    id: 7,
    name: "Grace Wambui",
    email: "grace.wambui@ruralreach.com",
    phone: "+254 700 000 007",
    location: "Olenguruone Zone",
    role: "Field Officer",
    status: "Active",
    lastLogin: "2023-11-13 14:20",
    reports: 15,
    ratings: 12,
  },
  {
    id: 8,
    name: "Robert Kamau",
    email: "robert.kamau@ruralreach.com",
    phone: "+254 700 000 008",
    location: "Mauche Center",
    role: "Inspector",
    status: "Active",
    lastLogin: "2023-11-12 11:45",
    reports: 20,
    ratings: 18,
  },
  {
    id: 9,
    name: "Lisa Wangari",
    email: "lisa.wangari@ruralreach.com",
    phone: "+254 700 000 009",
    location: "Taita Region",
    role: "Data Analyst",
    status: "Active",
    lastLogin: "2023-11-15 09:00",
    reports: 5,
    ratings: 3,
  },
  {
    id: 10,
    name: "David Ochieng",
    email: "david.ochieng@ruralreach.com",
    phone: "+254 700 000 010",
    location: "Kusumek Village",
    role: "Field Officer",
    status: "Inactive",
    lastLogin: "2023-10-25 16:30",
    reports: 7,
    ratings: 6,
  },
];

const Users = () => {
  // 2. State for managing the user list
  const [users, setUsers] = useState(initialUsers);
  
  // 3. State for controlling the "Add User" dialog
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);

  // 4. State for the new user form
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    role: "Field Officer",
  });

  // 5. State for editing users
  const [editingUser, setEditingUser] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);

  // 6. Get the search query from our context
  const { searchQuery } = useSearch();

  // 7. Memoize the filtered users to avoid re-calculating on every render
  const filteredUsers = useMemo(() => {
    if (!searchQuery) return users;
    return users.filter(
      (user) =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.role.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [users, searchQuery]);

  // --- Handler Functions ---

  const handleAddUser = () => {
    // Basic validation
    if (!newUser.name || !newUser.email) {
      toast.error("Name and Email are required.");
      return;
    }

    const userToAdd = {
      ...newUser,
      id: Date.now(), // Simple unique ID
      status: "Active",
      lastLogin: new Date().toISOString().split('T')[0] + " " + new Date().toLocaleTimeString('en-US', {hour12: false}).slice(0, 5),
      reports: 0,
      ratings: 0,
    };

    setUsers([...users, userToAdd]);
    toast.success(`User "${userToAdd.name}" added successfully!`);
    
    // Reset form and close dialog
    setNewUser({ name: "", email: "", phone: "", location: "", role: "Field Officer" });
    setIsAddUserOpen(false);
  };

  const handleDeleteUser = (userId: number, userName: string) => {
    // Confirmation dialog
    const isConfirmed = window.confirm(`Are you sure you want to delete ${userName}?`);
    if (isConfirmed) {
      setUsers(users.filter((user) => user.id !== userId));
      toast.success(`User "${userName}" deleted.`);
    }
  };

  const handleEditUser = (user: any) => {
    setEditingUser({ ...user });
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    if (!editingUser.name || !editingUser.email) {
      toast.error("Name and Email are required.");
      return;
    }

    setUsers(users.map(user => 
      user.id === editingUser.id ? editingUser : user
    ));
    toast.success(`User "${editingUser.name}" updated successfully!`);
    setIsEditing(false);
    setEditingUser(null);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditingUser(null);
  };

  const handleToggleStatus = (userId: number, userName: string, currentStatus: string) => {
    const newStatus = currentStatus === "Active" ? "Inactive" : "Active";
    setUsers(users.map(user => 
      user.id === userId ? { ...user, status: newStatus } : user
    ));
    toast.success(`${userName} status changed to ${newStatus}`);
  };

  const handleInputChange = (field: string, value: string) => {
    setEditingUser({
      ...editingUser,
      [field]: value
    });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">User Management</h2>
          <p className="text-gray-600 mt-2">
            Manage system users and administrators
          </p>
        </div>
        {/* Add User Dialog */}
        <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
          <DialogTrigger asChild>
            <Button className="bg-green-600 hover:bg-green-700 transition-all duration-300 hover:scale-105">
              <UserPlus className="mr-2 h-4 w-4" />
              Add New User
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] bg-white border-2 border-gray-200 rounded-2xl shadow-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl text-gray-900">Add New User</DialogTitle>
              <DialogDescription className="text-gray-600">
                Create a new user account. Click save when you're done.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right text-gray-700 font-medium">
                  Name
                </Label>
                <Input
                  id="name"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  className="col-span-3 border-2 border-gray-300 focus:border-green-500 rounded-xl transition-all duration-300"
                  placeholder="Enter full name"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right text-gray-700 font-medium">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  className="col-span-3 border-2 border-gray-300 focus:border-green-500 rounded-xl transition-all duration-300"
                  placeholder="Enter email address"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="phone" className="text-right text-gray-700 font-medium">
                  Phone
                </Label>
                <Input
                  id="phone"
                  value={newUser.phone}
                  onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                  className="col-span-3 border-2 border-gray-300 focus:border-green-500 rounded-xl transition-all duration-300"
                  placeholder="Enter phone number"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="location" className="text-right text-gray-700 font-medium">
                  Location
                </Label>
                <Input
                  id="location"
                  value={newUser.location}
                  onChange={(e) => setNewUser({ ...newUser, location: e.target.value })}
                  className="col-span-3 border-2 border-gray-300 focus:border-green-500 rounded-xl transition-all duration-300"
                  placeholder="Enter location"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="role" className="text-right text-gray-700 font-medium">
                  Role
                </Label>
                <select
                  id="role"
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                  className="col-span-3 border-2 border-gray-300 focus:border-green-500 rounded-xl px-3 py-2 transition-all duration-300 bg-white"
                >
                  <option value="Field Officer">Field Officer</option>
                  <option value="Project Manager">Project Manager</option>
                  <option value="Administrator">Administrator</option>
                  <option value="Data Analyst">Data Analyst</option>
                  <option value="Inspector">Inspector</option>
                </select>
              </div>
            </div>
            <DialogFooter>
              <Button 
                type="submit" 
                onClick={handleAddUser} 
                className="bg-green-600 hover:bg-green-700 transition-all duration-300 hover:scale-105"
              >
                Save User
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-2 border-blue-200 bg-blue-50 hover:shadow-lg transition-all duration-300 hover:scale-105">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-700">{users.length}</div>
              <div className="text-sm text-blue-600 font-medium mt-1">Total Users</div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-2 border-green-200 bg-green-50 hover:shadow-lg transition-all duration-300 hover:scale-105">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-700">{users.filter(u => u.role === 'Field Officer').length}</div>
              <div className="text-sm text-green-600 font-medium mt-1">Field Officers</div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-2 border-orange-200 bg-orange-50 hover:shadow-lg transition-all duration-300 hover:scale-105">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-700">{users.filter(u => u.role === 'Project Manager').length}</div>
              <div className="text-sm text-orange-600 font-medium mt-1">Project Managers</div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-2 border-purple-200 bg-purple-50 hover:shadow-lg transition-all duration-300 hover:scale-105">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-700">{users.filter(u => u.status === 'Active').length}</div>
              <div className="text-sm text-purple-600 font-medium mt-1">Active Users</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Users Table */}
      <Card className="border-2 border-gray-200 shadow-lg">
        <CardHeader className="bg-gray-50 border-b border-gray-200">
          <CardTitle className="text-gray-900">User Management</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 border-b border-gray-200">
                <tr>
                  <th className="text-left p-4 font-semibold text-gray-700">Name</th>
                  <th className="text-left p-4 font-semibold text-gray-700">Email</th>
                  <th className="text-left p-4 font-semibold text-gray-700">Role</th>
                  <th className="text-left p-4 font-semibold text-gray-700">Status</th>
                  <th className="text-left p-4 font-semibold text-gray-700">Last Login</th>
                  <th className="text-left p-4 font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                    <td className="p-4">
                      {isEditing && editingUser?.id === user.id ? (
                        <Input
                          value={editingUser.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          className="border-2 border-blue-300 focus:border-blue-500 rounded-lg transition-all duration-300"
                        />
                      ) : (
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8 border-2 border-gray-300">
                            <AvatarFallback className="bg-blue-100 text-blue-700 text-sm font-medium">
                              {user.name.split(" ").map((n) => n[0]).join("")}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium text-gray-900">{user.name}</span>
                        </div>
                      )}
                    </td>
                    <td className="p-4">
                      {isEditing && editingUser?.id === user.id ? (
                        <Input
                          value={editingUser.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          className="border-2 border-blue-300 focus:border-blue-500 rounded-lg transition-all duration-300"
                        />
                      ) : (
                        <span className="text-gray-700">{user.email}</span>
                      )}
                    </td>
                    <td className="p-4">
                      {isEditing && editingUser?.id === user.id ? (
                        <select
                          value={editingUser.role}
                          onChange={(e) => handleInputChange('role', e.target.value)}
                          className="border-2 border-blue-300 focus:border-blue-500 rounded-lg px-2 py-1 transition-all duration-300 bg-white w-full"
                        >
                          <option value="Field Officer">Field Officer</option>
                          <option value="Project Manager">Project Manager</option>
                          <option value="Administrator">Administrator</option>
                          <option value="Data Analyst">Data Analyst</option>
                          <option value="Inspector">Inspector</option>
                        </select>
                      ) : (
                        <Badge 
                          variant="secondary"
                          className={
                            user.role === 'Administrator' ? 'bg-purple-100 text-purple-700 border-purple-200' :
                            user.role === 'Project Manager' ? 'bg-orange-100 text-orange-700 border-orange-200' :
                            user.role === 'Field Officer' ? 'bg-green-100 text-green-700 border-green-200' :
                            user.role === 'Data Analyst' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                            'bg-gray-100 text-gray-700 border-gray-200'
                          }
                        >
                          {user.role}
                        </Badge>
                      )}
                    </td>
                    <td className="p-4">
                      {isEditing && editingUser?.id === user.id ? (
                        <select
                          value={editingUser.status}
                          onChange={(e) => handleInputChange('status', e.target.value)}
                          className="border-2 border-blue-300 focus:border-blue-500 rounded-lg px-2 py-1 transition-all duration-300 bg-white w-full"
                        >
                          <option value="Active">Active</option>
                          <option value="Inactive">Inactive</option>
                        </select>
                      ) : (
                        <Badge 
                          className={
                            user.status === 'Active' 
                              ? 'bg-green-100 text-green-700 border-green-200' 
                              : 'bg-red-100 text-red-700 border-red-200'
                          }
                        >
                          {user.status}
                        </Badge>
                      )}
                    </td>
                    <td className="p-4 text-gray-600 text-sm">{user.lastLogin}</td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        {isEditing && editingUser?.id === user.id ? (
                          <>
                            <Button
                              size="sm"
                              className="bg-green-600 hover:bg-green-700 transition-all duration-300 hover:scale-105"
                              onClick={handleSaveEdit}
                            >
                              <Save className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-gray-300 hover:bg-gray-100 transition-all duration-300 hover:scale-105"
                              onClick={handleCancelEdit}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-blue-300 hover:bg-blue-50 text-blue-600 transition-all duration-300 hover:scale-105"
                              onClick={() => handleEditUser(user)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="border-gray-300 hover:bg-gray-100 transition-all duration-300 hover:scale-105 group"
                                >
                                  <MoreVertical className="h-4 w-4 group-hover:text-blue-600 transition-colors" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent 
                                align="end" 
                                className="bg-white border-2 border-gray-200 rounded-xl shadow-2xl p-2 min-w-[160px]"
                              >
                                <DropdownMenuItem 
                                  onClick={() => handleToggleStatus(user.id, user.name, user.status)}
                                  className="flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-all duration-200 hover:bg-green-50 hover:text-green-700 group"
                                >
                                  <div className={`w-2 h-2 rounded-full ${user.status === 'Active' ? 'bg-red-500' : 'bg-green-500'} transition-colors`} />
                                  <span className="font-medium">
                                    {user.status === 'Active' ? 'Deactivate' : 'Activate'}
                                  </span>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator className="bg-gray-200 my-1" />
                                <DropdownMenuItem 
                                  onClick={() => handleDeleteUser(user.id, user.name)}
                                  className="flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-all duration-200 hover:bg-red-50 hover:text-red-700 text-red-600 group"
                                >
                                  <Trash2 className="h-4 w-4 transition-colors" />
                                  <span className="font-medium">Delete User</span>
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          <div className="flex flex-col sm:flex-row items-center justify-between p-4 border-t border-gray-200 bg-gray-50 gap-4">
            <div className="text-sm text-gray-600">
              Showing {filteredUsers.length} of {users.length} users
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="border-gray-300 hover:bg-gray-100 transition-all duration-300">
                Previous
              </Button>
              <Button variant="outline" size="sm" className="border-gray-300 hover:bg-gray-100 transition-all duration-300">
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Users;