import Link from "next/link";
import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";
import { useState } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export default function LoginPage() {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();

  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  const data = await res.json();

  if (res.ok) {
    alert("Login successful!");
    localStorage.setItem("token", data.token);
    window.location.href = "/dashboard";
  } else {
    alert(`Login failed: ${data.message}`);
  }
};

  return (
    <main className="min-h-screen flex items-center justify-center bg-white px-6">
      <div className="w-full max-w-xs space-y-6">
        <h1 className="text-3xl font-semibold text-center">SmileSpotter</h1>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-700 mb-1">Username:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              className="w-full px-3 py-2 border-b border-gray-300 focus:outline-none focus:border-black placeholder-gray-400 text-black"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full px-3 py-2 border-b border-gray-300 focus:outline-none focus:border-black placeholder-gray-400 text-black"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 mt-2 bg-yellow-400 text-black rounded-full text-sm font-semibold"
          >
            Log In
          </button>

          <p className="text-sm text-center text-gray-600 mt-2">
            Don’t have an account?{" "}
            <Link href="/signup" className="text-blue-600 underline">
              Sign Up
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}
