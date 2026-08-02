import React from "react";
import { useRoute, Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Masthead } from "@/components/Masthead";
import { GeolocationGate } from "@/components/GeolocationGate";
import { formatDistanceToNow } from "date-fns";
import { ChevronLeft } from "lucide-react";

export default function ArticlePage() {
  const [match, params] = useRoute("/article/:id");
  const { data: article, isLoading } = trpc.articles.getById.useQuery(
    { id: params?.id || "" },
    { enabled: !!params?.id }
  );

  if (!match) return null;

  if (isLoading) {
    return (
      <GeolocationGate>
        <div className="min-h-screen bg-white">
          <Masthead />
          <div className="container mx-auto px-4 py-12">
            <div className="animate-pulse">
              <div className="h-96 bg-gray-300 rounded mb-8"></div>
              <div className="h-8 bg-gray-300 rounded mb-4 w-3/4"></div>
              <div className="h-4 bg-gray-300 rounded mb-4"></div>
              <div className="h-4 bg-gray-300 rounded mb-4"></div>
            </div>
          </div>
        </div>
      </GeolocationGate>
    );
  }

  if (!article) {
    return (
      <GeolocationGate>
        <div className="min-h-screen bg-white">
          <Masthead />
          <div className="container mx-auto px-4 py-12 text-center">
            <h1 className="text-3xl font-bold text-[#1A1A1A] mb-4">Article Not Found</h1>
            <Link href="/" className="text-[#BB1919] hover:underline">
              Back to Home
            </Link>
          </div>
        </div>
      </GeolocationGate>
    );
  }

  return (
    <GeolocationGate>
      <div className="min-h-screen bg-white">
        <Masthead />

        <article className="py-8 border-b border-gray-200">
          <div className="container mx-auto px-4 max-w-4xl">
            {/* Back button */}
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-[#BB1919] hover:text-[#8B0000] mb-8 transition"
            >
              <ChevronLeft className="h-4 w-4" />
              Back to Home
            </Link>

            {/* Category and metadata */}
            <div className="mb-6">
              <span className="inline-block bg-[#BB1919] text-white px-3 py-1 text-xs font-bold uppercase tracking-wide rounded mb-4">
                {article.category}
              </span>
              <h1 className="text-5xl font-bold text-[#1A1A1A] mb-4 leading-tight">
                {article.title}
              </h1>
              <div className="flex items-center gap-4 text-gray-600">
                <span className="font-semibold">By {article.author}</span>
                <span>•</span>
                <span>{formatDistanceToNow(new Date(article.publishedAt), { addSuffix: true })}</span>
              </div>
            </div>

            {/* Featured image */}
            <div className="mb-8 rounded-lg overflow-hidden shadow-lg">
              <img
                src={article.coverImageUrl}
                alt={article.title}
                className="w-full h-96 object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='400'%3E%3Crect fill='%23e5e7eb' width='800' height='400'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%236b7280' font-size='24'%3EImage not available%3C/text%3E%3C/svg%3E";
                }}
              />
            </div>

            {/* Article content */}
            <div className="prose prose-lg max-w-none">
              <div className="text-lg text-gray-700 leading-relaxed whitespace-pre-wrap">
                {article.content}
              </div>
            </div>

            {/* Related articles section */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <h2 className="text-2xl font-bold text-[#1A1A1A] mb-6">More from {article.category}</h2>
              <Link
                href={`/category/${article.category.toLowerCase()}`}
                className="inline-block bg-[#BB1919] text-white px-6 py-3 font-semibold rounded hover:bg-[#8B0000] transition"
              >
                View All {article.category} Articles
              </Link>
            </div>
          </div>
        </article>

        {/* Footer */}
        <footer className="bg-[#1A1A1A] text-white py-8">
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
