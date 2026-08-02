import React, { useState } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";

export default function Login() {
  const [, navigate] = useLocation();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const login = trpc.admin.login.useMutation({
    onSuccess(data) {
      localStorage.setItem("admin_token", data.token);
      localStorage.setItem("admin_user", JSON.stringify(data.admin));

      alert("Login Successful");

      navigate("/admin");
    },

    onError(err) {
      alert(err.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    login.mutate({
      username,
      password,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 w-96">
        <h1 className="text-3xl font-bold text-center mb-6">
          BBC Yangon Admin
        </h1>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2">Username</label>

            <input
              className="w-full border rounded px-3 py-2"
              placeholder="admin"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="mb-6">
            <label className="block mb-2">Password</label>

            <input
              type="password"
              className="w-full border rounded px-3 py-2"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            className="w-full bg-red-700 text-white py-2 rounded"
            disabled={login.isPending}
            type="submit"
          >
            {login.isPending ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}

