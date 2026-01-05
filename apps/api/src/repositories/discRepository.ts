import pool from "../database";
import { DiscRow, DiscSearchFilters } from "@/types/disc";

export async function createDisc(
  sellerId: number,
  discData: {
    brand: string;
    model: string;
    speed: number;
    glide: number;
    turn: number;
    fade: number;
    weight_grams: number;
    plastic_type: string;
    condition: string;
    price_cents: number;
    description?: string;
    image_urls?: string[];
    hidden?: boolean;
    sold?: boolean;
  }
): Promise<DiscRow> {
  const { rows } = await pool.query(
    `
    INSERT INTO discs (
      seller_id, brand, model, speed, glide, turn, fade,
      weight_grams, plastic_type, condition, price_cents,
      description, image_urls, hidden, sold
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
    RETURNING *
    `,
    [
      sellerId,
      discData.brand,
      discData.model,
      discData.speed,
      discData.glide,
      discData.turn,
      discData.fade,
      discData.weight_grams,
      discData.plastic_type,
      discData.condition,
      discData.price_cents,
      discData.description || null,
      discData.image_urls || [],
      discData.hidden || false,
      discData.sold || false,
    ]
  );
  return rows[0];
}

export async function findDiscById(id: number): Promise<DiscRow | null> {
  const { rows } = await pool.query(
    `SELECT * FROM discs WHERE id = $1`,
    [id]
  );
  return rows[0] || null;
}

export async function findDiscsBySeller(sellerId: number): Promise<DiscRow[]> {
  const { rows } = await pool.query(
    `SELECT * FROM discs WHERE seller_id = $1 ORDER BY created_at DESC`,
    [sellerId]
  );
  return rows;
}

export async function updateDisc(
  id: number,
  sellerId: number,
  updates: Partial<{
    brand: string;
    model: string;
    speed: number;
    glide: number;
    turn: number;
    fade: number;
    weight_grams: number;
    plastic_type: string;
    condition: string;
    price_cents: number;
    description: string | null;
    image_urls: string[];
    hidden: boolean;
    sold: boolean;
  }>
): Promise<DiscRow | null> {
  const fields: string[] = [];
  const values: any[] = [];
  let paramIndex = 1;

  Object.entries(updates).forEach(([key, value]) => {
    if (value !== undefined) {
      fields.push(`${key} = $${paramIndex}`);
      values.push(value);
      paramIndex++;
    }
  });

  if (fields.length === 0) {
    return findDiscById(id);
  }

  values.push(id, sellerId);
  const { rows } = await pool.query(
    `
    UPDATE discs
    SET ${fields.join(", ")}
    WHERE id = $${paramIndex} AND seller_id = $${paramIndex + 1}
    RETURNING *
    `,
    values
  );
  return rows[0] || null;
}

export async function deleteDisc(id: number, sellerId: number): Promise<boolean> {
  const { rowCount } = await pool.query(
    `DELETE FROM discs WHERE id = $1 AND seller_id = $2`,
    [id, sellerId]
  );
  return rowCount > 0;
}

export async function searchDiscs(filters: DiscSearchFilters): Promise<{ discs: DiscRow[]; total: number }> {
  const conditions: string[] = [];
  const values: any[] = [];
  let paramIndex = 1;

  // Always exclude hidden and sold discs from public searches
  conditions.push(`hidden = FALSE`);
  conditions.push(`sold = FALSE`);

  if (filters.brand) {
    conditions.push(`brand ILIKE $${paramIndex}`);
    values.push(`%${filters.brand}%`);
    paramIndex++;
  }

  if (filters.model) {
    conditions.push(`model ILIKE $${paramIndex}`);
    values.push(`%${filters.model}%`);
    paramIndex++;
  }

  if (filters.minSpeed !== undefined) {
    conditions.push(`speed >= $${paramIndex}`);
    values.push(filters.minSpeed);
    paramIndex++;
  }

  if (filters.maxSpeed !== undefined) {
    conditions.push(`speed <= $${paramIndex}`);
    values.push(filters.maxSpeed);
    paramIndex++;
  }

  if (filters.minGlide !== undefined) {
    conditions.push(`glide >= $${paramIndex}`);
    values.push(filters.minGlide);
    paramIndex++;
  }

  if (filters.maxGlide !== undefined) {
    conditions.push(`glide <= $${paramIndex}`);
    values.push(filters.maxGlide);
    paramIndex++;
  }

  if (filters.minTurn !== undefined) {
    conditions.push(`turn >= $${paramIndex}`);
    values.push(filters.minTurn);
    paramIndex++;
  }

  if (filters.maxTurn !== undefined) {
    conditions.push(`turn <= $${paramIndex}`);
    values.push(filters.maxTurn);
    paramIndex++;
  }

  if (filters.minFade !== undefined) {
    conditions.push(`fade >= $${paramIndex}`);
    values.push(filters.minFade);
    paramIndex++;
  }

  if (filters.maxFade !== undefined) {
    conditions.push(`fade <= $${paramIndex}`);
    values.push(filters.maxFade);
    paramIndex++;
  }

  if (filters.minWeight !== undefined) {
    conditions.push(`weight_grams >= $${paramIndex}`);
    values.push(filters.minWeight);
    paramIndex++;
  }

  if (filters.maxWeight !== undefined) {
    conditions.push(`weight_grams <= $${paramIndex}`);
    values.push(filters.maxWeight);
    paramIndex++;
  }

  if (filters.plasticType) {
    conditions.push(`plastic_type ILIKE $${paramIndex}`);
    values.push(`%${filters.plasticType}%`);
    paramIndex++;
  }

  if (filters.condition) {
    conditions.push(`condition = $${paramIndex}`);
    values.push(filters.condition);
    paramIndex++;
  }

  if (filters.minPrice !== undefined) {
    conditions.push(`price_cents >= $${paramIndex}`);
    values.push(filters.minPrice);
    paramIndex++;
  }

  if (filters.maxPrice !== undefined) {
    conditions.push(`price_cents <= $${paramIndex}`);
    values.push(filters.maxPrice);
    paramIndex++;
  }

  if (filters.search) {
    conditions.push(`(
      brand ILIKE $${paramIndex} OR
      model ILIKE $${paramIndex} OR
      description ILIKE $${paramIndex}
    )`);
    values.push(`%${filters.search}%`);
    paramIndex++;
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

  // Get total count
  const countResult = await pool.query(
    `SELECT COUNT(*) as total FROM discs ${whereClause}`,
    values
  );
  const total = parseInt(countResult.rows[0].total);

  // Get discs with pagination and sorting
  const sortBy = filters.sortBy || "created_at";
  const sortOrder = filters.sortOrder || "desc";
  const limit = filters.limit || 20;
  const offset = filters.offset || 0;

  const query = `
    SELECT * FROM discs
    ${whereClause}
    ORDER BY ${sortBy} ${sortOrder}
    LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
  `;
  values.push(limit, offset);

  const { rows } = await pool.query(query, values);
  return { discs: rows, total };
}
