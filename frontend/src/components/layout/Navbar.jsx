import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

        <h1 className="text-2xl font-bold text-blue-600">
          URLShortener
        </h1>

        <div className="flex gap-6">
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/analytics">Analytics</Link>

          <button className="text-red-500">
            Logout
          </button>
        </div>

      </div>
    </nav>
  );
}

export default Navbar;