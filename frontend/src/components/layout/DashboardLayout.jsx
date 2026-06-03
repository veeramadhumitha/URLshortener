import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Link2, LogOut, Moon, Sun } from "lucide-react";

function DashboardLayout({ children }) {
  const navigate = useNavigate();
 const [dark, setDark] = useState(() => {
  const savedTheme = localStorage.getItem("theme");

  if (savedTheme) {
    return savedTheme === "dark";
  }

  return window.matchMedia(
    "(prefers-color-scheme: dark)"
  ).matches;
});

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors"
      style={{
        backgroundImage:
          "radial-gradient(at 0% 0%, rgba(99,102,241,0.12) 0px, transparent 50%), radial-gradient(at 100% 0%, rgba(6,182,212,0.10) 0px, transparent 50%), radial-gradient(at 50% 100%, rgba(168,85,247,0.12) 0px, transparent 50%)",
        backgroundAttachment: "fixed",
      }}>
      <nav className="sticky top-0 z-40 backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl grid place-items-center text-white shadow-lg"
              style={{ background: "linear-gradient(135deg,#6366f1,#a855f7)" }}>
              <Link2 className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              URL<span className="bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(135deg,#6366f1,#a855f7)" }}>Shortener</span>
            </span>
          </motion.div>

          <div className="flex items-center gap-2">
            {/* Theme toggle */}
            <button onClick={() => setDark(!dark)}
              className="relative h-9 w-16 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 flex items-center px-1"
              aria-label="Toggle theme">
              <motion.div animate={{ x: dark ? 28 : 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className="h-7 w-7 rounded-full grid place-items-center text-white shadow"
                style={{ background: "linear-gradient(135deg,#6366f1,#a855f7)" }}>
                {dark ? <Moon className="h-3.5 w-3.5" /> : <Sun className="h-3.5 w-3.5" />}
              </motion.div>
            </button>

            <motion.button
  whileHover={{ scale: 1.04 }}
  whileTap={{ scale: 0.96 }}
  onClick={() => {
    localStorage.removeItem("token");
    navigate("/");
  }}
  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white shadow-lg shadow-red-500/30"
  style={{ background: "linear-gradient(135deg,#ef4444,#f97316)" }}
>
  <LogOut className="h-4 w-4" />
  Logout
</motion.button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-6">{children}</main>
    </div>
  );
}

export default DashboardLayout;
