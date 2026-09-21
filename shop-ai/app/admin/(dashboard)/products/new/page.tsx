import { getCategories } from "@/lib/categories";
import { ProductForm } from "@/components/admin/products/ProductForm";

export const metadata = {
  title: "Add product",
};

export default async function NewProductPage() {
  const categories = await getCategories();

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-gold">Products</p>
        <h1 className="mt-1 font-display text-3xl text-charcoal sm:text-4xl">Add product</h1>
      </div>
      <ProductForm mode="create" categories={categories} />
    </div>
  );
}
