"use client";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { CourseSectionStatus } from "@/drizzle/schema";
import { ReactNode, useState } from "react";
import { SectionForm } from "./SectionForm";

export function SectionFormDialog({
  courseId,
  section,
  children,
}: {
  courseId: string;
  children: ReactNode;
  section?: { id: string; name: string; status: CourseSectionStatus };
}) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      {children}
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {section == null ? "New Section" : `Edit ${section.name}`}
          </AlertDialogTitle>
        </AlertDialogHeader>
        <div className="mt-4">
          <SectionForm
            section={section}
            courseId={courseId}
            onSuccess={() => setIsOpen(false)}
          />
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
