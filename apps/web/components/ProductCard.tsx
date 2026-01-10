import { ProductPublic } from "@dgmarket/schemas";

export interface ProductCardProps {
    product: ProductPublic;
    onClick?: () => void;
  }

  
  export function ProductCard({ product }: ProductCardProps) {
    const { name, priceCents, condition, imageUrl } = product;
    
    return (
      <article className="p-2 overflow-hidden rounded-lg border bg-white">
        <div className="aspect-square bg-muted flex items-center justify-center">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={name}
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="text-sm text-muted-foreground">
              No image
            </span>
          )}
        </div>
  
        <div className="p-3 space-y-1">
          <h3 className="line-clamp-2 text-sm font-medium">
            {name}
          </h3>
  
          <div className="flex items-center justify-between">
          <span className="text-lg font-semibold text-primary">
            {(priceCents / 100).toFixed(2)}€
          </span>
  
            <span className="rounded-full border px-2 py-0.5 text-xs text-muted-foreground">
              {condition === "new" ? "New" : "Used"}
            </span>
          </div>
        </div>
      </article>
    );
  }
  