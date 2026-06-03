import { useEffect, useState } from "react";
import {
  Link2,
  BarChart3,
  QrCode,
  MousePointerClick,
  Moon,
  Sun,
} from "lucide-react";
import { motion } from "framer-motion";

function AuthLayout({ children }) {
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem("theme");
    return saved ? saved === "dark" : true;
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 overflow-x-hidden relative transition-colors duration-300">
      
      {/* Theme Toggle */}
      <div className="absolute top-6 right-6 z-50">
        <button
          onClick={() => setDark(!dark)}
          className="relative h-10 w-16 rounded-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 flex items-center px-1 shadow-lg"
        >
          <motion.div
            animate={{ x: dark ? 24 : 0 }}
            transition={{
              type: "spring",
              stiffness: 500,
              damping: 30,
            }}
            className="h-8 w-8 rounded-full flex items-center justify-center text-white"
            style={{
              background:
                "linear-gradient(135deg,#6366f1,#a855f7)",
            }}
          >
            {dark ? <Moon size={14} /> : <Sun size={14} />}
          </motion.div>
        </button>
      </div>

      {/* Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-indigo-500/20 rounded-full blur-[180px]" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-cyan-500/20 rounded-full blur-[180px]" />
        <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[180px] -translate-x-1/2 -translate-y-1/2" />
      </div>

      {/* Main Layout */}
      <div className="relative min-h-screen flex items-center justify-between px-6 lg:px-12">

        {/* Left Side */}
        <div className="hidden lg:flex flex-col justify-center max-w-2xl">

          {/* Logo */}
          <div className="flex items-center gap-3 mb-10">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg"
              style={{
                background:
                  "linear-gradient(135deg,#6366f1,#a855f7)",
              }}
            >
              <Link2 size={22} />
            </div>

            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              LINKLY
            </h1>
          </div>

          {/* Hero */}
          <h2 className="text-5xl xl:text-6xl font-bold leading-tight text-slate-900 dark:text-white">
            Shorten.
            <br />
            Track.
            <br />
            <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 bg-clip-text text-transparent">
              Grow.
            </span>
          </h2>

          <p className="mt-6 text-lg text-slate-600 dark:text-slate-500 max-w-xl">
            Create branded short links, track visitors, generate QR codes, analyze click performance
          </p>

          {/* Feature Cards */}
          <div className="grid grid-cols-2 gap-3 mt-12 max-w-3xl">

            <FeatureCard
              icon={<BarChart3 size={16} />}
              title="Analytics"
              text="Real-time click insights"
            />

            <FeatureCard
              icon={<MousePointerClick size={16} />}
              title="Click Tracking"
              text="Detailed visitor metrics"
            />

            <FeatureCard
              icon={<QrCode size={16} />}
              title="QR Codes"
              text="Generate instantly"
            />

            <FeatureCard
              icon={<Link2 size={16} />}
              title="Short Links"
              text="Custom aliases supported"
            />

          </div>
        </div>

        {/* Right Side */}
        <div className="w-full lg:w-auto flex justify-center">

          <div className="w-full max-w-[720px]">

            <div
              className="
                w-full
                rounded-2xl
                border border-slate-200 dark:border-white/10
                bg-white/80 dark:bg-white/5
                backdrop-blur-xl
                px-20 md:px-30
              py-15
                shadow-1xl
              "
            >
              {children}
            </div>

            <p className="text-center text-xs text-slate-500 mt-4">
              Protected with industry-standard encryption
            </p>

          </div>

        </div>

      </div>
    </div>
  );
}

function FeatureCard({ icon, title, text }) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="
        rounded-2xl
        border border-slate-200 dark:border-white/10
        bg-white/60 dark:bg-white/5
        backdrop-blur-sm
        p-4
      "
    >
      <div className="text-indigo-500 mb-3">
        {icon}
      </div>

      <h3 className="font-semibold text-slate-900 dark:text-white">
        {title}
      </h3>

      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
        {text}
      </p>
    </motion.div>
  );
}

export default AuthLayout;