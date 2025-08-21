import { Progress } from "@/components/ui/progress";
import { Link } from "wouter";

interface CourseCardProps {
  course: {
    id: string;
    title: string;
    description?: string;
    thumbnailUrl?: string;
    duration?: string;
    enrollment?: {
      progress: string;
      isCompleted: boolean;
    };
  };
}

export default function CourseCard({ course }: CourseCardProps) {
  const progress = course.enrollment ? parseFloat(course.enrollment.progress) : 0;
  const isCompleted = course.enrollment?.isCompleted;
  const isNew = !course.enrollment;

  const getProgressText = () => {
    if (isCompleted) return "Complete";
    if (isNew) return "New";
    return `${Math.round(progress)}%`;
  };

  const getProgressColor = () => {
    if (isCompleted) return "text-secondary";
    if (isNew) return "text-primary";
    return "text-secondary";
  };

  return (
    <Link href={`/course/${course.id}`}>
      <div className="bg-slate-50-custom rounded-lg p-4 hover:shadow-md transition-all cursor-pointer transform hover:scale-[1.02]">
        {course.thumbnailUrl && (
          <img 
            src={course.thumbnailUrl} 
            alt={course.title}
            className="w-full h-32 object-cover rounded-lg mb-3"
          />
        )}
        <div className="space-y-2">
          <h3 className="font-medium text-textPrimary text-sm line-clamp-2">{course.title}</h3>
          {course.description && (
            <p className="text-xs text-textSecondary line-clamp-2">{course.description}</p>
          )}
          <div className="flex items-center justify-between text-xs">
            <span className="text-textSecondary">{course.duration || "Self-paced"}</span>
            <span className={`font-medium ${getProgressColor()}`}>
              {getProgressText()}
            </span>
          </div>
          {course.enrollment && !isCompleted && (
            <Progress value={progress} className="h-1.5" />
          )}
          {isCompleted && (
            <div className="w-full bg-secondary h-1.5 rounded-full"></div>
          )}
          {isNew && (
            <div className="w-full bg-slate-200-custom h-1.5 rounded-full">
              <div className="bg-primary h-1.5 rounded-full" style={{ width: "5%" }}></div>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
