import { getProductIdTag } from "@/app/features/products/db/cache";
import { userOwnsProduct } from "@/app/features/products/db/products";
import { wherePublicProducts } from "@/app/features/products/permissions/products";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import PageHeader from "@/components/PageHeader";
import { db } from "@/drizzle/db";
import { ProductTable } from "@/drizzle/schema";
import { getCurrentUser } from "@/services/clerk";
import { StripeCheckoutForm } from "@/services/stripe/components/StripeCheckoutForm";
import { SignIn, SignUp } from "@clerk/nextjs";
import { and, eq } from "drizzle-orm";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";

export default function PurchasePage({
  params,
  searchParams,
}: {
  params: Promise<{ productId: string }>;
  searchParams: Promise<{ authMode: string }>;
}) {
  return (
    <Suspense fallback={<LoadingSpinner className="my-6 size-36 mx-auto" />}>
      <SuspendedComponent params={params} searchParams={searchParams} />
    </Suspense>
  );
}

async function SuspendedComponent({
  params,
  searchParams,
}: {
  params: Promise<{ productId: string }>;
  searchParams: Promise<{ authMode: string }>;
}) {
  const { productId } = await params;
  const { authMode } = await searchParams;
  const product = getPublicProduct(productId);
  const { user } = getCurrentUser({ allData: true });
  const isSignUp = authMode === "signUp";

  if (product == null) return notFound();

  if (user != null) {
    if (
      await userOwnsProduct({
        userId: user.id,
        productId,
      })
    ) {
      redirect("/courses");
    }

    return (
      <div className="container my-6">
        <StripeCheckoutForm product={product} user={user} />
      </div>
    );
  }

  return (
    <div className="container my-6 flex flex-col items-center">
      <PageHeader title="You need an account to purchase" />
      {isSignUp ? (
        <SignUp
          routing="hash"
          signInUrl={`/products/${productId}/purchase?authMode=signIn`}
          forceRedirectUrl={`/products/${productId}/purchase`}
        />
      ) : (
        <SignIn
          routing="hash"
          signInUrl={`/products/${productId}/purchase?authMode=signUp`}
          forceRedirectUrl={`/products/${productId}/purchase`}
        />
      )}
    </div>
  );
}

async function getPublicProduct(id: string) {
  "use cache";
  cacheTag(getProductIdTag(id));

  return db.query.ProductTable.findFirst({
    columns: {
      name: true,
      id: true,
      imageUrl: true,
      description: true,
      priceInDollars: true,
    },
    where: and(eq(ProductTable.id, id), wherePublicProducts),
  });
}
