import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";
import { AnimatePresence, motion } from "framer-motion";
import { toast, Toaster } from "sonner";
import {
  Link2, Copy, QrCode, BarChart3, Trash2, Download, X,
  Sparkles, TrendingUp, MousePointerClick, Plus, Check,
  ExternalLink, Search,Pencil,
} from "lucide-react";
import API from "../api/axios";
import DashboardLayout from "../components/layout/DashboardLayout";

function Dashboard() {
  const [originalUrl, setOriginalUrl] = useState("");
  const [customAlias, setCustomAlias] = useState("");
  const [expiryDays, setExpiryDays] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [urls, setUrls] = useState([]);
  const [selectedQr, setSelectedQr] = useState("");
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [search, setSearch] = useState("");

  const [editingUrl, setEditingUrl] = useState(null);
const [editValue, setEditValue] = useState("");
  const navigate = useNavigate();

  const authHeader = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

  const fetchUrls = async () => {
    try {
      const res = await API.get("/url/my-urls", authHeader());
      setUrls(res.data.data || []);
    } catch (e) { console.log(e); }
  };

  useEffect(() => { fetchUrls(); }, []);

  const handleShorten = async () => {
    if (!originalUrl.trim()) return toast.error("Please enter a URL");
    setLoading(true);
    try {
      const res = await API.post("/url/create", {
        originalUrl,
        customAlias,
        expiryDays: expiryDays ? parseInt(expiryDays) : null,
      }, authHeader());
     const generated = `https://urlshortener-6srv.onrender.com/${res.data.data.shortCode}`;
      setShortUrl(generated);
      setOriginalUrl(""); setCustomAlias(""); setExpiryDays("");
      fetchUrls();
      toast.success("Short link ready ✨");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to shorten");
    } finally { setLoading(false); }
  };
const handleEdit = (url) => {
  setEditingUrl(url);
  setEditValue(url.originalUrl);
};
const handleUpdate = async () => {
  try {
    await API.put(
      `/url/${editingUrl._id}`,
      {
        originalUrl: editValue,
      },
      authHeader()
    );

    toast.success("URL updated");

    setEditingUrl(null);

    fetchUrls();
  } catch (error) {
    toast.error(
      error.response?.data?.message ||
      "Failed to update URL"
    );
  }
};
  const copyToClipboard = async (text, id) => {
    await navigator.clipboard.writeText(text);
    if (id) { setCopiedId(id); setTimeout(() => setCopiedId(null), 1400); }
    toast.success("Copied to clipboard");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this URL?")) return;
    try {
      await API.delete(`/url/${id}`, authHeader());
      fetchUrls();
      toast.success("URL deleted");
    } catch { toast.error("Failed to delete"); }
  };

  const downloadQR = () => {
    const canvas = document.getElementById("qr-code");
    if (!canvas) return;
    const url = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
    const a = document.createElement("a");
    a.href = url; a.download = "short-url-qr.png";
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    toast.success("QR downloaded");
  };

  const totalUrls = urls.length;
  const totalClicks = urls.reduce((s, u) => s + (u.clicks || 0), 0);
  const topUrl = urls.length
    ? urls.reduce((a, b) => ((a.clicks || 0) > (b.clicks || 0) ? a : b))
    : null;

  const filtered = useMemo(
    () => urls.filter((u) =>
      u.originalUrl.toLowerCase().includes(search.toLowerCase()) ||
      u.shortCode.toLowerCase().includes(search.toLowerCase())
    ),
    [urls, search]
  );

  const gradPrimary = "linear-gradient(135deg,#6366f1,#a855f7)";
  const gradAccent  = "linear-gradient(135deg,#06b6d4,#3b82f6)";
  const gradSuccess = "linear-gradient(135deg,#10b981,#34d399)";

  return (
    <DashboardLayout>
      <Toaster position="top-right" richColors />

      {/* Hero */}
      <motion.header
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }} className="mb-8"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 mb-3">
          <Sparkles className="h-3.5 w-3.5 text-indigo-500" /> Welcome back
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-white">
          Your{" "}
          <span className="bg-clip-text text-transparent" style={{ backgroundImage: gradPrimary }}>
            link universe
          </span>
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2">
          Shorten, share and track — all in one beautiful place.
        </p>
      </motion.header>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-5 mb-8">
        <StatCard icon={<Link2 className="h-5 w-5" />} label="Total URLs" value={totalUrls} bg={gradPrimary} delay={0.05} />
        <StatCard icon={<MousePointerClick className="h-5 w-5" />} label="Total Clicks" value={totalClicks} bg={gradAccent} delay={0.1} />
        <StatCard
          icon={<TrendingUp className="h-5 w-5" />}
          label="Top performer"
          value={topUrl ? `/${topUrl.shortCode}` : "—"}
          sub={topUrl ? `${topUrl.clicks} clicks` : "No data yet"}
          bg={gradSuccess} delay={0.15}
        />
      </div>

      {/* Create card */}
      <motion.section
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="relative rounded-3xl p-[2px] mb-8" style={{ background: gradPrimary }}
      >
        <div className="rounded-[calc(1.5rem-2px)] bg-white dark:bg-slate-900 p-6 md:p-8">
          <div className="flex items-center gap-3 mb-5">
            <div className="h-10 w-10 rounded-xl grid place-items-center text-white" style={{ background: gradPrimary }}>
              <Plus className="h-5 w-5" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Create Short URL</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_220px_180px_auto] gap-3">
            <FancyInput value={originalUrl} onChange={setOriginalUrl}
              placeholder="https://your-very-long-url.com" icon={<Link2 className="h-4 w-4" />} />
            <FancyInput value={customAlias} onChange={setCustomAlias} placeholder="Custom alias (optional)" />
            <select value={expiryDays} onChange={(e) => setExpiryDays(e.target.value)}
              className="h-12 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500 transition cursor-pointer">
              <option value="">Never expire</option>
              <option value="1">1 Day</option>
              <option value="7">7 Days</option>
              <option value="30">30 Days</option>
            </select>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
              onClick={handleShorten} disabled={loading}
              className="h-12 px-6 rounded-xl text-white font-semibold disabled:opacity-60 flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/40"
              style={{ background: gradPrimary }}>
              {loading ? (
                <><span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Shortening</>
              ) : (<><Sparkles className="h-4 w-4" /> Shorten</>)}
            </motion.button>
          </div>

          <AnimatePresence>
            {shortUrl && (
              <motion.div
                initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="mt-5 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-10 w-10 rounded-xl grid place-items-center text-white shrink-0" style={{ background: gradAccent }}>
                      <Check className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-slate-500">Your short link</p>
                      <a href={shortUrl} target="_blank" rel="noreferrer"
                        className="font-semibold truncate block text-indigo-600 hover:underline">{shortUrl}</a>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => copyToClipboard(shortUrl)}
                      className="px-4 py-2 rounded-xl text-sm font-medium border border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-700 transition flex items-center gap-1.5">
                      <Copy className="h-4 w-4" /> Copy
                    </button>
                    <button onClick={() => setSelectedQr(shortUrl)}
                      className="px-4 py-2 rounded-xl text-sm font-medium text-white flex items-center gap-1.5"
                      style={{ background: gradPrimary }}>
                      <QrCode className="h-4 w-4" /> QR
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.section>

      {/* Table */}
      <motion.section
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
        className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 md:p-8 shadow-sm"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">My URLs</h2>
            <p className="text-sm text-slate-500">{urls.length} total</p>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search links…"
              className="h-11 pl-9 pr-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm outline-none focus:ring-2 focus:ring-indigo-500 w-full md:w-72" />
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="py-16 text-center">
            <div className="mx-auto h-16 w-16 rounded-2xl grid place-items-center bg-slate-100 dark:bg-slate-800 mb-4">
              <Link2 className="h-7 w-7 text-slate-400" />
            </div>
            <p className="font-medium text-slate-700 dark:text-slate-300">No URLs yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-separate border-spacing-y-2 min-w-[720px]">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wider text-slate-500">
                  <th className="px-3 py-2">Original</th>
                  <th className="px-3 py-2">Short</th>
                  <th className="px-3 py-2">Clicks</th>
                  <th className="px-3 py-2">Created</th>
                  <th className="px-3 py-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence initial={false}>
                  {filtered.map((u, i) => (
                    <motion.tr key={u._id} layout
                      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -20 }}
                      transition={{ delay: i * 0.03 }}
                      className="bg-slate-50 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                    >
                      <td className="px-3 py-3 rounded-l-2xl max-w-[260px]">
                        <a href={u.originalUrl} target="_blank" rel="noreferrer"
                          className="flex items-center gap-2 truncate text-slate-700 dark:text-slate-200 hover:underline">
                          <ExternalLink className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                          <span className="truncate">{u.originalUrl}</span>
                        </a>
                      </td>
                      <td className="px-3 py-3">
  <a
    href={`https://urlshortener-6srv.onrender.com/${u.shortCode}`}
    target="_blank"
    rel="noreferrer"
    className="font-mono text-sm font-semibold bg-clip-text text-transparent hover:opacity-80"
    style={{ backgroundImage: gradPrimary }}
  >
    {u.shortCode}
  </a>
</td>
                      <td className="px-3 py-3">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300">
                          <MousePointerClick className="h-3 w-3" />{u.clicks}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-sm text-slate-500">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-3 py-3 rounded-r-2xl">
                        <div className="flex items-center justify-end gap-1">
                          <IconBtn label="Copy" onClick={() => copyToClipboard(`https://urlshortener-6srv.onrender.com/${u.shortCode}`, u._id)}>
                            {copiedId === u._id ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                          </IconBtn>
                          <IconBtn label="QR" onClick={() => setSelectedQr(`https://urlshortener-6srv.onrender.com/${u.shortCode}`)}>
                            <QrCode className="h-4 w-4" />
                          </IconBtn>
                          <IconBtn label="Analytics" onClick={() => navigate(`/analytics/${u._id}`)}>
                            <BarChart3 className="h-4 w-4" />
                          </IconBtn>
                          <IconBtn
  label="Edit"
  onClick={() => handleEdit(u)}
>
  <Pencil className="h-4 w-4" />
</IconBtn>
                          <IconBtn label="Delete" danger onClick={() => handleDelete(u._id)}>
                            <Trash2 className="h-4 w-4" />
                          </IconBtn>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        )}
      </motion.section>

      {/* QR Modal */}
      <AnimatePresence>
        {selectedQr && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setSelectedQr("")}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm grid place-items-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 22, stiffness: 280 }}
              onClick={(e) => e.stopPropagation()}
              className="rounded-3xl bg-white dark:bg-slate-900 p-8 max-w-sm w-full shadow-2xl relative"
            >
              <button onClick={() => setSelectedQr("")}
                className="absolute top-4 right-4 h-9 w-9 rounded-full grid place-items-center hover:bg-slate-100 dark:hover:bg-slate-800 transition">
                <X className="h-4 w-4" />
              </button>
              <h2 className="text-xl font-bold mb-1 text-slate-900 dark:text-white">Scan to visit</h2>
              <p className="text-sm text-slate-500 mb-5 break-all">{selectedQr}</p>
              <div className="rounded-2xl p-4 grid place-items-center bg-white">
                <QRCodeCanvas id="qr-code" value={selectedQr} size={220} level="H" />
              </div>
              <button onClick={downloadQR}
                className="mt-5 w-full h-12 rounded-xl text-white font-semibold flex items-center justify-center gap-2"
                style={{ background: gradPrimary }}>
                <Download className="h-4 w-4" /> Download PNG
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Modal */}
<AnimatePresence>
  {editingUrl && (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={() => setEditingUrl(null)}
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm grid place-items-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-slate-900 rounded-3xl p-8 w-full max-w-lg shadow-2xl"
      >
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
          Edit URL
        </h2>

        <p className="text-sm text-slate-500 mb-5">
          Update the destination URL without changing the short link.
        </p>

        <input
          type="text"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          className="w-full h-12 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
        />

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={() => setEditingUrl(null)}
            className="px-5 py-2 rounded-xl border border-slate-300 dark:border-slate-700"
          >
            Cancel
          </button>

          <button
            onClick={handleUpdate}
            className="px-5 py-2 rounded-xl text-white font-medium"
            style={{
              background:
                "linear-gradient(135deg,#6366f1,#a855f7)",
            }}
          >
            Update
          </button>
        </div>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>
    </DashboardLayout>
  );
}

