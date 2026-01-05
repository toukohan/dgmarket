"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import type { PublicDisc } from "../../../../packages/types/disc";

interface DiscSearchProps {
  initialDiscs: PublicDisc[];
  total: number;
}

export default function DiscSearch({ initialDiscs, total: initialTotal }: DiscSearchProps) {
  const [discs, setDiscs] = useState<PublicDisc[]>(initialDiscs);
  const [total, setTotal] = useState(initialTotal);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    search: "",
    brand: "",
    model: "",
    minSpeed: "",
    maxSpeed: "",
    minGlide: "",
    maxGlide: "",
    minTurn: "",
    maxTurn: "",
    minFade: "",
    maxFade: "",
    minWeight: "",
    maxWeight: "",
    plasticType: "",
    condition: "",
    minPrice: "",
    maxPrice: "",
    sortBy: "created_at",
    sortOrder: "desc" as "asc" | "desc",
  });

  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const applyFilters = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== "") {
        params.append(key, String(value));
      }
    });
    
    params.append("limit", String(itemsPerPage));
    params.append("offset", String((currentPage - 1) * itemsPerPage));

    try {
      const response = await fetch(`/api/discs/search?${params.toString()}`, {
        cache: "no-store",
      });
      if (response.ok) {
        const data = await response.json();
        setDiscs(data.discs);
        setTotal(data.total);
      }
    } catch (error) {
      console.error("Failed to search discs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    applyFilters();
  }, [currentPage]);

  const handleFilterChange = (field: string, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
    setCurrentPage(1);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    applyFilters();
  };

  const totalPages = Math.ceil(total / itemsPerPage);

  return (
    <div>
      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            placeholder="Search by brand, model, or description..."
            value={filters.search}
            onChange={(e) => handleFilterChange("search", e.target.value)}
            className="flex-1 px-4 py-2 border rounded-md"
          />
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? "Searching..." : "Search"}
          </button>
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-2 border rounded-md"
          >
            {showFilters ? "Hide" : "Show"} Filters
          </button>
        </div>

        {showFilters && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 border rounded-md bg-gray-50">
            <div>
              <label className="block text-sm font-medium mb-1">Brand</label>
              <input
                type="text"
                value={filters.brand}
                onChange={(e) => handleFilterChange("brand", e.target.value)}
                className="w-full px-3 py-1 border rounded"
                placeholder="e.g., Innova"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Model</label>
              <input
                type="text"
                value={filters.model}
                onChange={(e) => handleFilterChange("model", e.target.value)}
                className="w-full px-3 py-1 border rounded"
                placeholder="e.g., Destroyer"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Min Speed</label>
              <input
                type="number"
                min="1"
                max="14"
                value={filters.minSpeed}
                onChange={(e) => handleFilterChange("minSpeed", e.target.value)}
                className="w-full px-3 py-1 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Max Speed</label>
              <input
                type="number"
                min="1"
                max="14"
                value={filters.maxSpeed}
                onChange={(e) => handleFilterChange("maxSpeed", e.target.value)}
                className="w-full px-3 py-1 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Min Weight (g)</label>
              <input
                type="number"
                min="140"
                max="180"
                value={filters.minWeight}
                onChange={(e) => handleFilterChange("minWeight", e.target.value)}
                className="w-full px-3 py-1 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Max Weight (g)</label>
              <input
                type="number"
                min="140"
                max="180"
                value={filters.maxWeight}
                onChange={(e) => handleFilterChange("maxWeight", e.target.value)}
                className="w-full px-3 py-1 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Plastic Type</label>
              <input
                type="text"
                value={filters.plasticType}
                onChange={(e) => handleFilterChange("plasticType", e.target.value)}
                className="w-full px-3 py-1 border rounded"
                placeholder="e.g., Star"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Condition</label>
              <select
                value={filters.condition}
                onChange={(e) => handleFilterChange("condition", e.target.value)}
                className="w-full px-3 py-1 border rounded"
              >
                <option value="">All</option>
                <option value="new">New</option>
                <option value="like_new">Like New</option>
                <option value="used">Used</option>
                <option value="heavily_used">Heavily Used</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Min Price ($)</label>
              <input
                type="number"
                min="0"
                value={filters.minPrice}
                onChange={(e) => handleFilterChange("minPrice", e.target.value)}
                className="w-full px-3 py-1 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Max Price ($)</label>
              <input
                type="number"
                min="0"
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
                className="w-full px-3 py-1 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Sort By</label>
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange("sortBy", e.target.value)}
                className="w-full px-3 py-1 border rounded"
              >
                <option value="created_at">Date Added</option>
                <option value="price_cents">Price</option>
                <option value="brand">Brand</option>
                <option value="model">Model</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Order</label>
              <select
                value={filters.sortOrder}
                onChange={(e) => handleFilterChange("sortOrder", e.target.value as "asc" | "desc")}
                className="w-full px-3 py-1 border rounded"
              >
                <option value="desc">Descending</option>
                <option value="asc">Ascending</option>
              </select>
            </div>
          </div>
        )}
      </form>

      <div className="mb-4 text-sm text-gray-600">
        Found {total} disc{total !== 1 ? "s" : ""}
      </div>

      {discs.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No discs found. Try adjusting your search filters.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {discs.map((disc) => (
              <div
                key={disc.id}
                className="border rounded-lg p-4 hover:shadow-lg transition-shadow"
              >
                {disc.image_urls && disc.image_urls.length > 0 && (
                  <img
                    src={disc.image_urls[0]}
                    alt={`${disc.brand} ${disc.model}`}
                    className="w-full h-48 object-cover rounded mb-4"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                )}
                <h3 className="text-xl font-semibold mb-2">
                  {disc.brand} {disc.model}
                </h3>
                <div className="text-sm space-y-1 mb-4">
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
                  <p className="text-lg font-bold text-blue-600">
                    ${(disc.price_cents / 100).toFixed(2)}
                  </p>
                </div>
                {disc.description && (
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{disc.description}</p>
                )}
                <Link
                  href={`/products/${disc.id}`}
                  className="block w-full text-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  View Details
                </Link>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border rounded disabled:opacity-50"
              >
                Previous
              </button>
              <span className="px-4 py-2">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
