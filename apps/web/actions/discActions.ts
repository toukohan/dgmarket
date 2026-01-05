"use server";

const API_URL = process.env.API_URL || "http://localhost:4000/api";

export async function getDiscs(filters?: {
  brand?: string;
  model?: string;
  minSpeed?: number;
  maxSpeed?: number;
  minGlide?: number;
  maxGlide?: number;
  minTurn?: number;
  maxTurn?: number;
  minFade?: number;
  maxFade?: number;
  minWeight?: number;
  maxWeight?: number;
  plasticType?: string;
  condition?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  limit?: number;
  offset?: number;
  sortBy?: string;
  sortOrder?: string;
}) {
  const params = new URLSearchParams();
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        params.append(key, String(value));
      }
    });
  }

  const url = `${API_URL}/discs/search?${params.toString()}`;
  const response = await fetch(url, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch discs");
  }

  return response.json();
}

export async function getDiscById(id: number) {
  const response = await fetch(`${API_URL}/discs/${id}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch disc");
  }

  return response.json();
}
