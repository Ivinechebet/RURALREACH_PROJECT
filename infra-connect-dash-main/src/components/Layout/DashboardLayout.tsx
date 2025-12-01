import { ReactNode, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSearch } from "@/contexts/SearchContext";
import {
  LayoutDashboard,
  FolderKanban,
  Flag,
  Star,
  Users,
  Settings,
  Bell,
  Search,
  Facebook,
  Linkedin,
  MessageCircle,
  ChevronDown,
  LogOut,
  User,
  Mail,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import dashboardBg from "@/assets/dashboard-bg.jpg";
import { EnhancedSearch } from "../ui/enhanced_search";

interface DashboardLayoutProps {
  children: ReactNode;
}

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Projects", href: "/projects", icon: FolderKanban },
  { name: "Reports", href: "/reports", icon: Flag },
  { name: "Ratings", href: "/ratings", icon: Star },
  { name: "Users", href: "/users", icon: Users },
  { name: "Settings", href: "/settings", icon: Settings },
];

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const location = useLocation();
  const { searchQuery, setSearchQuery } = useSearch();
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const notifications = [
    { id: 1, title: "New project submitted", time: "2 hours ago", unread: true },
    { id: 2, title: "Project status updated", time: "5 hours ago", unread: true },
    { id: 3, title: "New rating received", time: "1 day ago", unread: true },
  ];

  // Consistent color theme for white background
  const theme = {
    primary: "bg-gradient-to-r from-blue-600 to-purple-600",
    primaryHover: "hover:from-blue-700 hover:to-purple-700",
    secondary: "bg-gradient-to-r from-gray-100 to-gray-200",
    secondaryHover: "hover:from-gray-200 hover:to-gray-300",
    accent: "bg-gradient-to-r from-green-500 to-emerald-600",
    accentHover: "hover:from-green-600 hover:to-emerald-700",
  };

  return (
    <div className="flex h-screen bg-white relative overflow-hidden">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-white to-purple-50/50" />
      
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />

      {/* Sidebar with clean white styling */}
      <div className="hidden md:flex w-72 bg-white/95 backdrop-blur-xl shadow-2xl flex-col relative z-10 border-r border-gray-200 transition-all duration-500 ease-out">
        <div className={`p-6 border-b border-gray-200 ${theme.primary} bg-gradient-to-r from-blue-600 to-purple-600`}>
          <div className="flex items-center gap-3 transition-all duration-300 hover:scale-105">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center shadow-2xl backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:rotate-12">
              <LayoutDashboard className="text-white w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">RuralReach</h1>
              <p className="text-blue-100 text-sm mt-1 font-medium">Administrative Dashboard</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 mt-8 px-4 space-y-2">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "group flex items-center px-4 py-3 text-sm font-semibold rounded-2xl transition-all duration-300 ease-out transform hover:scale-105 hover:shadow-xl border-2",
                  isActive
                    ? `${theme.primary} text-white shadow-xl scale-105 border-white/20`
                    : "text-gray-600 hover:text-gray-900 bg-white hover:bg-gray-50 border-transparent hover:border-gray-200"
                )}
              >
                <Icon className={cn(
                  "mr-3 h-5 w-5 transition-all duration-300",
                  isActive ? "scale-110 rotate-12" : "group-hover:scale-110 group-hover:rotate-12"
                )} />
                {item.name}
                {isActive && (
                  <div className="ml-auto w-2 h-2 bg-white rounded-full animate-ping" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Profile Section */}
        <div className="p-4 border-t border-gray-200 bg-gray-50/80 backdrop-blur-sm mt-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-white hover:bg-gray-50 border-2 border-transparent hover:border-gray-300 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl group">
                <div className={`w-12 h-12 rounded-xl ${theme.primary} flex items-center justify-center text-white font-bold shadow-xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-12`}>
                  A
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">Admin User</p>
                  <p className="text-xs text-gray-500 group-hover:text-gray-700 truncate transition-colors">Administrator</p>
                </div>
                <ChevronDown className="h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-all duration-300 group-hover:rotate-180" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-white/95 backdrop-blur-2xl border-gray-200 shadow-2xl rounded-2xl p-2">
              <DropdownMenuItem className="flex items-center gap-3 p-3 rounded-xl text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-all duration-200 cursor-pointer">
                <User className="h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center gap-3 p-3 rounded-xl text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-all duration-200 cursor-pointer">
                <Mail className="h-4 w-4" />
                <span>Messages</span>
                <Badge className="ml-auto bg-red-500 hover:bg-red-600 text-white">3</Badge>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-gray-200" />
              <DropdownMenuItem className="flex items-center gap-3 p-3 rounded-xl text-red-600 hover:text-red-700 hover:bg-red-50 transition-all duration-200 cursor-pointer">
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto flex flex-col relative z-10">
        {/* Enhanced Header */}
        <header className="bg-white/95 backdrop-blur-xl shadow-lg py-4 px-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-200 transition-all duration-500">
          <div className="flex-1 min-w-0 space-y-2">
            <h2 className="text-2xl font-bold text-gray-900 transition-all duration-300 hover:scale-105">
              Dashboard Overview
            </h2>
            <p className="text-gray-600 text-sm font-medium transition-colors duration-300 hover:text-gray-900">
              Welcome back, Admin! Here's what's happening today.
            </p>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            {/* Notifications */}
            <Popover open={notificationsOpen} onOpenChange={setNotificationsOpen}>
              <PopoverTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="relative rounded-xl bg-white hover:bg-gray-50 border-2 border-gray-200 hover:border-gray-300 transition-all duration-300 hover:scale-110 hover:shadow-xl group"
                >
                  <Bell className="h-5 w-5 text-gray-600 group-hover:text-gray-900 transition-all duration-300 group-hover:scale-110" />
                  <Badge
                    variant="destructive"
                    className="absolute -top-2 -right-2 h-6 w-6 p-0 flex items-center justify-center text-xs bg-red-500 hover:bg-red-600 text-white transition-all duration-300 hover:scale-125 shadow-lg"
                  >
                    {notifications.filter(n => n.unread).length}
                  </Badge>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-96 bg-white/95 backdrop-blur-2xl border-gray-200 shadow-2xl rounded-2xl p-4 transition-all duration-300">
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                    <h3 className="font-bold text-lg text-gray-900">
                      Notifications
                    </h3>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all duration-300 hover:scale-105"
                    >
                      Mark all as read
                    </Button>
                  </div>
                  <div className="space-y-3 max-h-80 overflow-y-auto">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={cn(
                          "p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg group",
                          notification.unread 
                            ? "bg-blue-50 border-blue-200 shadow-lg" 
                            : "bg-white border-gray-200"
                        )}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <p className="text-sm font-semibold text-gray-900 flex-1 group-hover:text-blue-600 transition-colors">
                            {notification.title}
                          </p>
                          {notification.unread && (
                            <div className="w-3 h-3 rounded-full bg-blue-500 mt-1 animate-pulse transition-all duration-300 group-hover:scale-150" />
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mt-2 group-hover:text-gray-700 transition-colors">
                          {notification.time}
                        </p>
                      </div>
                    ))}
                  </div>
                  <Button 
                    className={`w-full rounded-xl ${theme.primary} hover:shadow-xl transition-all duration-300 hover:scale-105 text-white font-semibold border-2 border-transparent hover:border-white/20`}
                    size="sm"
                  >
                    View all notifications
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
            
            {/* Search Bar */}
            <EnhancedSearch/>
          </div>
        </header>

        {/* Enhanced Main Content */}
        <main className="flex-1 p-6 transition-all duration-500">
          <div className="rounded-3xl bg-white border-2 border-gray-200 shadow-xl transition-all duration-500 hover:shadow-2xl overflow-hidden">
            {children}
          </div>
        </main>

        {/* Enhanced Footer */}
        <footer className="p-6 border-t border-gray-200 bg-white/95 backdrop-blur-xl transition-all duration-500">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-4">
              <p className="text-gray-600 text-sm font-medium transition-colors duration-300 hover:text-gray-900 hover:scale-105">
                © 2025 RuralReach. All rights reserved.
              </p>
              <div className="flex gap-2">
                <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-200 transition-all duration-300 hover:scale-105 cursor-pointer">
                  v2.1.0
                </Badge>
                <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-200 transition-all duration-300 hover:scale-105 cursor-pointer">
                  Active
                </Badge>
              </div>
            </div>
            
            <div className="flex gap-4">
              {/* Social Icons */}
              {[
                { 
                  icon: (props: any) => (
                    <svg {...props} viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  ), 
                  href: "https://x.com/YourOfficialXHandle",
                  color: "hover:text-gray-900"
                },
                { 
                  icon: Facebook, 
                  href: "https://facebook.com/YourOfficialPageName",
                  color: "hover:text-[#1877F2]" 
                },
                { 
                  icon: Linkedin, 
                  href: "https://linkedin.com/company/your-official-page",
                  color: "hover:text-[#0077B5]" 
                },
                { 
                  icon: MessageCircle, 
                  href: "https://wa.me/254790162587",
                  color: "hover:text-[#25D366]" 
                },
              ].map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-gray-400 border-2 border-gray-200 transition-all duration-300 hover:scale-110 hover:shadow-xl hover:border-gray-300 group"
                  aria-label={social.icon.name || "Social"}
                >
                  <social.icon className={`h-5 w-5 transition-all duration-300 group-hover:scale-110 ${social.color}`} />
                </a>
              ))}
              
              {/* Support Button */}
              <Button 
                className={`rounded-xl ${theme.accent} hover:shadow-xl transition-all duration-300 hover:scale-105 text-white font-semibold border-2 border-transparent hover:border-white/20`}
                size="sm"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Support
              </Button>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};