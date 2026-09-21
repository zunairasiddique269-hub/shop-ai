import { notFound } from "next/navigation";
import { getCategories } from "@/lib/categories";
import { getProductById } from "@/lib/products";
import { ProductForm } from "@/components/admin/products/ProductForm";

export const metadata = {
  title: "Edit product",
};

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [product, categories] = await Promise.all([getProductById(id), getCategories()]);

  if (!product) {
    notFound();
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-gold">Products</p>
        <h1 className="mt-1 font-display text-3xl text-charcoal sm:text-4xl">
          Edit {product.name}
        </h1>
      </div>
      <ProductForm mode="edit" categories={categories} initialProduct={product} />
    </div>
  );
}
