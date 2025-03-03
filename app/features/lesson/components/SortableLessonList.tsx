"use client";

import { SortableItem, SortableList } from "@/components/SortableList";
import { LessonStatus } from "@/drizzle/schema";
import { cn } from "@/lib/utils";
import { EyeClosedIcon, Trash2Icon, VideoIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ActionButton } from "@/components/ActionButton";
import { AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { LessonFormDialog } from "./LessonFormDialog";
import { deleteLessons, updateLessonOrders } from "../actions/lessons";

// 3.30.20

export function SortableLessonList({
  sections,
  lessons,
}: {
  sections: {
    id: string;
    name: string;
  }[];
  lessons: {
    id: string;
    name: string;
    status: LessonStatus;
    youtubeVideoId: string;
    description: string | null;
    sectionId: string;
  }[];
}) {
  return (
    <SortableList items={lessons} onOrderChange={updateLessonOrders}>
      {(items) =>
        items.map((lesson) => (
          <SortableItem
            key={lesson.id}
            id={lesson.id}
            className="flex items-center gap-1"
          >
            <div
              className={cn(
                "contents",
                lesson.status === "private" && "text-muted-foreground"
              )}
            >
              {lesson.status === "private" && (
                <EyeClosedIcon className="size-4" />
              )}
              {lesson.status === "preview" && <VideoIcon className="size-4" />}
              {lesson.name}
            </div>
            <LessonFormDialog lesson={lesson} section={sections}>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm" className="ml-auto">
                  Edit
                </Button>
              </AlertDialogTrigger>
            </LessonFormDialog>
            <ActionButton
              variant="destructiveOutline"
              requireAreYouSure
              action={deleteLessons.bind(null, lesson.id)}
            >
              <Trash2Icon />
              <span className="sr-only">Delete</span>
            </ActionButton>
          </SortableItem>
        ))
      }
    </SortableList>
  );
}
