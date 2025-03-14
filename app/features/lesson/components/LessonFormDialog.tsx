"use client";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { LessonStatus } from "@/drizzle/schema";
import { ReactNode, useState } from "react";
import { LessonForm } from "./LessonForm";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export function LessonFormDialog({
  section,
  children,
  defaultSectionId,
  lesson,
}: {
  children: ReactNode;
  section?: { id: string; name: string }[];
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
  const [isOpen, setIsOpen] = useState(false);
  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      {children}
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex justify-between items-center">
            <AlertDialogTitle>
              {lesson == null ? "New Lesson" : `Edit ${lesson.name}`}
            </AlertDialogTitle>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className={cn("hover:bg-gray-200 hover:text-red-600")}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </AlertDialogHeader>
        <div className="mt-4">
          <LessonForm
            section={section}
            onSuccess={() => setIsOpen(false)}
            lesson={lesson}
            defaultSectionId={defaultSectionId}
          />
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
