import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../layout/DashboardLayout";

function AnalyticsLayout({ title = "URL Analytics", subtitle = "Track every click in real-time", children }) {
  const navigate = useNavigate();

  return (
    <DashboardLayout>
      <div className="relative">
        {/* Ambient background glow */}
        <div className="pointer-events-none absolute inset-x-0 -top-20 h-64 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-cyan-500/10 blur-3xl" />

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="relative flex items-center justify-between mb-10"
        >
          <div>
            <button
              onClick={() => navigate(-1)}
              className="group inline-flex items-center gap-2 text-sm text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 mb-3 transition-colors"
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
              Back
            </button>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 bg-clip-text text-transparent">
              {title}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2">{subtitle}</p>
          </div>

          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-medium border border-emerald-500/20">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Live tracking
          </div>
        </motion.div>

        {/* Page content */}
        <div className="relative">{children}</div>
      </div>
    </DashboardLayout>
  );
}

export default AnalyticsLayout;
