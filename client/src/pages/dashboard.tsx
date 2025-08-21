import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";
import { isUnauthorizedError } from "@/lib/authUtils";
import Header from "@/components/layout/header";
import MobileNav from "@/components/layout/mobile-nav";
import StatsOverview from "@/components/stats/stats-overview";
import CourseGroup from "@/components/course/course-group";
import { Button } from "@/components/ui/button";
import { GraduationCap } from "lucide-react";

export default function Dashboard() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  const { data: courseGroups, isLoading: coursesLoading, error } = useQuery({
    queryKey: ["/api/dashboard/courses"],
    enabled: isAuthenticated,
  });

  const { data: userStats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/user/stats"],
    enabled: isAuthenticated,
  });

  // Handle error
  useEffect(() => {
    if (error && isUnauthorizedError(error as Error)) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
    }
  }, [error, toast]);

  if (isLoading || !isAuthenticated) {
    return null;
  }

  const handleContinueLearning = () => {
    // Find the most recent enrollment with progress > 0 and < 100
    if (courseGroups) {
      for (const group of courseGroups) {
        for (const course of group.courses) {
          if (course.enrollment && 
              parseFloat(course.enrollment.progress) > 0 && 
              parseFloat(course.enrollment.progress) < 100) {
            window.location.href = `/course/${course.id}`;
            return;
          }
        }
      }
    }
    
    toast({
      title: "No courses in progress",
      description: "Enroll in a course to start learning!",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 md:pb-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-textPrimary mb-2">
            Welcome back!
          </h1>
          <p className="text-textSecondary">Continue your learning journey and track your progress</p>
        </div>

        {/* Stats Overview */}
        <StatsOverview stats={userStats} isLoading={statsLoading} />

        {/* Course Groups */}
        <div className="space-y-8 mb-8">
          {coursesLoading ? (
            <div className="space-y-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                  <div className="animate-pulse">
                    <div className="h-6 bg-slate-200 rounded w-1/4 mb-4"></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                      {[1, 2, 3, 4, 5].map((j) => (
                        <div key={j} className="bg-slate-50-custom rounded-lg p-4">
                          <div className="h-32 bg-slate-200-custom rounded-lg mb-3"></div>
                          <div className="h-4 bg-slate-200-custom rounded mb-2"></div>
                          <div className="h-3 bg-slate-200-custom rounded mb-2"></div>
                          <div className="h-2 bg-slate-200-custom rounded"></div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : courseGroups?.length ? (
            courseGroups.map((group) => (
              <CourseGroup key={group.id} group={group} />
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-textSecondary">No course groups available</p>
            </div>
          )}
        </div>

        {/* Continue Learning Section */}
        <div className="bg-gradient-to-r from-primary to-accent rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold mb-2">Continue Learning</h2>
              <p className="text-blue-200-custom mb-4">Pick up where you left off and maintain your learning streak</p>
              <Button 
                onClick={handleContinueLearning}
                className="bg-white text-primary hover:bg-gray-100"
              >
                Resume Course
              </Button>
            </div>
            <div className="hidden md:block">
              <GraduationCap className="h-16 w-16 text-blue-200-custom" />
            </div>
          </div>
        </div>
      </main>

      <MobileNav />
    </div>
  );
}
