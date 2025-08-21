import {
  users,
  courses,
  courseGroups,
  enrollments,
  type User,
  type UpsertUser,
  type Course,
  type CourseGroup,
  type Enrollment,
  type InsertCourse,
  type InsertCourseGroup,
  type InsertEnrollment,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc } from "drizzle-orm";

export interface IStorage {
  // User operations - mandatory for Replit Auth
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Course operations
  getCourseGroups(): Promise<CourseGroup[]>;
  getCoursesByGroupId(groupId: string): Promise<Course[]>;
  getCourse(id: string): Promise<Course | undefined>;
  createCourseGroup(group: InsertCourseGroup): Promise<CourseGroup>;
  createCourse(course: InsertCourse): Promise<Course>;
  
  // Enrollment operations
  getUserEnrollments(userId: string): Promise<(Enrollment & { course: Course })[]>;
  getUserEnrollmentStats(userId: string): Promise<{
    totalEnrolled: number;
    totalCompleted: number;
    totalHours: string;
    totalCertificates: number;
  }>;
  getEnrollment(userId: string, courseId: string): Promise<Enrollment | undefined>;
  createEnrollment(enrollment: InsertEnrollment): Promise<Enrollment>;
  updateEnrollmentProgress(userId: string, courseId: string, progress: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Course operations
  async getCourseGroups(): Promise<CourseGroup[]> {
    return await db.select().from(courseGroups);
  }

  async getCoursesByGroupId(groupId: string): Promise<Course[]> {
    return await db
      .select()
      .from(courses)
      .where(eq(courses.groupId, groupId))
      .limit(5);
  }

  async getCourse(id: string): Promise<Course | undefined> {
    const [course] = await db.select().from(courses).where(eq(courses.id, id));
    return course;
  }

  async createCourseGroup(group: InsertCourseGroup): Promise<CourseGroup> {
    const [courseGroup] = await db
      .insert(courseGroups)
      .values(group)
      .returning();
    return courseGroup;
  }

  async createCourse(course: InsertCourse): Promise<Course> {
    const [newCourse] = await db
      .insert(courses)
      .values(course)
      .returning();
    return newCourse;
  }

  // Enrollment operations
  async getUserEnrollments(userId: string): Promise<(Enrollment & { course: Course })[]> {
    return await db
      .select({
        id: enrollments.id,
        userId: enrollments.userId,
        courseId: enrollments.courseId,
        progress: enrollments.progress,
        isCompleted: enrollments.isCompleted,
        enrolledAt: enrollments.enrolledAt,
        completedAt: enrollments.completedAt,
        course: courses,
      })
      .from(enrollments)
      .innerJoin(courses, eq(enrollments.courseId, courses.id))
      .where(eq(enrollments.userId, userId))
      .orderBy(desc(enrollments.enrolledAt));
  }

  async getUserEnrollmentStats(userId: string): Promise<{
    totalEnrolled: number;
    totalCompleted: number;
    totalHours: string;
    totalCertificates: number;
  }> {
    const userEnrollments = await this.getUserEnrollments(userId);
    
    const totalEnrolled = userEnrollments.length;
    const totalCompleted = userEnrollments.filter(e => e.isCompleted).length;
    
    // Calculate total hours from course durations
    let totalMinutes = 0;
    userEnrollments.forEach(enrollment => {
      if (enrollment.course.duration) {
        const duration = enrollment.course.duration;
        const hours = parseInt(duration.match(/(\d+)h/)?.[1] || '0');
        const minutes = parseInt(duration.match(/(\d+)m/)?.[1] || '0');
        totalMinutes += hours * 60 + minutes;
      }
    });
    
    const totalHours = Math.floor(totalMinutes / 60).toString();
    const totalCertificates = totalCompleted; // Assume 1 certificate per completed course
    
    return {
      totalEnrolled,
      totalCompleted,
      totalHours,
      totalCertificates,
    };
  }

  async getEnrollment(userId: string, courseId: string): Promise<Enrollment | undefined> {
    const [enrollment] = await db
      .select()
      .from(enrollments)
      .where(and(eq(enrollments.userId, userId), eq(enrollments.courseId, courseId)));
    return enrollment;
  }

  async createEnrollment(enrollment: InsertEnrollment): Promise<Enrollment> {
    const [newEnrollment] = await db
      .insert(enrollments)
      .values(enrollment)
      .returning();
    return newEnrollment;
  }

  async updateEnrollmentProgress(userId: string, courseId: string, progress: number): Promise<void> {
    const isCompleted = progress >= 100;
    const updateData: any = {
      progress: progress.toString(),
      isCompleted,
    };
    
    if (isCompleted) {
      updateData.completedAt = new Date();
    }
    
    await db
      .update(enrollments)
      .set(updateData)
      .where(and(eq(enrollments.userId, userId), eq(enrollments.courseId, courseId)));
  }
}

export const storage = new DatabaseStorage();
