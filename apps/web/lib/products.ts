// apps/web/lib/products.ts
import { publicApi } from "@dgmarket/api-client";
import { ProductPublicSchema } from "@dgmarket/schemas";

const API_ORIGIN =
  process.env.NEXT_PUBLIC_API_ORIGIN ??
  "http://localhost:4000";

export async function getProducts() {
  const res = await publicApi.get("/products");
  const products = ProductPublicSchema.array().parse(res.data);

  return products.map((p) => ({
    ...p,
    imageUrl: p.imageUrl
      ? `${API_ORIGIN}${p.imageUrl}`
      : null,
  }));
}

export async function getProduct(id: number) {
  const res = await publicApi.get(`/products/${id}`);
  const product = ProductPublicSchema.parse(res.data);

  return {
    ...product,
    imageUrl: product.imageUrl
      ? `${API_ORIGIN}${product.imageUrl}`
      : null,
  };
}