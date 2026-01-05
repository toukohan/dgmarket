import {
  createDisc,
  findDiscById,
  findDiscsBySeller,
  updateDisc,
  deleteDisc,
  searchDiscs,
} from "../repositories/discRepository";
import { DiscRow, CreateDiscInput, UpdateDiscInput, DiscSearchFilters, PublicDisc } from "@/types/disc";
import { UnauthorizedError, NotFoundError } from "@/api/errors";

function toPublicDisc(disc: DiscRow): PublicDisc {
  return disc;
}

export async function createDiscForSeller(
  sellerId: number,
  discData: CreateDiscInput
): Promise<PublicDisc> {
  const disc = await createDisc(sellerId, discData);
  return toPublicDisc(disc);
}

export async function getDiscById(id: number): Promise<PublicDisc> {
  const disc = await findDiscById(id);
  if (!disc) {
    throw new NotFoundError("Disc not found");
  }
  // Don't show hidden or sold discs in public view
  if (disc.hidden || disc.sold) {
    throw new NotFoundError("Disc not found");
  }
  return toPublicDisc(disc);
}

export async function getDiscsBySeller(sellerId: number): Promise<PublicDisc[]> {
  const discs = await findDiscsBySeller(sellerId);
  return discs.map(toPublicDisc);
}

export async function updateDiscForSeller(
  id: number,
  sellerId: number,
  updates: UpdateDiscInput
): Promise<PublicDisc> {
  const disc = await updateDisc(id, sellerId, updates);
  if (!disc) {
    throw new NotFoundError("Disc not found or you don't have permission to update it");
  }
  return toPublicDisc(disc);
}

export async function removeDisc(id: number, sellerId: number): Promise<void> {
  const deleted = await deleteDisc(id, sellerId);
  if (!deleted) {
    throw new NotFoundError("Disc not found or you don't have permission to delete it");
  }
}

export async function searchDiscsWithFilters(filters: DiscSearchFilters): Promise<{
  discs: PublicDisc[];
  total: number;
}> {
  const result = await searchDiscs(filters);
  return {
    discs: result.discs.map(toPublicDisc),
    total: result.total,
  };
}
