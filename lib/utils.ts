import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { toast } from "sonner";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Custom Toast ShadCN
type actionToast = { actionData: { error: boolean; message: string } };

export function actionToast({ actionData }: actionToast) {
  return actionData.error
    ? toast.error("Error", {
        description: actionData.message,
        richColors: true,
      })
    : toast.success("Success", {
        description: actionData.message,
        richColors: true,
      });
}
