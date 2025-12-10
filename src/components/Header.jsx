import React from "react";
import {FaBell} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Header = ({ userData, openProfileMenu, setOpenProfileMenu, handleLogout }) => {
  const navigate = useNavigate();

  return (
    <header className="bg-black shadow shadow-zinc-800 fixed top-0 left-0 w-full h-16 flex items-center px-6 z-50">

      <p className="text-white text-xl">DEVCHAN</p>

      <div className="flex items-center ml-auto">

        <button className="w-10 h-10 rounded-full border border-zinc-800 ml-2">
          <FaBell className="w-6 h-6 text-white" />
        </button>

        {userData && (
          <button
            onClick={() => setOpenProfileMenu(!openProfileMenu)}
            className="cursor-pointer"
          >
            <img
              src={userData.avatar}
              alt="avatar"
              className="w-10 h-10 rounded-full border border-zinc-800 ml-2"
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
