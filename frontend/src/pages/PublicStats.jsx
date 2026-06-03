import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api/axios";

function PublicStats() {
  const { shortCode } = useParams();

  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await API.get(
        `/url/public/${shortCode}`
      );

      setStats(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  if (!stats) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen p-10 bg-slate-100 dark:bg-slate-950">
      <div className="max-w-5xl mx-auto">

        <h1 className="text-4xl font-bold mb-8">
          Public URL Stats
        </h1>

        <div className="grid md:grid-cols-3 gap-4">

          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl">
            <h3>Total Clicks</h3>
            <p className="text-3xl font-bold">
              {stats.clicks}
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl">
            <h3>Short Code</h3>
            <p className="font-bold">
              {stats.shortCode}
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl">
            <h3>Last Visited</h3>
            <p>
              {stats.lastVisited
                ? new Date(
                    stats.lastVisited
                  ).toLocaleString()
                : "Never"}
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}

export default PublicStats;