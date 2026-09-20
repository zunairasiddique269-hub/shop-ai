import { db } from "./client";
import { categories, products } from "./schema";
import { seedCategories, seedProducts } from "./seed-data";

async function main() {
  console.log("Seeding categories...");
  await db
    .insert(categories)
    .values(seedCategories)
    .onConflictDoNothing({ target: categories.slug });

  console.log("Seeding products...");
  await db
    .insert(products)
    .values(
      seedProducts.map((product) => ({
        id: product.id,
        name: product.name,
        slug: product.slug,
        category: product.category,
        description: product.description,
        price: product.price,
        originalPrice: product.originalPrice ?? null,
        discount: product.discount ?? null,
        image: product.image,
        imageAlt: product.imageAlt,
        rating: product.rating,
        reviewCount: product.reviewCount,
        stock: product.stock,
        isNew: product.isNew,
        isFeatured: product.isFeatured,
        isSoldOut: product.isSoldOut,
      })),
    )
    .onConflictDoNothing({ target: products.id });

  console.log(
    `Done. Seeded ${seedCategories.length} categories and ${seedProducts.length} products (skipping any that already exist).`,
  );
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exitCode = 1;
  })
  .finally(() => {
    process.exit();
  });
