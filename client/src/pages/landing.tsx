import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { GraduationCap, BookOpen, Users, Award } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <GraduationCap className="text-white h-5 w-5" />
              </div>
              <span className="text-xl font-semibold text-textPrimary">EduPath</span>
            </div>
            <Button onClick={() => window.location.href = '/api/login'}>
              Sign In
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-textPrimary mb-4">
            Welcome to EduPath
          </h1>
          <p className="text-xl text-textSecondary mb-8 max-w-2xl mx-auto">
            Your personalized learning management system. Track your progress, 
            explore courses, and achieve your educational goals.
          </p>
          <Button 
            size="lg" 
            className="mb-16"
            onClick={() => window.location.href = '/api/login'}
          >
            Get Started
          </Button>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-blue-100-custom rounded-lg flex items-center justify-center mx-auto mb-4">
                <BookOpen className="text-primary h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-textPrimary mb-2">
                Diverse Course Catalog
              </h3>
              <p className="text-textSecondary">
                Access a wide range of courses across programming, design, and business domains.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-emerald-100-custom rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="text-secondary h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-textPrimary mb-2">
                Progress Tracking
              </h3>
              <p className="text-textSecondary">
                Monitor your learning journey with detailed progress analytics and completion tracking.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-amber-100-custom rounded-lg flex items-center justify-center mx-auto mb-4">
                <Award className="text-amber-600-custom h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-textPrimary mb-2">
                Certificates & Achievements
              </h3>
              <p className="text-textSecondary">
                Earn certificates upon course completion and showcase your skills.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
