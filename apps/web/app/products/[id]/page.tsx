import { getDiscById } from "@/actions/discActions";
import { notFound } from "next/navigation";
import type { PublicDisc } from "../../../../../packages/types/disc";

export default async function DiscDetailPage({
  params,
}: {
  params: { id: string };
}) {
  let disc: PublicDisc;
  try {
    disc = await getDiscById(parseInt(params.id));
  } catch (error) {
    notFound();
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            {disc.image_urls && disc.image_urls.length > 0 ? (
              <div className="space-y-4">
                {disc.image_urls.map((url, idx) => (
                  <img
                    key={idx}
                    src={url}
                    alt={`${disc.brand} ${disc.model} - Image ${idx + 1}`}
                    className="w-full rounded-lg"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                ))}
              </div>
            ) : (
              <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                <span className="text-gray-400">No image available</span>
              </div>
            )}
          </div>

          <div>
            <h1 className="text-3xl font-bold mb-2">
              {disc.brand} {disc.model}
            </h1>
            <div className="text-4xl font-bold text-blue-600 mb-6">
              ${(disc.price_cents / 100).toFixed(2)}
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <h2 className="text-lg font-semibold mb-2">Flight Numbers</h2>
                <div className="flex gap-4 text-2xl">
                  <div>
                    <div className="text-sm text-gray-600">Speed</div>
                    <div className="font-bold">{disc.speed}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Glide</div>
                    <div className="font-bold">{disc.glide}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Turn</div>
                    <div className="font-bold">{disc.turn}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Fade</div>
                    <div className="font-bold">{disc.fade}</div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-600">Weight</div>
                  <div className="font-semibold">{disc.weight_grams}g</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Plastic Type</div>
                  <div className="font-semibold">{disc.plastic_type}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Condition</div>
                  <div className="font-semibold capitalize">
                    {disc.condition.replace("_", " ")}
                  </div>
                </div>
              </div>
            </div>

            {disc.description && (
              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-2">Description</h2>
                <p className="text-gray-700">{disc.description}</p>
              </div>
            )}

            <button className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold">
              Contact Seller
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
