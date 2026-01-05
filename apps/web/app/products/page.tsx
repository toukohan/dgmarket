import { getDiscs } from "@/actions/discActions";
import DiscSearch from "@/components/DiscSearch";
import type { PublicDisc } from "../../../../packages/types/disc";

interface DiscSearchResponse {
  discs: PublicDisc[];
  total: number;
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const filters = {
    brand: searchParams.brand as string | undefined,
    model: searchParams.model as string | undefined,
    minSpeed: searchParams.minSpeed ? parseInt(searchParams.minSpeed as string) : undefined,
    maxSpeed: searchParams.maxSpeed ? parseInt(searchParams.maxSpeed as string) : undefined,
    minGlide: searchParams.minGlide ? parseInt(searchParams.minGlide as string) : undefined,
    maxGlide: searchParams.maxGlide ? parseInt(searchParams.maxGlide as string) : undefined,
    minTurn: searchParams.minTurn ? parseFloat(searchParams.minTurn as string) : undefined,
    maxTurn: searchParams.maxTurn ? parseFloat(searchParams.maxTurn as string) : undefined,
    minFade: searchParams.minFade ? parseFloat(searchParams.minFade as string) : undefined,
    maxFade: searchParams.maxFade ? parseFloat(searchParams.maxFade as string) : undefined,
    minWeight: searchParams.minWeight ? parseInt(searchParams.minWeight as string) : undefined,
    maxWeight: searchParams.maxWeight ? parseInt(searchParams.maxWeight as string) : undefined,
    plasticType: searchParams.plasticType as string | undefined,
    condition: searchParams.condition as string | undefined,
    minPrice: searchParams.minPrice ? parseInt(searchParams.minPrice as string) : undefined,
    maxPrice: searchParams.maxPrice ? parseInt(searchParams.maxPrice as string) : undefined,
    search: searchParams.search as string | undefined,
    limit: searchParams.limit ? parseInt(searchParams.limit as string) : 20,
    offset: searchParams.offset ? parseInt(searchParams.offset as string) : 0,
    sortBy: (searchParams.sortBy as string) || "created_at",
    sortOrder: (searchParams.sortOrder as "asc" | "desc") || "desc",
  };

  let result: DiscSearchResponse = { discs: [], total: 0 };
  try {
    result = await getDiscs(filters);
  } catch (error) {
    console.error("Failed to load discs:", error);
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Browse Disc Golf Discs</h1>
      <DiscSearch initialDiscs={result.discs} total={result.total} />
    </main>
  );
}
