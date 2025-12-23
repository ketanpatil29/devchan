import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import devchanLogo from "../assets/devchanlogo.png";
import notificationIcon from "../assets/notification2.png";
import matchingIcon from "../assets/userMatch.png";

const Header = ({ userData, openProfileMenu, setOpenProfileMenu, handleLogout, notifications }) => {
  const navigate = useNavigate();

  const [openNotifications, setOpenNotifications] = useState(false);

  return (
    <header className="bg-black shadow shadow-zinc-800 fixed top-0 left-0 w-full h-14 flex items-center px-4 z-50">

      <img
        href={`${import.meta.env.VITE_API_URL}/auth/github`}
        src={devchanLogo}
        alt="Logo"
        className="w-30 h-8 cursor-pointer"
      />

      <div className="flex items-center ml-auto gap-2">

        <button
          className="flex p-2 border border-zinc-800 rounded-md bg-transparent hover:bg-zinc-800 gap-2 transition"
        >
          <img
            src={matchingIcon}
            alt="Notification"
            className="w-7 h-7 invert brightness-200 opacity-80 hover:opacity-100"
          />
          <p className="text-white">0 Matches</p>
        </button>

        <button
          onClick={() => setOpenNotifications(!openNotifications)}
          className="p-1 border border-zinc-800 rounded-md bg-zinc-900 hover:bg-zinc-800 transition"
        >
          <img
            src={notificationIcon}
            alt="Notification"
            className="w-7 h-7 invert brightness-200 opacity-80 hover:opacity-100"
          />

          {notifications.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-xs px-1 rounded-full">
              {notifications.length}
            </span>
          )}
        </button>

        {openNotifications && (
          <div className="absolute top-14 right-16 w-72 bg-black border border-zinc-800 rounded-md shadow-lg">
            {notifications.length === 0 ? (
              <p className="text-zinc-400 p-4 text-sm">No notifications</p>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  className="flex items-center gap-3 p-3 hover:bg-zinc-900"
                >
                  <img src={n.avatar} className="w-8 h-8 rounded-full" />
                  <p className="text-sm text-white">{n.message}</p>
                </div>
              ))
            )}
          </div>
        )}


        {userData && (
          <button
            onClick={() => setOpenProfileMenu(!openProfileMenu)}
            className="cursor-pointer"
          >
            <img
              src={userData.avatar}
              alt="avatar"
              className="w-10 h-10 rounded-full border border-zinc-800"
            />
          </button>
        )}

        {openProfileMenu && (
          <div className="absolute top-18 right-6 bg-black border border-zinc-800 text-white shadow-lg rounded-md w-48 py-2 z-50">
            <button
              onClick={() => navigate("/profile")}
              className="block w-[90%] text-left px-2 py-2 mx-auto hover:bg-zinc-900 hover:rounded-md cursor-pointer"
            >
              Profile
            </button>
            <button className="block w-[90%] text-left px-2 py-2 mx-auto hover:bg-zinc-900 hover:rounded-md cursor-pointer">
              Settings
            </button>
            <button className="block w-[90%] text-left px-2 py-2 mx-auto hover:bg-zinc-900 hover:rounded-md cursor-pointer">
              Set Status
            </button>
            <button
              onClick={handleLogout}
              className="block w-[90%] text-left px-2 py-2 mx-auto text-red-500 hover:bg-zinc-900 hover:rounded-md cursor-pointer"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
