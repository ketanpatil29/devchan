import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

const Dashboard = () => {
  const [searchParams] = useSearchParams();
  const [username, setUsername] = useState("");
  const [token, setToken] = useState("");

  useEffect(() => {
    const t = searchParams.get("token");
    const u = searchParams.get("username");

    if (t) {
      setToken(t);
      localStorage.setItem("githubToken", t);
    }

    if (u) {
      setUsername(u);
      localStorage.setItem("githubUsername", u);
    }
  }, [searchParams]);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-5xl mb-4">DEVCHAN Dashboard</h1>
      {username || token ? (
        <p className="text-green-700 text-xl">Welcome, {username}!</p>
      ) : (
        <p className="text-red-500">You are not logged in.</p>
      )}
    </div>
  );
};

export default Dashboard;
