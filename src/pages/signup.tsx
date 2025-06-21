import Link from "next/link";

export default function SignUpPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-white px-6">
      <div className="w-full max-w-xs space-y-6">
        <h1 className="text-3xl font-semibold text-center">SmileSpotter</h1>

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

          <div>
            <label className="block text-sm text-gray-700 mb-1">Confirm Password:</label>
            <input
              type="password"
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