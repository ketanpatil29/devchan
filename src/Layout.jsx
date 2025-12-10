import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Header from "./components/Header";

const Layout = () => {
  const [userData, setUserData] = useState(null);
  const [openProfileMenu, setOpenProfileMenu] = useState(false);

  useEffect(() => {
    const storedUsername = localStorage.getItem("githubUsername");

    if (storedUsername) {
      fetch(`http://localhost:3000/user/me/${storedUsername}`)
        .then(res => res.json())
        .then(data => setUserData(data))
        .catch(err => console.error(err));
    }
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:3000/auth/logout", {
        method: "GET",
        credentials: "include"
      });
      
      window.location.href = "/";
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="bg-black exo-font min-h-screen">
      <Header
        userData={userData}
        openProfileMenu={openProfileMenu}
        setOpenProfileMenu={setOpenProfileMenu}
        handleLogout={handleLogout}
      />

      {/* Main content below header */}
      <main className="pt-20">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
