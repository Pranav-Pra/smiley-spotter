import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/"); // if no token, redirect to login
    } else {
      setLoading(false);
    }
  }, [router]);

  if (loading) return <p className="text-center p-6">Loading...</p>;

  return (
    <main className="min-h-screen flex items-center justify-center bg-white px-6">
      <h1 className="text-3xl font-bold text-center text-black">Dashboard</h1>
    </main>
  );
}