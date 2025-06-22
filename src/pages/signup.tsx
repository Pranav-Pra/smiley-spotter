import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function SignUpPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();

    if (res.ok) {
      alert("Signup successful!");
      window.location.href = "/";
    } else {
      alert(`Signup failed: ${data.message}`);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-white px-6">
      <div className="w-full max-w-xs space-y-6">
        <div className="flex items-center justify-center space-x-3">
                  <Image
                    src="/yellowsmileyface.png" 
                    alt="Smile Icon"
                    width={64}
                    height={64}
                  />
        <h1 className="text-3xl text-center text-black">SmileSpotter</h1>
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
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

          <div>
            <label className="block text-sm text-gray-700 mb-1">Confirm Password:</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm Password"
              className="w-full px-3 py-2 border-b border-gray-300 focus:outline-none focus:border-black placeholder-gray-400 text-black"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 mt-2 bg-yellow-400 text-black rounded-full text-sm font-semibold"
          >
            Sign Up
          </button>

          <p className="text-sm text-center text-gray-600 mt-2">
            Already have an account?{" "}
            <Link href="/" className="text-blue-600 underline">
              Log In
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}