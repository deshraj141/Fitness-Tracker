import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import {
  Dumbbell,
  LayoutDashboard,
  Utensils,
  UserCircle,
  LogOut,
  Menu,
  X,
  Activity,
  BarChart,
  Target,
  User,
} from "lucide-react";

const Navbar = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <nav className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center gap-2 text-2xl font-black tracking-tight text-white hover:opacity-80 transition-opacity"
        >
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Activity className="text-white w-6 h-6" />
          </div>
          FIT<span>X</span>
        </Link>

        {user ? (
          <>
            {/* hamburger for small screens */}
            <button
              className="md:hidden text-gray-300 hover:text-white p-2"
              onClick={() => setMobileOpen((o) => !o)}
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <div
              className={`flex-1 md:flex items-center gap-8 ${mobileOpen ? "block" : "hidden"} md:block`}
            >
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  `flex items-center gap-2 font-medium transition-colors ${isActive ? "text-blue-400" : "text-gray-400 hover:text-white"}`
                }
              >
                <LayoutDashboard size={20} /> Dashboard
              </NavLink>
              <NavLink
                to="/workouts"
                className={({ isActive }) =>
                  `flex items-center gap-2 font-medium transition-colors ${isActive ? "text-blue-400" : "text-gray-400 hover:text-white"}`
                }
              >
                <Dumbbell size={20} /> Workouts
              </NavLink>
              <NavLink
                to="/nutrition"
                className={({ isActive }) =>
                  `flex items-center gap-2 font-medium transition-colors ${isActive ? "text-blue-400" : "text-gray-400 hover:text-white"}`
                }
              >
                <Utensils size={20} /> Nutrition
              </NavLink>
              <NavLink
                to="/analytics"
                className={({ isActive }) =>
                  `flex items-center gap-2 font-medium transition-colors ${isActive ? "text-blue-400" : "text-gray-400 hover:text-white"}`
                }
              >
                <BarChart size={20} /> Analytics
              </NavLink>
              <NavLink
                to="/goals"
                className={({ isActive }) =>
                  `flex items-center gap-2 font-medium transition-colors ${isActive ? "text-blue-400" : "text-gray-400 hover:text-white"}`
                }
              >
                <Target size={20} /> Goals
              </NavLink>
              <NavLink
                to="/profile"
                className={({ isActive }) =>
                  `flex items-center gap-2 font-medium transition-colors ${isActive ? "text-blue-400" : "text-gray-400 hover:text-white"}`
                }
              >
                <User size={20} /> Profile
              </NavLink>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-5 py-2.5 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-xl text-gray-300 font-medium transition-all"
              >
                <LogOut size={18} /> Logout
              </button>
            </div>
          </>
        ) : (
          <div className="flex items-center gap-4">
            <Link
              to="/login"
              className="text-gray-400 hover:text-white font-medium px-4"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 rounded-xl font-bold transition-all shadow-lg hover:shadow-blue-500/20"
            >
              Get Started
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
