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
      if (res.success) {
        onSuccess();
      } else {
        setError(res.error || "Invalid credentials.");
      }
    } catch (err: any) {
      setLoading(false);
      setError("Connection failed. Please check backend server.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#141615]/90 backdrop-blur-md flex items-center justify-center p-4">
      <motion.div
        className="relative w-full max-w-md bg-[#1E2220] border border-[#B9905A]/40 p-8 rounded-2xl shadow-2xl text-[#EFE6CA]"
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#EFE6CA]/50 hover:text-[#EFE6CA] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-2 mb-6">
          <div className="w-12 h-12 bg-[#292D2B] border border-[#B9905A] rounded-full flex items-center justify-center mx-auto text-[#B9905A] shadow-md">
            <Lock className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-2xl font-bold text-[#EFE6CA]">
            Admin CMS Authentication
          </h3>
          <p className="font-sans text-xs text-[#B9905A]">
            Secured with HTTP-only cookie & rate limiting
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-[#B95F46]/20 border border-[#B95F46] text-[#EFE6CA] text-xs rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 font-sans">
          <div>
            <label className="block text-xs uppercase tracking-wider text-[#B9905A] mb-1 font-semibold">
              Username
            </label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#141615] border border-[#B9905A]/30 rounded-lg text-sm text-[#EFE6CA] focus:outline-none focus:border-[#B9905A] transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-[#B9905A] mb-1 font-semibold">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full px-3.5 py-2.5 bg-[#141615] border border-[#B9905A]/30 rounded-lg text-sm text-[#EFE6CA] focus:outline-none focus:border-[#B9905A] transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-[#B9905A] text-[#141615] font-bold text-xs uppercase tracking-wider rounded-lg hover:bg-[#D4AF77] transition-all shadow-md flex items-center justify-center space-x-2"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>
              {loading ? "Authenticating..." : "Sign In to CMS"}
            </span>
          </button>
        </form>
      </motion.div>
    </div>
  );
};
