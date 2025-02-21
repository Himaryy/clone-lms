import { Badge } from "@/components/ui/badge";
import { canAccessAdminPages } from "@/permissions/general";
import { getCurrentUser } from "@/services/clerk";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { ReactNode } from "react";

export default function AdminLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}

function Navbar() {
  return (
    <header className="flex h-12 shadow bg-background z-10">
      <nav className="flex gap-4 container">
        <div className="mr-auto flex items-center">
          <Link className="text-lg hover:underline px-2 " href="/">
            Clone LMS
          </Link>
          <Badge>Admin</Badge>
        </div>
        <AdminLink />

        <Link
          className="hover:bg-accent/10 flex items-center px-2"
          href="/admin/courses"
        >
          Courses
        </Link>

        <Link
          className="hover:bg-accent/10 flex items-center px-2"
          href="/admin/products"
        >
          Products
        </Link>

        <Link
          className="hover:bg-accent/10 flex items-center px-2"
          href="/admin/sales"
        >
          Sales
        </Link>

        <div className="size-8 self-center">
          <UserButton
            appearance={{
              elements: {
                userButtonAvatarBox: { width: "100%", height: "100" },
              },
            }}
          />
        </div>
      </nav>
    </header>
  );
}

async function AdminLink() {
  const user = await getCurrentUser();
  // console.log(user.user?.name);
  if (!canAccessAdminPages(user)) return null;

  return (
    <Link className="hover:bg-accent/10 flex items-center px-2" href="/admin">
      Admin
    </Link>
  );
}
