import { Button } from "@/components/ui/button";
import CourseCard from "./course-card";

interface CourseGroupProps {
  group: {
    id: string;
    name: string;
    description?: string;
    courses: Array<{
      id: string;
      title: string;
      description?: string;
      thumbnailUrl?: string;
      duration?: string;
      enrollment?: {
        progress: string;
        isCompleted: boolean;
      };
    }>;
  };
}

export default function CourseGroup({ group }: CourseGroupProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-textPrimary mb-1">{group.name}</h2>
          {group.description && (
            <p className="text-textSecondary text-sm">{group.description}</p>
          )}
        </div>
        <Button variant="ghost" className="text-primary hover:text-blue-700 text-sm font-medium">
          View All
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {group.courses.slice(0, 5).map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  );
}
