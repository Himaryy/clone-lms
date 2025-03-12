import { db } from "@/drizzle/db";
import {
  CourseProductTable,
  ProductTable,
  PurchaseTable,
} from "@/drizzle/schema";
import { and, eq, isNull } from "drizzle-orm";
import { revalidateProductCache } from "./cache";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import { getPurchaseUserTag } from "../../purchases/db/cache";

export async function userOwnsProduct({
  userId,
  productId,
}: {
  userId: string;
  productId: string;
}) {
  "use cache";
  cacheTag(getPurchaseUserTag(userId));

  const existingPurchase = await db.query.PurchaseTable.findFirst({
    where: and(
      eq(PurchaseTable.productId, productId),
      eq(PurchaseTable.userId, userId),
      isNull(PurchaseTable.refundedAt)
    ),
  });

  return existingPurchase != null;
}

export async function insertProduct(
  data: typeof ProductTable.$inferInsert & { courseIds: string[] }
) {
  const newProduct = await db.transaction(async (trx) => {
    const [newProduct] = await trx
      .insert(ProductTable)
      .values(data)
      .returning();

    if (newProduct == null) {
      trx.rollback();
      throw new Error("Failed to create product");
    }

    // await trx
    //   .insert(CourseProductTable)
    //   .values(
    //     data.courseIds.map((courseId) => ({
    //       productId: newProduct.id,
    //       courseId,
    //     }))
    //   )
    //   .returning();
    // console.log("Valid courseIds:", data.courseIds); // Log the course IDs to verify

    await trx
      .insert(CourseProductTable)
      .values(
        data.courseIds.map((courseId) => ({
          productId: newProduct.id,
          courseId,
        }))
      )
      .returning()
      .catch((err) => {
        console.error("Error inserting courses:", err); // Log any insertion errors
      });
    return newProduct;
  });

  revalidateProductCache(newProduct.id);
  // console.log("Product insertion completed: ", newProduct);
  return newProduct;
}

export async function updateProduct(
  id: string,
  data: Partial<typeof ProductTable.$inferInsert> & { courseIds: string[] }
) {
  const updateProduct = await db.transaction(async (trx) => {
    const [updateProduct] = await trx
      .update(ProductTable)
      .set(data)
      .where(eq(ProductTable.id, id))
      .returning();

    if (updateProduct == null) {
      trx.rollback();
      throw new Error("Failed to create product");
    }

    await trx
      .delete(CourseProductTable)
      .where(eq(CourseProductTable.productId, updateProduct.id));

    await trx.insert(CourseProductTable).values(
      data.courseIds.map((courseId) => ({
        productId: updateProduct.id,
        courseId,
      }))
    );

    return updateProduct;
  });

  revalidateProductCache(updateProduct.id);

  return updateProduct;
}

export async function deleteProduct(id: string) {
  const [deleteProduct] = await db
    .delete(ProductTable)
    .where(eq(ProductTable.id, id))
    .returning();

  if (deleteProduct == null) throw new Error("Failed to delete Product");

  revalidateProductCache(deleteProduct.id);

  return deleteProduct;
}
