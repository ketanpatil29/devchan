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

  return (
    <section className="bg-black exo-font relative h-full">

      <div className="w-[60%] mx-auto flex flex-col items-center">
        <TypingText
          text={`Welcome, ${username}!\n We request you to complete your profile so you can find the best matches for you to connect with.`}
          speed={60} // smaller = faster typing
        />

        <button onClick={() => navigate("/profile")} className="bg-zinc-900 border border-zinc-800 text-white rounded-md p-3 mt-3 cursor-pointer">Complete your profile</button>
      </div>

      <div className="bg-zinc-950 border border-zinc-800 pt-10 flex flex-col items-center w-[1000px] h-screen rounded-lg mx-auto my-10">
        <button className="bg-zinc-900 border border-zinc-800 text-white rounded-md p-3 mt-3 cursor-pointer">Find your match</button>
      </div>
    </section>
  );
};

export default Dashboard;