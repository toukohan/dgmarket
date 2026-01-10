// apps/web/app/products/page.tsx

import { ProductGrid } from "@/components/ProductGrid";
import { getProducts } from "@/lib/products";

export const revalidate = 60; // ISR: regenerate every 60s

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <main className="mx-auto max-w-7xl px-4 py-6">
      <h1 className="mb-6 text-2xl font-semibold">
        Products
      </h1>

      <ProductGrid products={products} />
    </main>
  );
}
