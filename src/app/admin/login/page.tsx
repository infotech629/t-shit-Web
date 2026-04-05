"use client";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Eye, EyeOff, Lock } from "lucide-react";

export default function AdminLoginPage() {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setTimeout(() => {
      const ok = login(username, password);
      if (!ok) setError("Invalid username or password.");
      setLoading(false);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="text-3xl font-black text-white tracking-tighter mb-1">
            THREAD<span className="text-yellow-400">CO</span>
          </div>
          <p className="text-gray-400 text-sm">Admin Panel</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl p-8">
          <div className="flex items-center justify-center w-12 h-12 bg-yellow-400 rounded-2xl mb-6 mx-auto">
            <Lock size={22} className="text-black" />
          </div>
          <h1 className="text-2xl font-black text-center mb-1">Welcome Back</h1>
          <p className="text-gray-400 text-sm text-center mb-6">Sign in to your admin account</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-1.5">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                required
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  required
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 pr-11 text-sm focus:outline-none focus:border-black transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black"
                >
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-red-500 text-sm bg-red-50 px-4 py-2.5 rounded-xl">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white font-bold py-3.5 rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="mt-6 p-4 bg-gray-50 rounded-xl">
            <p className="text-xs text-gray-400 font-semibold mb-1">Demo Credentials</p>
            <p className="text-xs text-gray-500">Username: <span className="font-mono font-bold text-black">admin</span></p>
            <p className="text-xs text-gray-500">Password: <span className="font-mono font-bold text-black">threadco@123</span></p>
          </div>
        </div>
      </div>
    </div>
  );
}
