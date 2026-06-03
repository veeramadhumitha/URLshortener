import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart, XAxis, YAxis,
} from "recharts";
import {
  MousePointerClick, Clock, Eye, Link2, Copy, CheckCircle2, Calendar,
  TrendingUp, Monitor, Smartphone, Globe, Flame,
} from "lucide-react";

import API from "../api/axios";
import AnalyticsLayout from "../components/analytics/AnalyticsLayout";

/* ---------- Reusable sub-components ---------- */

function StatCard({ icon: Icon, label, value, gradient, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      whileHover={{ y: -4 }}
      className="group relative overflow-hidden rounded-2xl p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-2xl transition-all"
    >
      <div
        className="absolute -top-12 -right-12 w-40 h-40 rounded-full opacity-20 blur-3xl group-hover:opacity-30 transition-opacity"
        style={{ background: gradient }}
      />
      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-medium">{label}</p>
          <h2 className="mt-3 text-4xl font-extrabold text-slate-900 dark:text-white">{value}</h2>
        </div>
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg"
          style={{ background: gradient }}
        >
          <Icon size={22} />
        </div>
      </div>
    </motion.div>
  );
}

function InfoRow({ icon: Icon, label, value, action }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-800 last:border-0">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 shrink-0">
          <Icon size={16} />
        </div>
        <div className="min-w-0">
          <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
          <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{value}</p>
        </div>
      </div>
      {action}
    </div>
  );
}

function BrowserBar({ icon: Icon, name, count, total, color }) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
          <Icon size={16} style={{ color }} />
          <span className="font-medium">{name}</span>
        </div>
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
          {count} · {pct}%
        </span>
      </div>
      <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="h-full rounded-full"
          style={{ background: color }}
        />
      </div>
    </div>
  );
}

/* ---------- Page ---------- */

