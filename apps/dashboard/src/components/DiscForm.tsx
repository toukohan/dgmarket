import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { discsApi } from "../../../../packages/api/discs";
import type { CreateDiscInput, PublicDisc, DiscCondition } from "../../../../packages/types/disc";

interface DiscFormProps {
  disc?: PublicDisc;
  onSuccess: () => void;
  onCancel?: () => void;
}

export default function DiscForm({ disc, onSuccess, onCancel }: DiscFormProps) {
  const [formData, setFormData] = useState<CreateDiscInput>({
    brand: disc?.brand || "",
    model: disc?.model || "",
    speed: disc?.speed || 5,
    glide: disc?.glide || 4,
    turn: disc?.turn || 0,
    fade: disc?.fade || 2,
    weight_grams: disc?.weight_grams || 175,
    plastic_type: disc?.plastic_type || "",
    condition: disc?.condition || "new",
    price_cents: disc?.price_cents || 0,
    description: disc?.description || "",
    image_urls: disc?.image_urls || [],
    hidden: disc?.hidden || false,
    sold: disc?.sold || false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

  const handleChange = (field: keyof CreateDiscInput, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const addImageUrl = () => {
    if (imageUrl.trim()) {
      handleChange("image_urls", [...formData.image_urls!, imageUrl.trim()]);
      setImageUrl("");
    }
  };

  const removeImageUrl = (index: number) => {
    handleChange(
      "image_urls",
      formData.image_urls!.filter((_, i) => i !== index)
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    try {
      if (disc) {
        await discsApi.update(disc.id, formData);
      } else {
        await discsApi.create(formData);
      }
      onSuccess();
    } catch (error: any) {
      if (error.response?.data?.error?.message) {
        setErrors({ submit: error.response.data.error.message });
      } else {
        setErrors({ submit: "Failed to save disc. Please try again." });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{disc ? "Edit Disc" : "Add New Disc"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="brand">Brand *</Label>
              <Input
                id="brand"
                value={formData.brand}
                onChange={(e) => handleChange("brand", e.target.value)}
                placeholder="e.g., Innova, Discraft"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="model">Model *</Label>
              <Input
                id="model"
                value={formData.model}
                onChange={(e) => handleChange("model", e.target.value)}
                placeholder="e.g., Destroyer, Buzzz"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="speed">Speed (1-14) *</Label>
              <Input
                id="speed"
                type="number"
                min="1"
                max="14"
                value={formData.speed}
                onChange={(e) => handleChange("speed", parseInt(e.target.value))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="glide">Glide (1-7) *</Label>
              <Input
                id="glide"
                type="number"
                min="1"
                max="7"
                value={formData.glide}
                onChange={(e) => handleChange("glide", parseInt(e.target.value))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="turn">Turn (-5 to 1) *</Label>
              <Input
                id="turn"
                type="number"
                step="0.1"
                min="-5"
                max="1"
                value={formData.turn}
                onChange={(e) => handleChange("turn", parseFloat(e.target.value))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fade">Fade (0-5) *</Label>
              <Input
                id="fade"
                type="number"
                step="0.1"
                min="0"
                max="5"
                value={formData.fade}
                onChange={(e) => handleChange("fade", parseFloat(e.target.value))}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="weight">Weight (grams) *</Label>
              <Input
                id="weight"
                type="number"
                min="140"
                max="180"
                value={formData.weight_grams}
                onChange={(e) => handleChange("weight_grams", parseInt(e.target.value))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="plastic">Plastic Type *</Label>
              <Input
                id="plastic"
                value={formData.plastic_type}
                onChange={(e) => handleChange("plastic_type", e.target.value)}
                placeholder="e.g., Star, Champion, Z"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="condition">Condition *</Label>
              <select
                id="condition"
                value={formData.condition}
                onChange={(e) => handleChange("condition", e.target.value as DiscCondition)}
                className="h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs"
                required
              >
                <option value="new">New</option>
                <option value="like_new">Like New</option>
                <option value="used">Used</option>
                <option value="heavily_used">Heavily Used</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Price (cents) *</Label>
              <Input
                id="price"
                type="number"
                min="1"
                value={formData.price_cents}
                onChange={(e) => handleChange("price_cents", parseInt(e.target.value))}
                placeholder="e.g., 2000 for $20.00"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="hidden"
                checked={formData.hidden || false}
                onChange={(e) => handleChange("hidden", e.target.checked)}
                className="h-4 w-4 rounded border-gray-300"
              />
              <Label htmlFor="hidden" className="cursor-pointer">
                Hide from web (not visible to buyers)
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="sold"
                checked={formData.sold || false}
                onChange={(e) => handleChange("sold", e.target.checked)}
                className="h-4 w-4 rounded border-gray-300"
              />
              <Label htmlFor="sold" className="cursor-pointer">
                Mark as sold
              </Label>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
              value={formData.description || ""}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Additional details about the disc..."
              className="h-24 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs"
            />
          </div>

          <div className="space-y-2">
            <Label>Image URLs</Label>
            <div className="flex gap-2">
              <Input
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addImageUrl();
                  }
                }}
              />
              <Button type="button" onClick={addImageUrl} variant="outline">
                Add
              </Button>
            </div>
            {formData.image_urls && formData.image_urls.length > 0 && (
              <div className="mt-2 space-y-1">
                {formData.image_urls.map((url, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <span className="truncate">{url}</span>
                    <Button
                      type="button"
                      onClick={() => removeImageUrl(index)}
                      variant="ghost"
                      size="sm"
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {errors.submit && (
            <p className="text-sm text-red-600">{errors.submit}</p>
          )}

          <div className="flex gap-4">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : disc ? "Update Disc" : "Add Disc"}
            </Button>
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
