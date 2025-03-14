"use server";

import { z } from "zod";
import { courseSchema } from "../schema/courses";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/services/clerk";
import {
  canCreateCourses,
  canDeleteCourses,
  canUpdateCourses,
} from "../permissions/courses";
import {
  insertCourse,
  deleteCourse as deletedCourseDb,
  updateCourse as updateCourseDb,
} from "../db/courses";

export async function CreateCourse(unsafeData: z.infer<typeof courseSchema>) {
  const { success, data } = courseSchema.safeParse(unsafeData);

  if (!success || !canCreateCourses(await getCurrentUser())) {
    return { error: true, message: "There was an Error creating your course" };
  }

  const course = await insertCourse(data);

  redirect(`/admin/courses/${course.id}/edit`);
}

export async function UpdateCourse(
  id: string,
  unsafeData: z.infer<typeof courseSchema>
) {
  const { success, data } = courseSchema.safeParse(unsafeData);

  if (!success || !canUpdateCourses(await getCurrentUser())) {
    return { error: true, message: "There was an Error updating your course" };
  }

  await updateCourseDb(id, data);

  return { error: false, message: "Successfully updated your course" };
}

export async function deleteCourse(id: string) {
  if (!canDeleteCourses(await getCurrentUser())) {
    return { error: true, message: " Error Deleting your course" };
  }

  await deletedCourseDb(id);
  return { error: false, message: " Successfully Deleted your course" };
}
