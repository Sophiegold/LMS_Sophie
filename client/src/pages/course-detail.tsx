import { useParams } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest, queryClient } from "@/lib/queryClient";
import Header from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Clock, BookOpen, Award } from "lucide-react";

export default function CourseDetail() {
  const { id } = useParams();
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

  const { data: course, isLoading: courseLoading, error } = useQuery({
    queryKey: ["/api/courses", id],
    enabled: isAuthenticated && !!id,
  });

  const { data: enrollment, isLoading: enrollmentLoading } = useQuery({
    queryKey: ["/api/user/enrollment", id],
    enabled: isAuthenticated && !!id,
  });

  const enrollMutation = useMutation({
    mutationFn: async (courseId: string) => {
      await apiRequest("POST", "/api/enrollments", { courseId });
    },
    onSuccess: () => {
      toast({
        title: "Enrolled successfully",
        description: "You can now start learning this course!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/user/enrollment", id] });
      queryClient.invalidateQueries({ queryKey: ["/api/user/stats"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/courses"] });
    },
    onError: (error) => {
      if (isUnauthorizedError(error as Error)) {
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
      
      toast({
        title: "Enrollment failed",
        description: (error as Error).message || "Failed to enroll in course",
        variant: "destructive",
      });
    },
  });

  const updateProgressMutation = useMutation({
    mutationFn: async ({ courseId, progress }: { courseId: string; progress: number }) => {
      await apiRequest("PATCH", `/api/enrollments/${courseId}/progress`, { progress });
    },
    onSuccess: () => {
      toast({
        title: "Progress updated",
        description: "Your progress has been saved!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/user/enrollment", id] });
      queryClient.invalidateQueries({ queryKey: ["/api/user/stats"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/courses"] });
    },
    onError: (error) => {
      if (isUnauthorizedError(error as Error)) {
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
      
      toast({
        title: "Failed to update progress",
        description: (error as Error).message || "Could not save your progress",
        variant: "destructive",
      });
    },
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

  const handleEnroll = () => {
    if (course?.id) {
      enrollMutation.mutate(course.id);
    }
  };

  const handleProgressUpdate = (newProgress: number) => {
    if (course?.id) {
      updateProgressMutation.mutate({ courseId: course.id, progress: newProgress });
    }
  };

  const currentProgress = enrollment ? parseFloat(enrollment.progress) : 0;
  const isCompleted = enrollment?.isCompleted || false;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={() => window.history.back()}
          className="mb-6 text-textSecondary hover:text-textPrimary"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>

        {courseLoading ? (
          <div className="space-y-6">
            <div className="animate-pulse">
              <div className="h-64 bg-slate-200-custom rounded-lg mb-6"></div>
              <div className="h-8 bg-slate-200-custom rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-slate-200-custom rounded w-full mb-2"></div>
              <div className="h-4 bg-slate-200-custom rounded w-2/3"></div>
            </div>
          </div>
        ) : course ? (
          <div className="space-y-6">
            {/* Course Header */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              {course.thumbnailUrl && (
                <img 
                  src={course.thumbnailUrl} 
                  alt={course.title}
                  className="w-full h-64 object-cover"
                />
              )}
              <div className="p-6">
                <h1 className="text-3xl font-bold text-textPrimary mb-2">{course.title}</h1>
                {course.description && (
                  <p className="text-textSecondary mb-4">{course.description}</p>
                )}
                
                <div className="flex items-center space-x-6 text-sm text-textSecondary mb-6">
                  {course.duration && (
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{course.duration}</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-1">
                    <BookOpen className="h-4 w-4" />
                    <span>Interactive Lessons</span>
                  </div>
                  {isCompleted && (
                    <div className="flex items-center space-x-1 text-secondary">
                      <Award className="h-4 w-4" />
                      <span>Certificate Earned</span>
                    </div>
                  )}
                </div>

                {/* Enrollment Status */}
                {enrollmentLoading ? (
                  <div className="animate-pulse h-10 bg-slate-200-custom rounded"></div>
                ) : enrollment ? (
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-textPrimary">Progress</span>
                        <span className="text-sm text-textSecondary">{currentProgress}%</span>
                      </div>
                      <Progress value={currentProgress} className="h-2" />
                    </div>
                    
                    {!isCompleted && (
                      <div className="flex space-x-2">
                        <Button 
                          onClick={() => handleProgressUpdate(Math.min(100, currentProgress + 10))}
                          disabled={updateProgressMutation.isPending || currentProgress >= 100}
                        >
                          Continue Learning
                        </Button>
                        <Button 
                          variant="outline"
                          onClick={() => handleProgressUpdate(Math.min(100, currentProgress + 25))}
                          disabled={updateProgressMutation.isPending || currentProgress >= 100}
                        >
                          Skip Ahead
                        </Button>
                      </div>
                    )}
                    
                    {isCompleted && (
                      <div className="bg-emerald-100-custom p-4 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <Award className="h-5 w-5 text-secondary" />
                          <span className="font-medium text-secondary">Course Completed!</span>
                        </div>
                        <p className="text-sm text-textSecondary mt-1">
                          Congratulations! You've successfully completed this course.
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <Button 
                    onClick={handleEnroll}
                    disabled={enrollMutation.isPending}
                    size="lg"
                  >
                    {enrollMutation.isPending ? "Enrolling..." : "Enroll Now"}
                  </Button>
                )}
              </div>
            </div>

            {/* Course Content Preview */}
            <Card>
              <CardHeader>
                <CardTitle>What You'll Learn</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs">1</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-textPrimary">Introduction and Fundamentals</h4>
                    <p className="text-sm text-textSecondary">Get started with the basics and core concepts</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs">2</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-textPrimary">Hands-on Practice</h4>
                    <p className="text-sm text-textSecondary">Apply your knowledge with practical exercises</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs">3</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-textPrimary">Advanced Techniques</h4>
                    <p className="text-sm text-textSecondary">Master advanced concepts and best practices</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-textSecondary">Course not found</p>
          </div>
        )}
      </main>
    </div>
  );
}
