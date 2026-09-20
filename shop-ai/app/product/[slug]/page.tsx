import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductDetail } from "@/components/product/ProductDetail";
import { ProductGrid } from "@/components/product/ProductGrid";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import {
  getAllProducts,
  getProductBySlug,
  getRelatedProducts,
} from "@/lib/products";
import { categoryNames } from "@/lib/categories";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const products = await getAllProducts();
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return { title: "Product not found" };
  }

  return {
    title: product.name,
    description: product.description,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const related = await getRelatedProducts(product);

  return (
    <Container className="py-12 sm:py-16">
      <ProductDetail product={product} />

      {related.length > 0 ? (
        <section className="mt-20 border-t border-mauve pt-16 sm:mt-24">
          <SectionHeading
            align="left"
            eyebrow="You might also like"
            title={`More from ${categoryNames[product.category]}`}
          />
          <div className="mt-10">
            <ProductGrid products={related} />
          </div>
        </section>
      ) : null}
    </Container>
  );
}
