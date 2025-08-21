import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { GraduationCap, Bell, ChevronDown } from "lucide-react";
import { Link } from "wouter";

export default function Header() {
  const { user } = useAuth();

  return (
    <header className="bg-white shadow-sm border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Navigation */}
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <GraduationCap className="text-white h-5 w-5" />
              </div>
              <span className="text-xl font-semibold text-textPrimary">EduPath</span>
            </Link>
            <nav className="hidden md:flex space-x-6">
              <Link href="/" className="text-primary font-medium border-b-2 border-primary pb-4">
                Dashboard
              </Link>
              <a href="#" className="text-textSecondary hover:text-textPrimary transition-colors pb-4">
                My Courses
              </a>
              <a href="#" className="text-textSecondary hover:text-textPrimary transition-colors pb-4">
                Progress
              </a>
              <a href="#" className="text-textSecondary hover:text-textPrimary transition-colors pb-4">
                Calendar
              </a>
            </nav>
          </div>
          
          {/* User Profile */}
          <div className="flex items-center space-x-4">
            <div className="hidden sm:block">
              <div className="flex items-center space-x-3">
                <Bell className="h-5 w-5 text-textSecondary hover:text-textPrimary cursor-pointer" />
                <div className="flex items-center space-x-2">
                  {user?.profileImageUrl ? (
                    <img 
                      src={user.profileImageUrl} 
                      alt="Profile" 
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                      <span className="text-white text-sm font-medium">
                        {user?.firstName?.[0] || user?.email?.[0]?.toUpperCase() || "U"}
                      </span>
                    </div>
                  )}
                  <span className="text-sm font-medium text-textPrimary">
                    {user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : user?.email || 'User'}
                  </span>
                  <ChevronDown className="h-3 w-3 text-textSecondary" />
                </div>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => window.location.href = '/api/logout'}
              className="text-textSecondary hover:text-textPrimary"
            >
              Logout
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
