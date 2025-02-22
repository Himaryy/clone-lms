import { CourseForm } from "@/app/features/courses/components/CourseForm";
import PageHeader from "@/components/PageHeader";

export default function NewCoursePage() {
  return (
    <div className="container my-6">
      <PageHeader title="New Course" />
      <CourseForm />
    </div>
  );
}
