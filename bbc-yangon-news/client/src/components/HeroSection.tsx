import React from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { formatDistanceToNow } from "date-fns";

export function HeroSection() {
  const { data: featured, isLoading } = trpc.articles.featured.useQuery();

  if (isLoading) {
    return (
      <section className="bg-gray-100 py-12">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="animate-pulse h-96 bg-gray-300 rounded-lg"></div>
        </div>
      </section>
    );
  }

  if (!featured) {
    return null;
  }

  return (
    <section className="bg-white py-8 border-b border-gray-200">
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Image */}
          <div className="lg:col-span-6 overflow-hidden rounded-lg shadow-lg">
            <img
              src={featured.coverImageUrl}
              alt={featured.title}
              className="w-full h-[450px] object-cover transition-transform duration-300 hover:scale-105"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Crect fill='%23e5e7eb' width='400' height='400'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%236b7280' font-size='24'%3EImage not available%3C/text%3E%3C/svg%3E";
              }}
            />
          </div>

          {/* Content */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            <div className="mb-4">
              <span className="inline-block bg-[#BB1919] text-white px-3 py-1 text-xs font-bold uppercase tracking-wide rounded">
                {featured.category}
              </span>
            </div>

            <h1 className="text-4xl lg:text-6xl font-extrabold leading-tight text-[#1A1A1A] mb-6">
              {featured.title}
            </h1>

            <p className="text-lg text-gray-600 mb-6 line-clamp-4">
              {featured.content.substring(0, 220)}...
            </p>

            <div className="flex items-center gap-3 text-sm text-gray-500 mb-8">
              <span>By {featured.author}</span>
              <span>•</span>
              <span>
                {formatDistanceToNow(new Date(featured.publishedAt), {
                  addSuffix: true,
                })}
              </span>
            </div>

            <Link
              href={`/article/${featured.id}`}
              className="inline-flex w-fit bg-[#BB1919] px-6 py-3 text-white font-semibold rounded hover:bg-[#8B0000] transition"
            >
              Read Full Story
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
