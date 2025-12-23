import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Header from "./components/Header";

const Layout = () => {
  const [userData, setUserData] = useState(null);
  const [openProfileMenu, setOpenProfileMenu] = useState(false);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const storedUsername = localStorage.getItem("githubUsername");

    if (storedUsername) {
      fetch(`${import.meta.env.VITE_API_URL}/user/me/${storedUsername}`, {
        method: "GET",
        credentials: "include"
      })
        .then(res => res.json())
        .then(data => setUserData(data))
        .catch(err => console.error(err));
    }
  }, []);

  const handleLogout = async () => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/auth/logout`, {
        method: "GET",
        credentials: "include"
      });

      window.location.href = "/";
    } catch (e) {
      console.error(e);
    }
  };

  const handleHeartClick = (matchedUser) => {
    setNotifications((prev) => [
      {
        id: Date.now(),
        type: "MATCH",
        message: `🎉 You and ${matchedUser.username} matched`,
        avatar: matchedUser.avatar,
      },
      ...prev,
    ]);
  };


  return (
    <div className="bg-black exo-font min-h-screen">
      <Header
        userData={userData}
        openProfileMenu={openProfileMenu}
        setOpenProfileMenu={setOpenProfileMenu}
        handleLogout={handleLogout}
        notifications={notifications}
        setNotifications={setNotifications}
      />

      {/* Main content below header */}
      <main className="pt-18">
        <Outlet context={{ handleHeartClick }}/>
      </main>
    </div>
  );
};

export default Layout;
