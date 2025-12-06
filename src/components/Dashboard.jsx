import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

const TypingText = ({ text, speed = 120 }) => {
  const [displayMessage, setDisplayMessage] = useState("");

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setDisplayMessage(text.slice(0, i + 1));
      i++;
      if (i === text.length) clearInterval(interval);
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed]);

  return (
    <p className="text-white text-2xl mt-4 text-center w-[80%]" style={{ whiteSpace: "pre-line" }}>{displayMessage}</p>
  );
};

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
    <section className="exo-font relative h-screen">

      <header className="shadow shadow-zinc-800 fixed top-0 left-0 w-full h-16 flex items-center px-6 z-50">
        <div>
          <p className="text-white text-xl">DEVCHAN</p>
        </div>

        <div className="ml-auto">
          <button className="bg-white px-3 py-2 rounded text-xl">Logout</button>
          <button className="bg-white px-4 py-2 rounded-[50%] text-xl ml-2 cursor-pointer" onClick={() => {setOpenProfileMenu(!openProfileMenu)}}>
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

      <div className="bg-black pt-24 flex flex-col items-center h-screen">
        <TypingText
          text={`Welcome, ${username}!\n We request you to complete your profile so you can find the best matches for you to connect with.`}
          speed={60} // smaller = faster typing
        />

        {username ? (
          <p className="text-green-700 text-xl"></p>
          ) : (
          <p className="text-red-500">You are not logged in.</p>
        )}

        <button className="bg-zinc-900 border border-zinc-800 text-white rounded-md p-3 mt-3">Find your match</button>


      </div>

      <div>
        
      </div>
    </section>
  );
};

export default Dashboard;
