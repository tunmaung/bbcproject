import React from "react";
import { trpc } from "@/lib/trpc";
import { AlertCircle } from "lucide-react";

export function BreakingStrip() {
  const { data: breakingArticle } = trpc.articles.breaking.useQuery();

  if (!breakingArticle) {
    return null;
  }

  return (
    <div className="bg-[#B80000] text-white border-y border-[#8B0000]">
      <div className="max-w-[1280px] mx-auto flex items-center overflow-hidden">
        {/* Breaking Badge */}
        <div className="flex items-center gap-2 bg-black px-5 py-3 flex-shrink-0">
          <AlertCircle className="h-5 w-5 text-red-500 animate-pulse" />
          <span className="font-bold uppercase tracking-wider text-sm">
            Breaking
          </span>
        </div>

        {/* Scrolling Headline */}
        <div className="relative flex-1 overflow-hidden">
          <div className="whitespace-nowrap animate-marquee px-6 py-3">
            <span className="text-sm md:text-base font-medium">
              {breakingArticle.title}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
