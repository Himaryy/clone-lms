import type { Metadata } from "next";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Suspense } from "react";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "Clone LMS",
  description: "Just Clone LMS From WDS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Suspense>
      <ClerkProvider>
        <html lang="en">
          <body className="antialiased">
            {children}
            <Toaster />
          </body>
        </html>
      </ClerkProvider>
    </Suspense>
  );
}
