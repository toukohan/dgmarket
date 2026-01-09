import type { ProductPublic } from "@dgmarket/schemas";
export interface ProductRowProps {
    /** Product data to display */
    product: ProductPublic;

    /** User intent: start editing this product */
    onEdit: () => void;

    /** Optional user intent: delete this product */
    onDelete?: () => void;
}

export default function ProductRow({ product, onEdit, onDelete }: ProductRowProps) {
    return (
        <div className="border rounded p-3 flex justify-between items-start">
            <div>
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
