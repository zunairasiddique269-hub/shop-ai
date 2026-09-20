import { CategoryCard } from "@/components/home/CategoryCard";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getCategories } from "@/lib/categories";

export async function CategorySection() {
  const categories = await getCategories();
  return (
    <section className="py-20 sm:py-24">
      <Container>
        <SectionHeading
          eyebrow="The edit"
          title="Shop by category"
          description="Six houses of the ShopAI wardrobe, from occasion dressing to objects for the home."
        />
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <CategoryCard key={category.slug} category={category} />
          ))}
        </div>
      </Container>
    </section>
  );
}
