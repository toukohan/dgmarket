export type DiscCondition = "new" | "like_new" | "used" | "heavily_used";

export interface DiscRow {
  id: number;
  seller_id: number;
  brand: string;
  model: string;
  speed: number;
  glide: number;
  turn: number;
  fade: number;
  weight_grams: number;
  plastic_type: string;
  condition: DiscCondition;
  price_cents: number;
  description: string | null;
  image_urls: string[];
  hidden: boolean;
  sold: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface PublicDisc {
  id: number;
  seller_id: number;
  brand: string;
  model: string;
  speed: number;
  glide: number;
  turn: number;
  fade: number;
  weight_grams: number;
  plastic_type: string;
  condition: DiscCondition;
  price_cents: number;
  description: string | null;
  image_urls: string[];
  hidden: boolean;
  sold: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface CreateDiscInput {
  brand: string;
  model: string;
  speed: number;
  glide: number;
  turn: number;
  fade: number;
  weight_grams: number;
  plastic_type: string;
  condition: DiscCondition;
  price_cents: number;
  description?: string;
  image_urls?: string[];
  hidden?: boolean;
  sold?: boolean;
}

export interface UpdateDiscInput {
  brand?: string;
  model?: string;
  speed?: number;
  glide?: number;
  turn?: number;
  fade?: number;
  weight_grams?: number;
  plastic_type?: string;
  condition?: DiscCondition;
  price_cents?: number;
  description?: string;
  image_urls?: string[];
  hidden?: boolean;
  sold?: boolean;
}

export interface DiscSearchFilters {
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
  condition?: DiscCondition;
  minPrice?: number;
  maxPrice?: number;
  search?: string; // Search in brand, model, description
  limit?: number;
  offset?: number;
  sortBy?: "price_cents" | "created_at" | "brand" | "model";
  sortOrder?: "asc" | "desc";
}
