import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, CheckCircle, Clock, Award } from "lucide-react";

interface StatsOverviewProps {
  stats?: {
    totalEnrolled: number;
    totalCompleted: number;
    totalHours: string;
    totalCertificates: number;
  };
  isLoading: boolean;
}

export default function StatsOverview({ stats, isLoading }: StatsOverviewProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="h-4 bg-slate-200-custom rounded w-24"></div>
                  <div className="h-8 bg-slate-200-custom rounded w-12"></div>
                </div>
                <div className="w-12 h-12 bg-slate-200-custom rounded-lg"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const statsData = [
    {
      label: "Enrolled Courses",
      value: stats?.totalEnrolled?.toString() || "0",
      icon: BookOpen,
      iconBg: "bg-blue-100-custom",
      iconColor: "text-primary",
    },
    {
      label: "Completed",
      value: stats?.totalCompleted?.toString() || "0",
      icon: CheckCircle,
      iconBg: "bg-emerald-100-custom",
      iconColor: "text-secondary",
    },
    {
      label: "Hours Learned",
      value: stats?.totalHours || "0",
      icon: Clock,
      iconBg: "bg-violet-100-custom",
      iconColor: "text-accent",
    },
    {
      label: "Certificates",
      value: stats?.totalCertificates?.toString() || "0",
      icon: Award,
      iconBg: "bg-amber-100-custom",
      iconColor: "text-amber-600-custom",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      {statsData.map((stat) => {
        const Icon = stat.icon;
        
        return (
          <Card key={stat.label}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-textSecondary text-sm mb-1">{stat.label}</p>
                  <p className="text-2xl font-semibold text-textPrimary">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 ${stat.iconBg} rounded-lg flex items-center justify-center`}>
                  <Icon className={`h-6 w-6 ${stat.iconColor}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
