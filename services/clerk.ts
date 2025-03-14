import { getUserIdTag } from "@/app/features/users/db/cache";
import { db } from "@/drizzle/db";
import { UserRole, UserTable } from "@/drizzle/schema";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";

const client = await clerkClient();

// export async function getCurrentUser({ allData = false } = {}) {
//   const { userId, sessionClaims, redirectToSignIn } = await auth();
//   console.log("session", sessionClaims);

//   return {
//     clerkUserId: userId,
//     userId: sessionClaims?.dbId,
//     role: sessionClaims?.role,
//     user:
//       allData && sessionClaims?.dbId != null
//         ? getUser(sessionClaims.dbId)
//         : undefined,
//     redirectToSignIn,
//   };
// }

export async function getCurrentUser({ allData = false } = {}) {
  const { userId, sessionClaims, redirectToSignIn } = await auth();

  // console.log("🔍 Session Claims:", sessionClaims);

  if (!sessionClaims?.dbId) {
    console.warn("❌ dbId is missing in sessionClaims");
    return {
      clerkUserId: userId,
      userId: null,
      role: sessionClaims?.role ?? "user",
      user: undefined,
      redirectToSignIn,
    };
  }

  const user = allData ? await getUser(sessionClaims.dbId) : undefined; // ✅ Await here

  // console.log("📌 User Data from DB:", user);

  return {
    clerkUserId: userId,
    userId: sessionClaims.dbId,
    role: sessionClaims.role,
    user, // ✅ Now this is an actual object, not a Promise
    redirectToSignIn,
  };
}

export function syncClerkUserMetadata(user: {
  id: string;
  clerkUserId: string;
  role: UserRole;
}) {
  return client.users.updateUserMetadata(user.clerkUserId, {
    publicMetadata: {
      dbId: user.id,
      role: user.role,
    },
  });
}

async function getUser(id: string) {
  "use cache";
  cacheTag(getUserIdTag(id));

  // console.log("Called");

  return db.query.UserTable.findFirst({
    where: eq(UserTable.id, id),
  });
}
