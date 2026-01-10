import type { ProductPublic } from "@dgmarket/schemas";

export interface ProductRowProps {
    /** Product data to display */
    product: ProductPublic;

    /** User intent: start editing this product */
    onEdit: () => void;

    /** Optional user intent: delete this product */
    onDelete?: () => void;
}
const uploads = "http://localhost:4000";
export default function ProductRow({ product, onEdit, onDelete }: ProductRowProps) {
    return (
        <div className="flex justify-between items-start gap-3">
            <div>
                {product.imageUrl && (
                    <img
                        src={uploads + product.imageUrl}
                        alt={product.name}
                        className="mb-2 aspect-[4/3] w-full rounded-md object-cover bg-muted"
                    />
                )}

                <div className="font-medium">{product.name}</div>

                {product.description && (
                    <div className="text-sm text-muted-foreground">{product.description}</div>
                )}

                <div className="text-sm mt-1">
                    €{(product.priceCents / 100).toFixed(2)} · {product.condition}
                </div>
            </div>

            <div className="flex gap-2">
                <button className="btn-secondary" onClick={onEdit}>
                    Edit
                </button>

                {onDelete && (
                    <button className="btn-destructive" onClick={onDelete}>
                        Delete
                    </button>
                )}
            </div>
        </div>
    );
}
