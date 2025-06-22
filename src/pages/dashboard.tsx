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
    <main className="min-h-screen bg-white">
      <h1 className="text-2xl font-semibold text-center text-black my-4">Smiley Spotter Map</h1>
      <div className="h-[80vh] w-full px-4">
        <Map center={center} />
      </div>
    </main>
  );
}