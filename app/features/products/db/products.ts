import { db } from "@/drizzle/db";
import { CourseProductTable, ProductTable } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { revalidateProductCache } from "./cache";

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

    await trx.insert(CourseProductTable).values(
      data.courseIds.map((courseId) => ({
        productId: newProduct.id,
        courseId,
      }))
    );

    return newProduct;
  });

  revalidateProductCache(newProduct.id);

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
