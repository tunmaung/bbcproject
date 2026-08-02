import React from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { formatDistanceToNow } from "date-fns";

const CATEGORIES = ["Myanmar", "World", "Politics", "Business", "Sport", "Culture"];

export function CategoryGrid() {
  const { data: articles, isLoading } = trpc.articles.list.useQuery({});

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-300 h-48 rounded mb-4"></div>
              <div className="bg-gray-300 h-6 rounded mb-2"></div>
              <div className="bg-gray-300 h-4 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const groupedArticles = CATEGORIES.reduce(
    (acc, category) => {
      acc[category] = articles?.filter((a) => a.category === category) || [];
      return acc;
    },
    {} as Record<string, typeof articles>
  );

  return (
    <div className="bg-white py-12">
      {CATEGORIES.map((category) => {
        const categoryArticles = groupedArticles[category] || [];
        if (categoryArticles.length === 0) return null;

        return (
          <section key={category} className="border-b border-gray-200 last:border-b-0">
            <div className="container mx-auto px-4 py-8">
              <h2 className="text-3xl font-bold text-[#1A1A1A] mb-6 pb-4 border-l-4 border-[#BB1919] pl-4">
                {category}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categoryArticles.map((article) => (
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
            </div>
          </section>
        );
      })}
    </div>
  );
}
