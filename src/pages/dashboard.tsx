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
  const [totalPoints, setTotalPoints] = useState<number | null>(null);
  const [pins, setPins] = useState<{ lat: number; lng: number }[]>([]);

  useEffect(() => {
  const fetchPointsandPins = async () => {
    try {
      const pointsRes = await fetch("/api/users/points");
      //const pinsRes = await fetch("/api/users/points");
      const pinsRes = await fetch("/api/users/pins");
      if (!pointsRes.ok || !pinsRes.ok) throw new Error("Failed to fetch data");

      const pointsData = await pointsRes.json();
      const pinsData = await pinsRes.json();

      setTotalPoints(pointsData.totalPoints);
      setPins(pinsData.pins || []);
    } catch (err) {
      console.error("Error fetching points:", err);
    } finally {
      setLoading(false);
    }
  };

  fetchPointsandPins();
}, []);

  if (loading) return <p className="text-center p-6">Loading...</p>;

  return (
   <main className="min-h-screen bg-white relative mb-12">
  <div className="flex items-center justify-between px-6 mt-6">
    <div className="flex items-center space-x-4 text-2xl font-semibold text-black">
      <h1 className="text-2xl font-semibold text-black">Points</h1>
      <p>{totalPoints ?? "Loading..."}</p>
    </div>
    <button
      onClick={() => {
        localStorage.removeItem("token");
        router.push("/");
      }}
      className="bg-yellow-400 text-white px-2 py-1 rounded shadow text-sm hover:bg-red-600 transition"
    >
      Sign Out
    </button>
  </div>

  <div className="h-[80vh] w-full px-4 mt-4">
    <Map center={center} pins={pins}/>
  </div>

  <div className="absolute bottom-6 right-6 z-[1000]">
    <button onClick={() => router.push("/camera")}>
      <img
        src="/circle button.PNG"
        alt="Add Pin"
        className="w-20 h-20 object-contain drop-shadow-md hover:scale-105 transition-transform hover:brightness-95"
      />
    </button>
  </div>
</main>
  );
}