function Analytics() {
  const { id } = useParams();
  const [analytics, setAnalytics] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await API.get(`/url/analytics/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAnalytics(res.data.data);
      } catch (error) {
        console.log(error);
        toast.error("Failed to load analytics");
      }
    };
    fetchAnalytics();
  }, [id]);

 const chartData = useMemo(() => {
  if (!analytics) return [];

  const clicksPerDay = {};

  analytics.visitHistory.forEach((visit) => {
    const date = new Date(
      visit.timestamp
    ).toLocaleDateString();

    clicksPerDay[date] =
      (clicksPerDay[date] || 0) + 1;
  });

  return Object.keys(clicksPerDay).map(
    (date) => ({
      date,
      clicks: clicksPerDay[date],
    })
  );
  }, [analytics]);

  const copy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Copied!");
    setTimeout(() => setCopied(false), 1500);
  };

  if (!analytics) {
    return (
      <AnalyticsLayout subtitle="Loading your data…">
        <div className="flex items-center justify-center h-[50vh]">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            className="w-12 h-12 rounded-full border-4 border-indigo-500 border-t-transparent"
          />
        </div>
      </AnalyticsLayout>
    );
  }

  const browserCounts = {
    Chrome: analytics.visitHistory.filter((v) => v.browser === "Chrome").length,
    Edge: analytics.visitHistory.filter((v) => v.browser === "Edge").length,
    Firefox: analytics.visitHistory.filter((v) => v.browser === "Firefox").length,
  };
  const browserTotal = Object.values(browserCounts).reduce((a, b) => a + b, 0);

  const desktopCount = analytics.visitHistory.filter((v) => v.device === "Desktop").length;
  const mobileCount = analytics.visitHistory.filter((v) => v.device === "Mobile").length;

  return (
    <AnalyticsLayout>
      {/* Stat cards */}
      <div className="grid md:grid-cols-3 gap-5 mb-8">
        <StatCard
          icon={MousePointerClick}
          label="Total Clicks"
          value={analytics.clicks}
          gradient="linear-gradient(135deg,#6366f1,#8b5cf6)"
          delay={0.05}
        />
        <StatCard
          icon={Eye}
          label="Total Visits"
          value={analytics.visitHistory.length}
          gradient="linear-gradient(135deg,#10b981,#06b6d4)"
          delay={0.1}
        />
        <StatCard
          icon={Clock}
          label="Last Visited"
          value={analytics.lastVisited ? new Date(analytics.lastVisited).toLocaleDateString() : "Never"}
          gradient="linear-gradient(135deg,#f97316,#ec4899)"
          delay={0.15}
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Click Activity</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">Cumulative clicks over time</p>
            </div>
            <div className="flex items-center gap-1 text-emerald-600 text-sm font-medium">
              <TrendingUp size={16} /> Live
            </div>
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="clickGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity={0.6} />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.4} />
              <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" fontSize={12} />
              <Tooltip
                contentStyle={{
                  background: "rgba(15,23,42,0.95)",
                  border: "none",
                  borderRadius: 12,
                  color: "#fff",
                }}
              />
              <Area type="monotone" dataKey="clicks" stroke="#6366f1" strokeWidth={3} fill="url(#clickGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* URL Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm"
        >
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">URL Details</h2>
          <InfoRow
            icon={Link2}
            label="Original URL"
            value={analytics.originalUrl}
            action={
              <button
                onClick={() => copy(analytics.originalUrl)}
                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-indigo-600 transition-colors"
              >
                {copied ? <CheckCircle2 size={16} className="text-emerald-500" /> : <Copy size={16} />}
              </button>
            }
          />
          <InfoRow icon={Link2} label="Short Code" value={analytics.shortCode} />
          <InfoRow icon={MousePointerClick} label="Total Clicks" value={analytics.clicks} />
          <InfoRow
            icon={Calendar}
            label="Last Visited"
            value={analytics.lastVisited ? new Date(analytics.lastVisited).toLocaleString() : "Never"}
          />
        </motion.div>

        {/* Browser & Device */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm"
        >
          <div className="grid md:grid-cols-2 gap-8">
            {/* Browsers */}
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-5">Browser Analytics</h2>
              <div className="space-y-4">
                <BrowserBar
  icon={Monitor}
  name="Chrome"
  count={browserCounts.Chrome}
  total={browserTotal}
  color="#6366f1"
/>
                <BrowserBar icon={Globe} name="Edge" count={browserCounts.Edge} total={browserTotal} color="#06b6d4" />
                <BrowserBar icon={Flame} name="Firefox" count={browserCounts.Firefox} total={browserTotal} color="#f97316" />
              </div>
            </div>

            {/* Devices */}
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-5">Device Analytics</h2>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-5 rounded-xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-200 dark:border-indigo-800">
                  <Monitor className="text-indigo-500 mb-2" size={20} />
                  <p className="text-sm text-slate-500">Desktop</p>
                  <p className="text-3xl font-bold text-slate-900 dark:text-white">{desktopCount}</p>
                </div>
                <div className="p-5 rounded-xl bg-gradient-to-br from-cyan-500/10 to-emerald-500/10 border border-cyan-200 dark:border-cyan-800">
                  <Smartphone className="text-cyan-500 mb-2" size={20} />
                  <p className="text-sm text-slate-500">Mobile</p>
                  <p className="text-3xl font-bold text-slate-900 dark:text-white">{mobileCount}</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Visit History */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="mt-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm"
      >
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Visit History</h2>
        {analytics.visitHistory.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            <Eye size={40} className="mx-auto mb-3 opacity-50" />
            <p>No visits yet — share your link!</p>
          </div>
        ) : (
          <div className="max-h-80 overflow-y-auto pr-2 space-y-2">
            {analytics.visitHistory.map((visit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.03 }}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-indigo-50 dark:hover:bg-slate-800 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 text-white text-xs font-bold flex items-center justify-center">
                    #{index + 1}
                  </div>
                  <span className="text-sm text-slate-700 dark:text-slate-200">
                    {new Date(visit.timestamp).toLocaleString()}
                  </span>
                </div>
                <Clock size={14} className="text-slate-400" />
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </AnalyticsLayout>
  );
}

export default Analytics;
