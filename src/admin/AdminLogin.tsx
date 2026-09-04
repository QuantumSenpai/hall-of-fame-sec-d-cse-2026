import React, { useState } from "react";
import { motion } from "framer-motion";
import { Lock, ShieldCheck, X } from "lucide-react";
import { adminLogin } from "../lib/api.ts";

interface AdminLoginProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await adminLogin(username, password);
      setLoading(false);
      if (res.token) {
        onSuccess();
      } else {
        setError(res.error || "Invalid credentials.");
      }
    } catch (err) {
      setLoading(false);
      setError("Connection failed. Please check backend server.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#070204]/90 backdrop-blur-md flex items-center justify-center p-4">
      <motion.div
        className="relative w-full max-w-md bg-[#16060b] border border-[rgba(201,164,99,0.35)] p-8 rounded-2xl shadow-[0_25px_80px_rgba(0,0,0,0.9),0_0_40px_rgba(201,164,99,0.12)] text-[#f2e8d5]"
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[rgba(242,232,213,0.5)] hover:text-[#f2e8d5] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-2 mb-6">
          <div className="w-12 h-12 bg-[#220912] border border-[#c9a463] rounded-full flex items-center justify-center mx-auto text-[#c9a463] shadow-[0_0_15px_rgba(201,164,99,0.25)]">
            <Lock className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-2xl font-bold text-[#f2e8d5]">
            Admin Authentication
          </h3>
          <p className="font-sans text-xs text-[rgba(201,164,99,0.7)]">
            Enter your CMS administrator credentials to manage content.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-950/80 border border-red-700 text-red-200 text-xs rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 font-sans">
          <div>
            <label className="block text-xs uppercase tracking-wider text-[#c9a463] mb-1 font-semibold">
              Username
            </label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#220a12] border border-[rgba(201,164,99,0.3)] rounded-lg text-sm text-[#f2e8d5] focus:outline-none focus:border-[#c9a463] transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-[#c9a463] mb-1 font-semibold">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="teachersday2026"
              className="w-full px-3.5 py-2.5 bg-[#220a12] border border-[rgba(201,164,99,0.3)] rounded-lg text-sm text-[#f2e8d5] focus:outline-none focus:border-[#c9a463] transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-gradient-to-r from-[#c9a463] to-[#b88d48] text-[#0e0407] font-bold text-xs uppercase tracking-wider rounded-lg hover:brightness-110 transition-all shadow-[0_2px_15px_rgba(201,164,99,0.3)] flex items-center justify-center space-x-2"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>
              {loading ? "Authenticating..." : "Sign In to Dashboard"}
            </span>
          </button>
        </form>
      </motion.div>
    </div>
  );
};
