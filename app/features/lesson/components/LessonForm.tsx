"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import { LessonStatus, lessonStatuses } from "@/drizzle/schema";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AlertDialogCancel } from "@/components/ui/alert-dialog";
import { lessonSchema } from "../schemas/lessons";
import { Textarea } from "@/components/ui/textarea";
import { createLesson, updateLesson } from "../actions/lessons";
import { YoutubeVideoPlayer } from "./YoutubeVideoPlayer";

export function LessonForm({
  section,
  defaultSectionId,
  onSuccess,
  lesson,
}: {
  section?: {
    id: string;
    name: string;
  }[];
  onSuccess?: () => void;
  defaultSectionId?: string;
  lesson?: {
    id: string;
    name: string;
    status: LessonStatus;
    youtubeVideoId: string;
    description: string | null;
    sectionId: string;
  };
}) {
  const form = useForm<z.infer<typeof lessonSchema>>({
    resolver: zodResolver(lessonSchema),
    defaultValues: {
      name: lesson?.name ?? "",
      status: lesson?.status ?? "public ",
      youtubeVideoId: lesson?.youtubeVideoId ?? "",
      description: lesson?.description ?? "",
      sectionId: lesson?.sectionId ?? defaultSectionId ?? section[0].id ?? "",
    },
  });

  const [isLoading, startTransition] = useTransition();

  async function onSubmit(values: z.infer<typeof lessonSchema>) {
    startTransition(async () => {
      try {
        const data = lesson
          ? await updateLesson(lesson.id, values)
          : await createLesson(values);

        actionToast({ actionData: data });

        if (!data.error) {
          onSuccess?.();
        }
      } catch (error) {
        console.error("Error Updating course: ", error);
      }
    });
  }

  const videoId = form.watch("youtubeVideoId");

  return (
    <div className="max-h-[80vh] overflow-y-auto scrollbar-glass">
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
              name="youtubeVideoId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <RequiredLabelIcon />
                    YouTube Video Id
                  </FormLabel>

                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {videoId && (
              <div className="aspect-video ">
                <YoutubeVideoPlayer videoId={videoId} />
              </div>
            )}

            <FormField
              control={form.control}
              name="sectionId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Section</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {(section ?? []).map((sec) => (
                        <SelectItem key={sec.id} value={sec.id}>
                          {sec.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                      {lessonStatuses.map((status) => (
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
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>

                <FormControl>
                  <Textarea
                    className="min-h-20 resize-none"
                    {...field}
                    value={field.value ?? ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end gap-4">
            {/* <AlertDialogCancel className="px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-400 hover:outline-none">
              Cancel
            </AlertDialogCancel> */}
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving" : "Save"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
