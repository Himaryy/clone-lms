import { getCourseGlobalTag } from "@/app/features/courses/db/cache/courses";
import { ProductForm } from "@/app/features/products/components/ProductForm";
import { getProductIdTag } from "@/app/features/products/db/cache";
import PageHeader from "@/components/PageHeader";
import { db } from "@/drizzle/db";
import { CourseTable, ProductTable } from "@/drizzle/schema";
import { asc, eq } from "drizzle-orm";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import { notFound } from "next/navigation";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ productId: string }>;
}) {
  const { productId } = await params;
  const product = await getProduct(productId);

  if (product == null) return notFound();

  return (
    <div className="container my-6">
      <PageHeader title="Edit Product" />
      <ProductForm
        product={{
          ...product,
          courseIds: product.course.map((c) => c.courseId),
        }}
        courses={await getCourses()}
      />
    </div>
  );
}

async function getCourses() {
  "use cache";
  cacheTag(getCourseGlobalTag());

  return db.query.CourseTable.findMany({
    orderBy: asc(CourseTable.name),
    columns: { id: true, name: true },
  });
}

async function getProduct(id: string) {
  "use cache";
  cacheTag(getProductIdTag(id));

  return db.query.ProductTable.findFirst({
    columns: {
      id: true,
      name: true,
      description: true,
      priceInDollars: true,
      status: true,
      imageUrl: true,
    },
    where: eq(ProductTable.id, id),
    with: {
      course: {
        columns: {
          courseId: true,
        },
      },
    },
  });
}
