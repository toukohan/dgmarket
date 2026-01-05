import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { discsApi } from "../../../../packages/api/discs";
import type { PublicDisc } from "../../../../packages/types/disc";
import DiscForm from "./DiscForm";

export default function DiscList() {
  const [discs, setDiscs] = useState<PublicDisc[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingDisc, setEditingDisc] = useState<PublicDisc | undefined>();

  useEffect(() => {
    loadDiscs();
  }, []);

  const loadDiscs = async () => {
    try {
      setLoading(true);
      const myDiscs = await discsApi.getMyDiscs();
      setDiscs(myDiscs);
    } catch (error) {
      console.error("Failed to load discs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this disc?")) return;

    try {
      await discsApi.delete(id);
      await loadDiscs();
    } catch (error) {
      console.error("Failed to delete disc:", error);
      alert("Failed to delete disc. Please try again.");
    }
  };

  const handleEdit = (disc: PublicDisc) => {
    setEditingDisc(disc);
    setShowForm(true);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingDisc(undefined);
    loadDiscs();
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingDisc(undefined);
  };

  if (showForm) {
    return (
      <div className="container mx-auto p-4">
        <DiscForm disc={editingDisc} onSuccess={handleFormSuccess} onCancel={handleCancel} />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Discs</h1>
        <Button onClick={() => setShowForm(true)}>Add New Disc</Button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : discs.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground mb-4">You haven't added any discs yet.</p>
            <Button onClick={() => setShowForm(true)}>Add Your First Disc</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {discs.map((disc) => (
            <Card key={disc.id} className={disc.hidden || disc.sold ? "opacity-75" : ""}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>
                    {disc.brand} {disc.model}
                  </CardTitle>
                  <div className="flex gap-2">
                    {disc.hidden && (
                      <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded">
                        Hidden
                      </span>
                    )}
                    {disc.sold && (
                      <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">
                        Sold
                      </span>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-sm space-y-1">
                  <p>
                    <strong>Flight Numbers:</strong> {disc.speed} | {disc.glide} | {disc.turn} | {disc.fade}
                  </p>
                  <p>
                    <strong>Weight:</strong> {disc.weight_grams}g
                  </p>
                  <p>
                    <strong>Plastic:</strong> {disc.plastic_type}
                  </p>
                  <p>
                    <strong>Condition:</strong> {disc.condition.replace("_", " ")}
                  </p>
                  <p>
                    <strong>Price:</strong> ${(disc.price_cents / 100).toFixed(2)}
                  </p>
                  {disc.description && (
                    <p className="text-muted-foreground">{disc.description}</p>
                  )}
                </div>

                {disc.image_urls && disc.image_urls.length > 0 && (
                  <div className="space-y-2">
                    {disc.image_urls.slice(0, 1).map((url, idx) => (
                      <img
                        key={idx}
                        src={url}
                        alt={`${disc.brand} ${disc.model}`}
                        className="w-full h-32 object-cover rounded"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                    ))}
                  </div>
                )}

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(disc)}
                    className="flex-1"
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(disc.id)}
                    className="flex-1"
                  >
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