function StatCard({ icon, label, value, sub, bg, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}
      whileHover={{ y: -4 }}
      className="group relative rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 overflow-hidden shadow-sm"
    >
      <div className="absolute -top-12 -right-12 h-32 w-32 rounded-full opacity-20 blur-2xl group-hover:opacity-40 transition" style={{ background: bg }} />
      <div className="flex items-center justify-between mb-4 relative">
        <span className="text-sm text-slate-500 font-medium">{label}</span>
        <div className="h-10 w-10 rounded-xl grid place-items-center text-white" style={{ background: bg }}>{icon}</div>
      </div>
      <div className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white truncate relative">{value}</div>
      {sub && <div className="text-xs text-slate-500 mt-1 relative">{sub}</div>}
    </motion.div>
  );
}

function FancyInput({ value, onChange, placeholder, icon }) {
  return (
    <div className="relative">
      {icon && <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">{icon}</div>}
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        className={`w-full h-12 ${icon ? "pl-10" : "pl-4"} pr-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition`} />
    </div>
  );
}

function IconBtn({ children, onClick, label, danger }) {
  return (
    <motion.button whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }}
      onClick={onClick} aria-label={label} title={label}
      className={`h-9 w-9 rounded-lg grid place-items-center transition ${
        danger ? "text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10"
               : "text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
      }`}>
      {children}
    </motion.button>
  );
}
 


export default Dashboard;
