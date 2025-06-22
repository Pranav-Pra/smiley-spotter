import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import type { LatLngExpression } from 'leaflet';

const Map = dynamic(() => import("@/components/map"), {
  ssr: false,
});

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [center, setCenter] = useState<LatLngExpression>([37.7749, -122.4194]); //SF is defaultt

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/"); // if no token, redirect to login
    } else {
      setLoading(false);
      //user location
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((pos) => {
            setCenter([pos.coords.latitude, pos.coords.longitude]);
            });
        }
    }
  }, [router]);

  if (loading) return <p className="text-center p-6">Loading...</p>;

  return (
    <main className="min-h-screen bg-white relative">
      <h1 className="text-2xl font-semibold text-center text-black my-4">Points</h1>
      <div className="h-[80vh] w-full px-4">
        <Map center={center} />
      </div>
    <div className="absolute bottom-6 right-6 z-[1000]">
    <button onClick={() => router.push("/camera")}>
        <img
        src="/yellowsmileyface.png"
        alt="Add Pin"
        className="w-20 h-20 object-contain drop-shadow-md hover:scale-105 w-20 h-20 object-contain drop-shadow-md transition-transform hover:scale-105 hover:brightness-9transition-transform"
        />
    </button>
    </div>
    <button
    onClick={() => {
        localStorage.removeItem("token");
        router.push("/");
    }}
    className="absolute top-4 right-4 bg-yellow-400 text-white px-2 py-0 rounded shadow hover:bg-red-600 transition"
    >
    Sign Out
    </button>
    </main>
  );
}