import { useState } from "react";
import { api } from "@dgmarket/api-client";
import type { ProductCreate, ProductPublic } from "@dgmarket/schemas";

interface Props {
  onSuccess: (product: ProductPublic) => void;
  onCancel: () => void;
}

export default function ProductCreateForm({ onSuccess, onCancel }: Props) {
  const [values, setValues] = useState<ProductCreate>({
    name: "",
    description: null,
    priceCents: 0,
    condition: "used",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await api.post("/products", values);
      onSuccess(res.data);
    } catch (err: any) {
      setError(err.response?.data?.message ?? "Failed to create product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border rounded p-4 mb-4">
      <h3 className="font-semibold mb-2">Add product</h3>

      <input
        value={values.name}
        onChange={(e) =>
          setValues({ ...values, name: e.target.value })
        }
        placeholder="Name"
      />

      <textarea
        value={values.description ?? ""}
        onChange={(e) =>
          setValues({
            ...values,
            description: e.target.value || null,
          })
        }
        placeholder="Description"
      />

      <input
        type="number"
        value={values.priceCents}
        onChange={(e) =>
          setValues({
            ...values,
            priceCents: Number(e.target.value),
          })
        }
      />

      <select
        value={values.condition}
        onChange={(e) =>
          setValues({
            ...values,
            condition: e.target.value as any,
          })
        }
      >
        <option value="new">New</option>
        <option value="used">Used</option>
      </select>

      {error && <p className="text-red-500">{error}</p>}

      <div className="flex gap-2 mt-3">
        <button onClick={submit} disabled={loading}>
          Create
        </button>
        <button onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
}
