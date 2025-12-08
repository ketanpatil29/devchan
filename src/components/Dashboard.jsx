import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

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
  const [userData, setUserData] = useState(null);

  const navigate = useNavigate();

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

      fetch(`http://localhost:3000/user/me/${u}`)
      .then(res => res.json())
      .then(data => {
        setUserData(data);
        console.log("Full user data:", data);
      })
      .catch(err => console.error(err));
    }
  }, [searchParams]);

  const handleLogin = async () => {
    try {
      const res = await fetch("http://localhost:3000/auth/logout", {
        method: "GET",
        credentials: "include"
      });

      const data = await res.json();
      console.log(data.message);

      navigate("/");
    } catch(error) {
      console.error("Logout failed: ", error);
    }
  }

  return (
    <section className="bg-black exo-font relative h-full">

      <header className="bg-black shadow shadow-zinc-800 fixed top-0 left-0 w-full h-16 flex items-center px-6 z-50">
        <div>
          <p className="text-white text-xl">DEVCHAN</p>
        </div>

        <div className="flex items-center ml-auto">
          <button className="bg-white px-3 py-2 rounded text-xl">Logout</button>
          {userData && (
            <button onClick={() => {setOpenProfileMenu(!openProfileMenu)}} className="cursor-pointer">
            <img 
              src={userData.avatar} 
              alt="avatar" 
              className="w-10 h-10 rounded-full border border-zinc-800 ml-2"
            />
            </button>
          )}

          {openProfileMenu && 
            (
            <div className="absolute top-18 right-6 bg-[#F7F4EA] border shadow-lg rounded-md w-48 py-2 z-50">
              <button className="block w-full text-left px-4 py-2 hover:bg-gray-100">Profile</button>
              <button className="block w-full text-left px-4 py-2 hover:bg-gray-100">Settings</button>
              <button className="block w-full text-left px-4 py-2 hover:bg-gray-100">Set Status</button>
              <button 
              onClick={handleLogin}
              className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-500 cursor-pointer">Logout</button>
            </div>
            )
          }
        </div>
      </header>

      <div className="pt-24 flex flex-col items-center">
        <TypingText
          text={`Welcome, ${username}!\n We request you to complete your profile so you can find the best matches for you to connect with.`}
          speed={60} // smaller = faster typing
        />

        <button className="bg-zinc-900 border border-zinc-800 text-white rounded-md p-3 mt-3">Find your match</button>
      </div>

      <div className="bg-zinc-950 pt-24 flex flex-col items-center w-[1000px] h-screen rounded-lg mx-auto my-10">
        {userData && (
          <div className="text-center mt-6 text-white">
            <img 
              src={userData.avatar} 
              alt="avatar" 
              className="w-24 h-24 rounded-full mx-auto border border-zinc-800"
            />
    
            <p className="text-xl">GitHub: {userData.username}</p>
            <p className="text-gray-400 mt-2">{userData.githubBio}</p>

            <div className="flex gap-6 justify-center mt-4">
            <p>Followers: {userData.followers}</p>
            <p>Following: {userData.following}</p>
            <p>Repos: {userData.repos}</p>
            </div>
          </div>
        )}
        
      </div>
    </section>
  );
};

export default Dashboard;
