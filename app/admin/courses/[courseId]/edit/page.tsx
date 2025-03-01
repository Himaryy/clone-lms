import { CourseForm } from "@/app/features/courses/components/CourseForm";
import { getCourseIdTag } from "@/app/features/courses/db/cache/courses";
import { deleteSection } from "@/app/features/courseSection/actions/coursesSection";
import { SectionFormDialog } from "@/app/features/courseSection/components/SectionFormDialog";
import { getCourseSectionCourseTag } from "@/app/features/courseSection/db/cache";
import { getLessonCourseTag } from "@/app/features/lesson/db/cache/lesson";
import { ActionButton } from "@/components/ActionButton";
import PageHeader from "@/components/PageHeader";
import { AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { db } from "@/drizzle/db";
import { CourseSectionTable, CourseTable, LessonTable } from "@/drizzle/schema";
import { cn } from "@/lib/utils";
import { asc, eq } from "drizzle-orm";
import { EyeClosedIcon, PlusIcon, Trash2Icon } from "lucide-react";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import { notFound } from "next/navigation";

export default async function EditCoursePage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;
  const course = await getCourse(courseId);

  if (course == null) return notFound();

  return (
    <div className="container my-6">
      <PageHeader title={course.name} />
      <Tabs defaultValue="lessons">
        <TabsList>
          <TabsTrigger value="lessons">Lessons</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
        </TabsList>

        <TabsContent value="lessons">
          <Card>
            <CardHeader className="flex items-center flex-row justify-between">
              <CardTitle>Sections</CardTitle>
              <SectionFormDialog courseId={course.id}>
                <AlertDialogTrigger asChild>
                  <Button variant="outline">
                    <PlusIcon /> New Section
                  </Button>
                </AlertDialogTrigger>
              </SectionFormDialog>
            </CardHeader>
            <CardContent>
              {course.courseSections.map((section) => (
                <div key={section.id} className="flex items-center gap-1">
                  <div
                    className={cn(
                      "contents",
                      section.status === "private" && "text-muted-foreground"
                    )}
                  >
                    {section.status === "private" && (
                      <EyeClosedIcon className="size-4" />
                    )}
                    {section.name}
                  </div>
                  <SectionFormDialog section={section} courseId={courseId}>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm" className="ml-auto">
                        Edit
                      </Button>
                    </AlertDialogTrigger>
                  </SectionFormDialog>
                  <ActionButton
                    action={deleteSection.bind(null, section.id)}
                    requireAreYouSure
                    variant="destructive"
                    size="sm"
                  >
                    <Trash2Icon />
                    <span className="sr-only">Delete</span>
                  </ActionButton>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="details">
          <Card>
            <CardHeader>
              <CourseForm course={course} />
            </CardHeader>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

async function getCourse(id: string) {
  "use cache";
  cacheTag(
    getCourseIdTag(id),
    getCourseSectionCourseTag(id),
    getLessonCourseTag(id)
  );

  return db.query.CourseTable.findFirst({
    columns: { id: true, name: true, description: true },
    where: eq(CourseTable.id, id),
    with: {
      courseSections: {
        orderBy: asc(CourseSectionTable.order),
        columns: { id: true, name: true, status: true },
        with: {
          lesson: {
            orderBy: asc(LessonTable.order),
            columns: {
              id: true,
              name: true,
              status: true,
              description: true,
              youtubeVideoId: true,
              sectionId: true,
            },
          },
        },
      },
    },
  });
}
