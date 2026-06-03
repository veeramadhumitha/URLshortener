import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";

import API from "../api/axios";
import AuthLayout from "../components/layout/AuthLayout";

function Login() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const { data } = await API.post("/auth/login", form);

      localStorage.setItem("token", data.token);

      navigate("/dashboard");
    } catch (err) {
      alert(
        err?.response?.data?.message ||
        "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div>

        {/* Header */}
        <div className="text-center mb-6">

          <div
            className="w-14 h-14 mx-auto rounded-2xl flex items-center justify-center mb-3 shadow-xl shadow-indigo-500/30"
            style={{
              background:
                "linear-gradient(135deg,#6366f1,#a855f7)",
            }}
          >
            <span className="text-xl">🔗</span>
          </div>

          <h2 className="text-4xl font-bold text-slate-900 dark:text-white">
            Welcome Back
          </h2>

          <p className="mt-3 text-slate-500 dark:text-slate-400">
            Sign in to manage your URLs and analytics
          </p>

        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          {/* Inputs */}
          <div className="space-y-4">

            {/* Email */}
            <div>

              <label className="block mb-4 text-sm font-medium text-slate-900 dark:text-slate-300">
                Email Address
              </label>

              <div className="relative">

                <Mail
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="email"
                  name="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="w-full h-11 pl-12 pr-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />

              </div>

            </div>

            {/* Password */}
            <div>

              <label className="block mb-4 text-sm font-medium text-slate-900 dark:text-slate-300">
                Password
              </label>

              <div className="relative">

                <Lock
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  name="password"
                  required
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full h-11 pl-12 pr-14 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      !showPassword
                    )
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>

              </div>

            </div>

          </div>

          {/* Remember Me */}
          <div className="flex justify-between items-center">

            <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
              <input type="checkbox" />
              Remember me
            </label>

            <Link
              to="/forgot"
              className="text-sm text-indigo-500 hover:text-indigo-400"
            >
              Forgot Password?
            </Link>

          </div>

          {/* Buttons */}
          <div className="grid md:grid-cols-2 gap-3">

            <button
              type="submit"
              disabled={loading}
              className="h-12 rounded-xl font-semibold text-white shadow-lg shadow-indigo-500/30 hover:scale-[1.01] transition-all"
              style={{
                background:
                  "linear-gradient(135deg,#6366f1,#a855f7)",
              }}
            >
              {loading
                ? "Signing In..."
                : "Sign In"}
            </button>

            <div className="grid grid-cols-2 gap-3">

              <button
                type="button"
                className="h-12 rounded-xl border border-slate-300 dark:border-slate-700 hover:border-indigo-500 transition flex items-center justify-center gap-2"
              >
                <img
                  src="https://www.svgrepo.com/show/475656/google-color.svg"
                  alt="Google"
                  className="w-5 h-5"
                />
                Google
              </button>

              <button
                type="button"
                className="h-12 rounded-xl border border-slate-300 dark:border-slate-700 hover:border-indigo-500 transition flex items-center justify-center gap-2"
              >
                <img
                  src="https://github.githubassets.com/favicons/favicon.svg"
                  alt="GitHub"
                  className="w-5 h-5"
                />
                GitHub
              </button>

            </div>

          </div>

          {/* Signup Link */}
          <p className="text-center text-slate-500 pt-1">

            Don't have an account?{" "}

            <Link
              to="/signup"
              className="text-indigo-500 font-semibold hover:text-indigo-400"
            >
              Create Account
            </Link>

          </p>

        </form>

      </div>
    </AuthLayout>
  );
}

export default Login;