import React from "react";
import { Link } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";
import { Button } from "@/components/ui/button";

const CATEGORIES = ["Myanmar", "World", "Politics", "Business", "Sport", "Culture"];

export function Masthead() {
  const { user, logout } = useAuth();

  return (
    <header className="bg-[#BB1919] text-white sticky top-0 z-40 shadow-md">
<div className="w-full">
  <div className="max-w-[1280px] mx-auto px-6">
        {/* Top bar with logo and auth */}
        <div className="flex items-center justify-between h-16">

<Link href="/" className="flex items-center gap-3">
  <div className="flex">
    <span className="bg-black text-white font-black px-2 py-1 text-lg">B</span>
    <span className="bg-black text-white font-black px-2 py-1 text-lg">B</span>
    <span className="bg-black text-white font-black px-2 py-1 text-lg">C</span>
  </div>

  <div className="leading-tight">
    <div className="text-xl font-bold text-white">
      YANGON NEWS
    </div>

    <div className="text-[11px] tracking-widest text-red-100">
      MYANMAR
    </div>
  </div>
</Link>
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <span className="text-sm text-gray-100">Welcome, {user.name || "User"}</span>
                <Link href="/admin" className="text-sm font-semibold hover:text-gray-100 transition">
                  Admin
                </Link>
                <Button
                  onClick={() => logout()}
                  variant="outline"
                  size="sm"
                  className="text-white border-white hover:bg-[#8B0000]"
                >
                  Logout
                </Button>
              </>
            ) : (
              <Button
                onClick={() => startLogin()}
                variant="outline"
                size="sm"
                className="text-white border-white hover:bg-[#8B0000]"
              >
                Admin Login
              </Button>
            )}
          </div>
        </div>

        {/* Navigation categories */}
        <nav className="border-t border-[#8B0000] flex overflow-x-auto">
          <Link href="/" className="px-4 py-3 text-sm font-semibold hover:bg-[#8B0000] transition whitespace-nowrap">
            Home
          </Link>
          {CATEGORIES.map((category) => (
            <Link
              key={category}
              href={`/category/${category.toLowerCase()}`}
              className="px-4 py-3 text-sm font-semibold hover:bg-[#8B0000] transition whitespace-nowrap"
            >
              {category}
            </Link>
          ))}
        </nav>
</div>
      </div>
    </header>
  );
}
