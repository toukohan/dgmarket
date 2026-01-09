// components/products/ProductList.tsx
import { useEffect, useState } from "react";
import { api } from "@dgmarket/api-client";
import { useAuth } from "@/store/authContext";

import type { ProductPublic, ProductCreate, ProductUpdate } from "@dgmarket/schemas";
import ProductForm from "./ProductForm";
import ProductRow
 from "./ProductRow";
function publicToFormValues(product: ProductPublic): ProductCreate {
  return {
    name: product.name,
    description: product.description,
    priceCents: product.priceCents,
    condition: product.condition,
  };
}

export default function ProductList() {
  const { user, logout } = useAuth();

  const [products, setProducts] = useState<ProductPublic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [creating, setCreating] = useState(false);

  const [editingProduct, setEditingProduct] =
    useState<ProductPublic | null>(null);

  useEffect(() => {
    if (!user) return;

    setLoading(true);
    api
      .get("/products/mine")
      .then((res) => {
        setProducts(res.data);
        setError(null);
      })
      .catch((err: any) => {
        if (err.isAuthExpired) {
          logout();
        } else {
          setError("Failed to load products");
        }
      })
      .finally(() => setLoading(false));
  }, [user]);

  const handleDelete = async (product: ProductPublic) => {
    const confirmed = window.confirm(
      `Delete "${product.name}"? This cannot be undone.`,
    );
  
    if (!confirmed) return;
  
    try {
      await api.delete(`/products/${product.id}`);
  
      setProducts((prev) =>
        prev.filter((p) => p.id !== product.id),
      );
      // empty editstate on delete
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
  
  if (loading) return <div>Loading products…</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Your products</h2>
        <button onClick={() => setCreating(true)}>Add product</button>
      </div>
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

      {products.length === 0 ? (
        <p>No products yet.</p>
      ) : (
        <ul className="space-y-2">
          {products.map((product) => (
            <li key={product.id}>
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
                <ProductRow
                  product={product}
                  onEdit={() => setEditingProduct(product)}
                  onDelete={() => handleDelete(product)}
                />
              )}
            </li>
          ))}
        </ul>

      )}
    </div>
  );
}
