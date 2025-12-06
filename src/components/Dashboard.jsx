import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

const Dashboard = () => {
  const [searchParams] = useSearchParams();
  const [username, setUsername] = useState("");
  const [token, setToken] = useState("");

  const [ openProfileMenu, setOpenProfileMenu ] = useState(false);

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
    <section className="relative h-screen">

      <header className="fixed top-0 left-0 w-full h-16 flex items-center px-6 z-50">
        <div className="ml-auto">
          <button className="bg-emerald-400 px-3 py-2 rounded text-xl">Logout</button>
          <button className="bg-emerald-400 px-4 py-2 rounded-[50%] text-xl ml-2 cursor-pointer" onClick={() => {setOpenProfileMenu(!openProfileMenu)}}>
            P
          </button>

          {openProfileMenu && 
            (
            <div className="absolute top-16 right-6 bg-white border shadow-lg rounded-md w-48 py-2 z-50">
              <button className="block w-full text-left px-4 py-2 hover:bg-gray-100">Change Profile</button>
              <button className="block w-full text-left px-4 py-2 hover:bg-gray-100">Settings</button>
              <button className="block w-full text-left px-4 py-2 hover:bg-gray-100">Set Status</button>
              <button className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-500">Logout</button>
            </div>
            )
          }
        </div>
      </header>
      <div className="pt-24 flex flex-col items-center">
        <h1 className="text-5xl mb-4">DEVCHAN Dashboard</h1>
        {username ? (
          <p className="text-green-700 text-xl">Welcome, {username}!</p>
          ) : (
          <p className="text-red-500">You are not logged in.</p>
        )}
      </div>
    </section>
  );
};

export default Dashboard;
