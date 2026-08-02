import React from "react";
import { useGeolocation } from "@/contexts/GeolocationContext";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

export function GeolocationGate({ children }: { children: React.ReactNode }) {
  const { isGranted, isDenied, isLoading, retry } = useGeolocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Requesting location access...</p>
        </div>
      </div>
    );
  }

  if (isDenied || !isGranted) {
    return (
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50" role="dialog" aria-live="assertive">
        <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full mx-4 text-center">
          <div className="flex justify-center mb-4">
            <AlertCircle className="h-16 w-16 text-[#BB1919]" />
          </div>
          <p className="text-xl font-bold text-[#1A1A1A] mb-6">
            Access Denied: Location permission is required to view BBC Yangon News.
          </p>
          <p className="text-sm text-[#666666] mb-6">
            If you don't see a permission prompt, please check your browser settings and allow location access for this site.
          </p>
          <Button
            onClick={retry}
            className="w-full bg-[#BB1919] hover:bg-[#8B0000] text-white font-semibold py-2 px-4 rounded"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
