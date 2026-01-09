import type { ProductCreate } from "@dgmarket/schemas";

const emptyValues: ProductCreate = {
  name: "",
  description: null,
  priceCents: 0,
  condition: "used",
};
