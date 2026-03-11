import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../../services/api";

// credentials used for demo user
const demoCredentials = {
  username: "DemoUser",
  email: "demo@demo.com",
  password: "demopass",
};

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // attempt registration through centralized API service
      const res = await authService.register(formData);
      console.log("registration response", res.data);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/dashboard");
    } catch (err) {
      console.error("registration error", err);
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-10 bg-gray-800 border border-gray-700 rounded-3xl shadow-2xl">
      <h2 className="text-3xl font-bold mb-8 text-center text-blue-400">
        Join FitX
      </h2>
      {error && (
        <div className="p-4 mb-6 bg-red-500/20 border border-red-500 text-red-400 rounded-xl text-center">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Username
          </label>
          <input
            type="text"
            className="w-full px-5 py-4 bg-gray-900 border border-gray-700 rounded-xl focus:outline-none focus:border-blue-500 transition-colors"
            placeholder="johndoe"
            value={formData.username}
            onChange={(e) =>
              setFormData({ ...formData, username: e.target.value })
            }
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Email Address
          </label>
          <input
            type="email"
            className="w-full px-5 py-4 bg-gray-900 border border-gray-700 rounded-xl focus:outline-none focus:border-blue-500 transition-colors"
            placeholder="name@example.com"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
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
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            required
          />
        </div>
        <button
          type="submit"
          className="w-full py-4 bg-blue-600 hover:bg-blue-700 rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-blue-500/20"
        >
          Create Account
        </button>
      </form>
      <p className="mt-8 text-center text-gray-500">
        Already have an account?{" "}
        <Link to="/login" className="text-blue-400 hover:underline">
          Login here
        </Link>
      </p>
      {/* offer demo login here as well */}
      <div className="mt-4 text-center">
        <button
          onClick={async () => {
            try {
              setError("");
              let res;
              try {
                res = await authService.login({
                  email: demoCredentials.email,
                  password: demoCredentials.password,
                });
              } catch (loginErr) {
                try {
                  await authService.register(demoCredentials);
                } catch (regErr) {
                  if (
                    regErr.response?.data?.message !== "User already exists"
                  ) {
                    throw regErr;
                  }
                }
                res = await authService.login({
                  email: demoCredentials.email,
                  password: demoCredentials.password,
                });
              }
              localStorage.setItem("token", res.data.token);
              localStorage.setItem("user", JSON.stringify(res.data.user));
              navigate("/dashboard");
            } catch (err) {
              console.error("demo login from register error", err);
              setError(err.response?.data?.message || "Demo login failed");
            }
          }}
          className="w-full py-4 bg-green-600 hover:bg-green-700 rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-green-500/20"
        >
          Demo Login
        </button>
      </div>
    </div>
  );
};

export default Register;
