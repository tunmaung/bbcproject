import React from "react";
import { Masthead } from "@/components/Masthead";
import { BreakingStrip } from "@/components/BreakingStrip";
import { HeroSection } from "@/components/HeroSection";
import { CategoryGrid } from "@/components/CategoryGrid";
import { GeolocationGate } from "@/components/GeolocationGate";

export default function Home() {
  return (
    <GeolocationGate>
      <div className="min-h-screen bg-white">
        <Masthead />
        <BreakingStrip />
        <HeroSection />
        <CategoryGrid />

        {/* Footer */}
        <footer className="bg-[#1A1A1A] text-white py-8 mt-12">
          <div className="container mx-auto px-4 text-center">
            <p className="text-sm text-gray-400 mb-2">
              © 2026 BBC Yangon News. Demo — not affiliated with BBC.
            </p>
            <p className="text-xs text-gray-500">
              This is a demonstration website showcasing BBC-inspired editorial design.
            </p>
          </div>
        </footer>
      </div>
    </GeolocationGate>
  );
}
