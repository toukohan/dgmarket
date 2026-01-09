// components/products/ProductList.tsx
import { useEffect, useState } from "react";
import { api } from "@dgmarket/api-client";
import { useAuth } from "@/store/authContext";

import type { ProductPublic } from "@dgmarket/schemas";
import ProductCreateForm from "./ProductCreateForm";
export default function ProductList() {
  const { user, logout } = useAuth();

  const [products, setProducts] = useState<ProductPublic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [creating, setCreating] = useState(false);


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

  if (loading) return <div>Loading products…</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Your products</h2>
        <button onClick={() => setCreating(true)}>Add product</button>
      </div>
      {creating && (
        <ProductCreateForm
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
            <li
              key={product.id}
              className="border rounded p-3 flex justify-between"
            >
              <div>
                <div className="font-medium">{product.name}</div>
                <div className="text-sm text-muted-foreground">
                  €{product.priceCents}
                </div>
              </div>
              <button className="btn-secondary">Edit</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
