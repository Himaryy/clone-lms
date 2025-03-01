"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { courseSchema } from "../schema/courses";
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
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { CreateCourse } from "../actions/courses";
import { actionToast } from "@/lib/utils";
import { updateCourse } from "../db/courses";
import { useTransition } from "react";

export function CourseForm({
  course,
}: {
  course?: {
    id: string;
    name: string;
    description: string;
  };
}) {
  const form = useForm<z.infer<typeof courseSchema>>({
    resolver: zodResolver(courseSchema),
    defaultValues: course ?? {
      name: "",
      description: "",
    },
  });

  const [isLoading, startTransition] = useTransition();

  async function onSubmit(values: z.infer<typeof courseSchema>) {
    startTransition(async () => {
      try {
        const data = course
          ? await updateCourse(course.id, values)
          : await CreateCourse(values);

        actionToast({ actionData: data });
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
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                <RequiredLabelIcon />
                Description
              </FormLabel>

              <FormControl>
                <Textarea className="min-h-20 resize-none" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="self-end">
          <Button disabled={isLoading} type="submit">
            {isLoading ? "Saving" : "Save"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
