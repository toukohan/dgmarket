import { useEffect, useState } from "react";

import { api } from "@dgmarket/api-client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/store/authContext";

import ProductForm from "./ProductForm";
import ProductRow from "./ProductRow";

import type { ProductPublic, ProductCreate } from "@dgmarket/schemas";

function publicToFormValues(product: ProductPublic): ProductCreate {
    return {
        name: product.name,
        description: product.description,
        priceCents: product.priceCents,
        condition: product.condition,
    };
}

export default function ProductList() {
    const { logout } = useAuth();

    const [products, setProducts] = useState<ProductPublic[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [creating, setCreating] = useState(false);
    const [editingProduct, setEditingProduct] = useState<ProductPublic | null>(null);

    useEffect(() => {
        let cancelled = false;

        api.get("/products/mine")
            .then((res) => {
                if (cancelled) return;
                setProducts(res.data);
                setError(null);
            })
            .catch((err: any) => {
                if (cancelled) return;
                if (err.isAuthExpired) {
                    logout();
                } else {
                    setError("Failed to load products");
                }
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });

        return () => {
            cancelled = true;
        };
    }, [logout]);

    const handleDelete = async (product: ProductPublic) => {
        const confirmed = window.confirm(`Delete "${product.name}"? This cannot be undone.`);

        if (!confirmed) return;

        try {
            await api.delete(`/products/${product.id}`);

            setProducts((prev) => prev.filter((p) => p.id !== product.id));
            if (editingProduct?.id === product.id) {
                setEditingProduct(null);
            }
        } catch (err: any) {
            if (err.isAuthExpired) {
                logout();
            } else {
                alert("Failed to delete product");
            }
        }
    };

    if (loading) {
        return (
            <div className="max-w-4xl mx-auto p-4">
                <p className="text-sm text-muted-foreground">Loading products…</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-4xl mx-auto p-4">
                <p className="text-sm text-red-600">{error}</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-4 space-y-6">
            {/* Page header */}
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold">Your products</h2>

                <Button
                    disabled={creating === true}
                    onClick={() => {
                        setCreating(true);
                        setEditingProduct(null);
                    }}
                >
                    Add product
                </Button>
            </div>

            {/* Create form */}
            {creating && (
                <ProductForm
                    mode="create"
                    initialValues={{
                        name: "",
                        description: null,
                        priceCents: 0,
                        condition: "used",
                    }}
                    onCancel={() => setCreating(false)}
                    onSuccess={(product) => {
                        setProducts((prev) => [product, ...prev]);
                        setCreating(false);
                    }}
                />
            )}

            {/* Products list */}
            {products.length === 0 ? (
                <Card>
                    <CardContent className="p-6 text-sm text-muted-foreground">
                        You don’t have any products yet.
                    </CardContent>
                </Card>
            ) : (
                <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {products.map((product) => (
                        <li
                            key={product.id}
                            className={
                                editingProduct?.id === product.id ? "col-span-full" : undefined
                            }
                        >
                            {editingProduct?.id === product.id ? (
                                <ProductForm
                                    mode="edit"
                                    productId={product.id}
                                    initialValues={publicToFormValues(product)}
                                    onCancel={() => setEditingProduct(null)}
                                    onSuccess={(updated) => {
                                        setProducts((prev) =>
                                            prev.map((p) => (p.id === updated.id ? updated : p)),
                                        );
                                        setEditingProduct(null);
                                    }}
                                />
                            ) : (
                                <Card>
                                    <CardContent className="p-3">
                                        <ProductRow
                                            product={product}
                                            onEdit={() => setEditingProduct(product)}
                                            onDelete={() => handleDelete(product)}
                                        />
                                    </CardContent>
                                </Card>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
