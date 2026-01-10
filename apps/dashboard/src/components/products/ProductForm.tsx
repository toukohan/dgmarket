import { useEffect, useState } from "react";

import { api } from "@dgmarket/api-client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import type { ProductCreate, ProductPublic } from "@dgmarket/schemas";

type Mode = "create" | "edit";
type ProductFormValues = ProductCreate & {
    imageUrl?: string | null;
    imageAlt?: string;
};

interface ProductFormProps {
    mode: Mode;
    initialValues: ProductFormValues;
    productId?: number;
    onSuccess: (product: ProductPublic) => void;
    onCancel: () => void;
}
const PRICE_REGEX = /^\d*(?:[.,]\d{0,2})?$/;
const normalizePrice = (value: string) => value.replace(",", ".");
function formatPriceDisplay(value: number): string {
    return value.toFixed(2).replace(".", ",");
}

export default function ProductForm({
    mode,
    initialValues,
    onSuccess,
    onCancel,
    productId,
}: ProductFormProps) {
    const [values, setValues] = useState<ProductCreate>(initialValues);
    const [priceInput, setPriceInput] = useState((initialValues.priceCents / 100).toString());
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(initialValues.imageUrl ?? null);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // keep price in sync between edits
    useEffect(() => {
        setPriceInput(formatPriceDisplay(initialValues.priceCents / 100));
    }, [initialValues.priceCents]);

    const submit = async () => {
        const normalized = normalizePrice(priceInput);
        const parsed = Number(normalized);

        if (!Number.isFinite(parsed) || parsed < 0) {
            setError("Enter a valid price");
            return;
        }
        setLoading(true);
        setError(null);
        const payload = {
            ...values,
            priceCents: Math.round(parsed * 100),
        };

        try {
            const res =
                mode === "create"
                    ? await api.post("/products", payload)
                    : await api.patch(`/products/${productId}`, payload);

            let product = res.data;

            if (imageFile) {
                const formData = new FormData();
                formData.append("image", imageFile);

                const imgRes = await api.post(`/products/${product.id}/image`, formData);

                product = {
                    ...product,
                    imageUrl: `${imgRes.data.imageUrl}?v=${Date.now()}`,
                };
            }

            onSuccess(product);
        } catch (err: any) {
            setError(err.response?.data?.message ?? "Failed to save product");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="mb-4">
            <CardContent className="p-6 space-y-6">
                <h3 className="text-lg font-semibold">
                    {mode === "create" ? "Add product" : "Edit product"}
                </h3>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            value={values.name}
                            onChange={(e) => setValues({ ...values, name: e.target.value })}
                            placeholder="Product name"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            value={values.description ?? ""}
                            onChange={(e) =>
                                setValues({
                                    ...values,
                                    description: e.target.value || null,
                                })
                            }
                            placeholder="Optional description"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="price">Price (€)</Label>
                        <Input
                            inputMode="decimal"
                            placeholder="0,00"
                            value={priceInput}
                            onChange={(e) => {
                                const value = e.target.value;

                                if (!PRICE_REGEX.test(value)) return;

                                setPriceInput(value);
                                setError(null);
                            }}
                            onBlur={() => {
                                if (
                                    priceInput.trim() === "" ||
                                    priceInput === "," ||
                                    priceInput === "."
                                ) {
                                    setError("Enter a valid price");
                                    return;
                                }
                                const normalized = normalizePrice(priceInput);
                                const parsed = Number(normalized);

                                if (!Number.isFinite(parsed)) {
                                    setError("Enter a valid price");
                                    return;
                                }

                                const cents = Math.round(parsed * 100);

                                // update canonical state
                                setValues((prev) => ({
                                    ...prev,
                                    priceCents: cents,
                                }));

                                // update display value (9, → 9,00)
                                setPriceInput(formatPriceDisplay(cents / 100));
                            }}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Condition</Label>
                        <Select
                            value={values.condition}
                            onValueChange={(value) =>
                                setValues({
                                    ...values,
                                    condition: value as "new" | "used",
                                })
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select condition" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="new">New</SelectItem>
                                <SelectItem value="used">Used</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>Image</Label>

                        <div className="flex items-center gap-4">
                            {imagePreview ? (
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    className="h-24 w-24 rounded-md object-cover border"
                                />
                            ) : (
                                <div className="h-24 w-24 rounded-md border bg-muted flex items-center justify-center text-sm text-muted-foreground">
                                    No image
                                </div>
                            )}

                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                id="product-image-upload"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (!file) return;

                                    setImageFile(file);
                                    setImagePreview(URL.createObjectURL(file));
                                }}
                            />

                            <Button
                                type="button"
                                variant="secondary"
                                onClick={() =>
                                    document.getElementById("product-image-upload")?.click()
                                }
                            >
                                Choose image
                            </Button>
                        </div>
                    </div>
                </div>

                {error && <p className="text-sm text-red-600 leading-tight">{error}</p>}

                <div className="flex justify-end gap-2">
                    <Button variant="secondary" disabled={loading} onClick={onCancel} type="button">
                        Cancel
                    </Button>

                    <Button onClick={submit} disabled={loading}>
                        {mode === "create" ? "Create product" : "Save changes"}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
