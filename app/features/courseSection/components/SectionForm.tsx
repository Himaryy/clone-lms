"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { sectionSchema } from "../schema/courses";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RequiredLabelIcon } from "@/components/RequiredLabelIcon";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { actionToast } from "@/lib/utils";
import { useTransition } from "react";
import { CourseSectionStatus, courseSectionStatuses } from "@/drizzle/schema";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AlertDialogCancel } from "@/components/ui/alert-dialog";
import { createSection, updateSection } from "../actions/coursesSection";

export function SectionForm({
  section,
  courseId,
  onSuccess,
}: {
  section?: {
    id: string;
    name: string;
    status: CourseSectionStatus;
  };
  courseId: string;
  onSuccess?: () => void;
}) {
  const form = useForm<z.infer<typeof sectionSchema>>({
    resolver: zodResolver(sectionSchema),
    defaultValues: section ?? {
      name: "",
      status: "public",
    },
  });

  const [isLoading, startTransition] = useTransition();

  async function onSubmit(values: z.infer<typeof sectionSchema>) {
    startTransition(async () => {
      try {
        const data = section
          ? await updateSection(section.id, values)
          : await createSection(courseId, values);

        actionToast({ actionData: data });

        if (!data.error) {
          onSuccess?.();
        }
      } catch (error) {
        console.error("Error Updating course: ", error);
      }
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex gap-6 flex-col"
      >
        <div className="grid grid-cols-1 @lg:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  <RequiredLabelIcon />
                  Name
                </FormLabel>

                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {courseSectionStatuses.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-4">
          <AlertDialogCancel className="px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-400 hover:outline-none">
            Cancel
          </AlertDialogCancel>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving" : "Save"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
