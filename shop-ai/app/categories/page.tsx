import { CategoryCard } from "@/components/home/CategoryCard";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { categories } from "@/lib/categories";

export const metadata = {
  title: "Categories",
  description: "Explore ShopAI categories across women, men, accessories, footwear, beauty, and home.",
};

export default function CategoriesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Departments"
        title="Categories"
        description="Six houses of the wardrobe, each with its own rhythm and season."
      />
      <Container className="grid gap-4 py-12 sm:grid-cols-2 lg:grid-cols-3 sm:py-16">
        {categories.map((category) => (
          <CategoryCard key={category.slug} category={category} />
        ))}
      </Container>
    </>
  );
}
