import Image from "next/image";
import Link from "next/link";
import type { Category } from "@/lib/types";

export function CategoryCard({ category }: { category: Category }) {
  return (
    <Link
      href={`/shop?category=${category.slug}`}
      className="group relative isolate min-h-72 overflow-hidden rounded-3xl"
    >
      <Image
        src={category.image}
        alt={category.imageAlt}
        fill
        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
        className="object-cover transition-transform duration-700 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-plum/35 transition-colors group-hover:bg-plum/45" />
      <div className="absolute inset-x-0 bottom-0 p-6 text-ivory">
        <h3 className="font-display text-3xl">{category.name}</h3>
        <p className="mt-1 max-w-xs text-sm text-ivory/80">{category.description}</p>
      </div>
    </Link>
  );
}
