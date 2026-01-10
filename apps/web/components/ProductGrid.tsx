import { ProductCard } from "./ProductCard";
import type { ProductPublic } from "@dgmarket/schemas";

export interface ProductGridProps {
  products: ProductPublic[];
  onProductClick?: (product: ProductPublic) => void;
}

export function ProductGrid({ products, onProductClick }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <p className="mt-10 text-center text-muted-foreground">
        No products available right now.
      </p>
    );
  }

  return (
    <section
      aria-label="Product listings"
      className="
        grid
        grid-cols-2
        gap-4
        sm:gap-6
        md:grid-cols-3
        lg:grid-cols-4
        xl:grid-cols-5
      "
    >
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onClick={() => onProductClick?.(product)}
        />
      ))}
    </section>
  );
}
