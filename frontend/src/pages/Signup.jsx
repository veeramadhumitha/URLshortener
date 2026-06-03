import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
Eye,
EyeOff,
User,
Mail,
Lock,
} from "lucide-react";

import API from "../api/axios";
import AuthLayout from "../components/layout/AuthLayout";

function Signup() {
const [loading, setLoading] = useState(false);
const [showPassword, setShowPassword] = useState(false);
const navigate = useNavigate();

const [form, setForm] = useState({
name: "",
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
    const res = await API.post(
      "/auth/register",
      form
    );

    alert(res.data.message);

    // If backend returns token
    if (res.data.token) {
      localStorage.setItem(
        "token",
        res.data.token
      );

      navigate("/dashboard");
    } else {
      navigate("/");
    }
  } catch (error) {
    alert(
      error.response?.data?.message ||
        "Registration failed"
    );
  } finally {
    setLoading(false);
  }
};

// Password Strength Meter
const strength = (() => {
const p = form.password;


let score = 0;

if (p.length >= 6) score++;
if (p.length >= 10) score++;
if (/[A-Z]/.test(p) && /[a-z]/.test(p))
  score++;
if (
  /\d/.test(p) ||
  /[^A-Za-z0-9]/.test(p)
)
  score++;

return score;


})();

const strengthLabel = [
"Too Short",
"Weak",
"Okay",
"Good",
"Strong",
][strength];

const strengthColor = [
"bg-slate-300",
"bg-red-500",
"bg-yellow-500",
"bg-cyan-500",
"bg-emerald-500",
][strength];

return ( <AuthLayout> <div>


    {/* Header */}
    <div className="text-center mb-8">
      <div
        className="w-16 h-16 mx-auto rounded-3xl flex items-center justify-center mb-4 shadow-xl shadow-indigo-500/30"
        style={{
          background:
            "linear-gradient(135deg,#6366f1,#a855f7)",
        }}
      >
        <span className="text-2xl">🚀</span>
      </div>

      <h2 className="text-4xl font-bold text-slate-900 dark:text-white">
        Create Account
      </h2>

      <p className="mt-2 text-slate-500 dark:text-slate-400">
        Start shortening, tracking and analyzing your links.
      </p>
    </div>

    <form
      onSubmit={handleSubmit}
      className="space-y-5"
    >
      {/* Full Name */}
      <div>
        <label className="block mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">
          Full Name
        </label>

        <div className="relative">
          <User
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            placeholder="John Doe"
            className="w-full h-12 pl-12 pr-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Email */}
      <div>
        <label className="block mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">
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
            value={form.email}
            onChange={handleChange}
            required
            placeholder="you@example.com"
            className="w-full h-12 pl-12 pr-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Password */}
      <div>
        <label className="block mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">
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
            value={form.password}
            onChange={handleChange}
            required
            placeholder="Create a strong password"
            className="w-full h-12 pl-12 pr-14 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
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

        {/* Strength Meter */}
        <div className="mt-3">
          <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
            <div
              className={`h-full ${strengthColor}`}
              style={{
                width: `${
                  (strength / 4) * 100
                }%`,
              }}
            />
          </div>

          <p className="text-xs mt-2 text-slate-500 dark:text-slate-400">
            Strength:{" "}
            {form.password
              ? strengthLabel
              : "—"}
          </p>
        </div>
      </div>

      {/* Terms */}
      <label className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
        <input
          type="checkbox"
          required
          className="mt-1"
        />

        <span>
          I agree to the{" "}
          <a
            href="#"
            className="text-indigo-500"
          >
            Terms
          </a>{" "}
          and{" "}
          <a
            href="#"
            className="text-indigo-500"
          >
            Privacy Policy
          </a>
        </span>
      </label>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="w-full h-14 rounded-xl font-semibold text-white shadow-lg shadow-indigo-500/30 hover:scale-[1.02] transition-all"
        style={{
          background:
            "linear-gradient(135deg,#6366f1,#a855f7)",
        }}
      >
        {loading
          ? "Creating Account..."
          : "Create Account"}
      </button>

      {/* Footer */}
      <p className="text-center text-slate-500 dark:text-slate-400">
        Already have an account?{" "}
        <Link
          to="/"
          className="text-indigo-500 font-semibold hover:text-indigo-400"
        >
          Sign In
        </Link>
      </p>
    </form>
  </div>
</AuthLayout>

);
}

export default Signup;
