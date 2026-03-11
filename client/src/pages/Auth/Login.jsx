import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
// use centralized API service for auth calls
import { authService } from "../../services/api";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // credentials for the demo account
  const demoCredentials = {
    username: "DemoUser",
    email: "demo@demo.com",
    password: "demopass",
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // use authService so interceptors and baseURL are handled centrally
      const res = await authService.login({ email, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-10 bg-gray-800 border border-gray-700 rounded-3xl shadow-2xl">
      <h2 className="text-3xl font-bold mb-8 text-center text-blue-400">
        Welcome Back
      </h2>
      {error && (
        <div className="p-4 mb-6 bg-red-500/20 border border-red-500 text-red-400 rounded-xl text-center">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Email Address
          </label>
          <input
            type="email"
            className="w-full px-5 py-4 bg-gray-900 border border-gray-700 rounded-xl focus:outline-none focus:border-blue-500 transition-colors"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Password
          </label>
          <input
            type="password"
            className="w-full px-5 py-4 bg-gray-900 border border-gray-700 rounded-xl focus:outline-none focus:border-blue-500 transition-colors"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="w-full py-4 bg-blue-600 hover:bg-blue-700 rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-blue-500/20"
        >
          Sign In
        </button>
      </form>
      {/* demo login button to quickly access features without registering */}
      <div className="mt-4">
        <button
          onClick={async () => {
            try {
              setError("");
              // attempt login; if it fails, try registering then login again
              let res;
              try {
                res = await authService.login({
                  email: demoCredentials.email,
                  password: demoCredentials.password,
                });
              } catch (loginErr) {
                // if registration fails because user already exists, ignore and continue
                try {
                  await authService.register(demoCredentials);
                } catch (regErr) {
                  if (
                    regErr.response?.data?.message !== "User already exists"
                  ) {
                    throw regErr; // something else went wrong
                  }
                }
                // try login again after registration or if account already existed
                res = await authService.login({
                  email: demoCredentials.email,
                  password: demoCredentials.password,
                });
              }
              localStorage.setItem("token", res.data.token);
              localStorage.setItem("user", JSON.stringify(res.data.user));
              navigate("/dashboard");
            } catch (err) {
              console.error("demo login error", err);
              // surface server message if available
              setError(err.response?.data?.message || "Demo login failed");
            }
          }}
          className="w-full py-4 bg-green-600 hover:bg-green-700 rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-green-500/20"
        >
          Demo Login
        </button>
      </div>
      <p className="mt-8 text-center text-gray-500">
        Don't have an account?{" "}
        <Link to="/register" className="text-blue-400 hover:underline">
          Register here
        </Link>
      </p>
    </div>
  );
};

export default Login;
