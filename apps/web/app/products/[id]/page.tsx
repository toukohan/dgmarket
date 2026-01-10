import { notFound } from "next/navigation";
import { getProduct } from "@/lib/products";

export const revalidate = 60;

interface ProductPageProps {
    params: Promise<{ id: string }>;
  }

export default async function ProductPage({ params }: ProductPageProps) {
    const { id } = await params;
    const productId = Number(id);
  
    if (Number.isNaN(productId)) {
      notFound();
    }
  
    let product;
    try {
      product = await getProduct(productId);
    } catch {
      notFound();
    }

  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <div className="grid gap-10 md:grid-cols-2">
        {/* Image */}
        <div className="aspect-square bg-white border rounded-lg flex items-center justify-center">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="h-full w-full object-cover rounded-lg"
            />
          ) : (
            <span className="text-sm text-muted-foreground">
              No image available
            </span>
          )}
        </div>

        {/* Details */}
        <div>
          <h1 className="text-3xl font-semibold">
            {product.name}
          </h1>

          <p className="mt-4 text-2xl font-semibold text-primary">
            €{(product.priceCents / 100).toFixed(2)}
          </p>

          <p className="mt-2 text-sm text-muted-foreground">
            Condition: {product.condition === "new" ? "New" : "Used"}
          </p>

          {product.description && (
            <p className="mt-6 whitespace-pre-line">
              {product.description}
            </p>
          )}

          {/* Placeholder for future actions */}
          <div className="mt-8 rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
            Contact seller coming soon
          </div>
        </div>
      </div>
    </main>
  );
}
