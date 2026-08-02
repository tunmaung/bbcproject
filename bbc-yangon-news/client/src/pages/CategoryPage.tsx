import React from "react";
import { useRoute, Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Masthead } from "@/components/Masthead";
import { GeolocationGate } from "@/components/GeolocationGate";
import { formatDistanceToNow } from "date-fns";
import { ChevronLeft } from "lucide-react";

const CATEGORIES = ["Myanmar", "World", "Politics", "Business", "Sport", "Culture"];

export default function CategoryPage() {
  const [match, params] = useRoute("/category/:slug");
  const slug = params?.slug?.toUpperCase() || "";
  const category = CATEGORIES.find((c) => c.toLowerCase() === slug.toLowerCase());

  const { data: articles, isLoading } = trpc.articles.list.useQuery(
    { category: category as any },
    { enabled: !!category }
  );

  if (!match) return null;

  if (!category) {
    return (
      <GeolocationGate>
        <div className="min-h-screen bg-white">
          <Masthead />
          <div className="container mx-auto px-4 py-12 text-center">
            <h1 className="text-3xl font-bold text-[#1A1A1A] mb-4">Category Not Found</h1>
            <Link href="/" className="text-[#BB1919] hover:underline">
              Back to Home
            </Link>
          </div>
        </div>
      </GeolocationGate>
    );
  }

  if (isLoading) {
    return (
      <GeolocationGate>
        <div className="min-h-screen bg-white">
          <Masthead />
          <div className="container mx-auto px-4 py-12">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-300 rounded mb-8 w-1/3"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i}>
                    <div className="bg-gray-300 h-48 rounded mb-4"></div>
                    <div className="bg-gray-300 h-6 rounded mb-2"></div>
                    <div className="bg-gray-300 h-4 rounded"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </GeolocationGate>
    );
  }

  return (
    <GeolocationGate>
      <div className="min-h-screen bg-white">
        <Masthead />

        <div className="container mx-auto px-4 py-12">
          {/* Header */}
          <div className="mb-12">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-[#BB1919] hover:text-[#8B0000] mb-6 transition"
            >
              <ChevronLeft className="h-4 w-4" />
              Back to Home
            </Link>
            <h1 className="text-4xl font-bold text-[#1A1A1A] mb-2 pb-4 border-l-4 border-[#BB1919] pl-4">
              {category}
            </h1>
            <p className="text-gray-600">
              {articles?.length || 0} article{articles?.length !== 1 ? "s" : ""} in this category
            </p>
          </div>

          {/* Articles grid */}
          {articles && articles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((article) => (
                <Link
                  key={article.id}
                  href={`/article/${article.id}`}
                  className="group cursor-pointer block"
                >
                  <div className="overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow">
                    <div className="relative overflow-hidden bg-gray-200 h-48">
                      <img
                        src={article.coverImageUrl}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect fill='%23e5e7eb' width='400' height='300'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%236b7280' font-size='16'%3EImage not available%3C/text%3E%3C/svg%3E";
                        }}
                      />
                    </div>
                    <div className="p-4">
                      <div className="mb-2">
                        <span className="text-xs font-bold uppercase text-[#BB1919] tracking-wide">
                          {article.category}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-[#1A1A1A] mb-2 line-clamp-2 group-hover:text-[#BB1919] transition">
                        {article.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                        {article.content.substring(0, 100)}...
                      </p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{article.author}</span>
                        <span>{formatDistanceToNow(new Date(article.publishedAt), { addSuffix: true })}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No articles found in this category.</p>
              <Link href="/" className="text-[#BB1919] hover:underline mt-4 inline-block">
                Back to Home
              </Link>
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="bg-[#1A1A1A] text-white py-8 mt-12">
          <div className="container mx-auto px-4 text-center">
            <p className="text-sm text-gray-400 mb-2">
              © 2026 BBC Yangon News. Demo — not affiliated with BBC.
            </p>
          </div>
        </footer>
      </div>
    </GeolocationGate>
  );
}
