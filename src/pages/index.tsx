import Link from "next/link";
import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function LoginPage() {
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
          <h1 className="text-3xl font-quicksand text-center">SmileSpotter</h1>
        </div>

        <form className="space-y-4">
          <div>
            <label className="block text-sm text-gray-700 mb-1">Username:</label>
            <input
              type="text"
              placeholder="Username"
              className="w-full px-3 py-2 border-b border-gray-300 focus:outline-none focus:border-black placeholder-gray-400 text-black"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">Password:</label>
            <input
              type="password"
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
