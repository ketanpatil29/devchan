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
    <p
      className="text-white text-2xl mt-4 text-center w-[80%]"
      style={{ whiteSpace: "pre-line" }}
    >
      {displayMessage}
    </p>
  );
};

const Dashboard = () => {
  const [searchParams] = useSearchParams();
  const [username, setUsername] = useState("");
  const [token, setToken] = useState("");
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  // MATCHING
  const [currentMatch, setCurrentMatch] = useState(null);
  const [matchLoading, setMatchLoading] = useState(false);
  const [noMatch, setNoMatch] = useState(false);

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

      fetch(`https://devchan.onrender.com/user/me/${u}`)
        .then((res) => res.json())
        .then((data) => {
          setUserData(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [searchParams]);

  if (loading) {
    return (
      <section className="bg-black exo-font h-screen flex items-center justify-center">
        <p className="text-white text-xl">Loading...</p>
      </section>
    );
  }

  const profileCompleted = userData?.profileCompleted === true;

  // FETCH MATCH FUNCTION
  const fetchMatch = () => {
    setMatchLoading(true);
    setNoMatch(false);

    fetch(`https://devchan.onrender.com/user/match/${username}`)
      .then((res) => res.json())
      .then((data) => {
        if (data?.noMoreMatches) {
          setNoMatch(true);
          setCurrentMatch(null);
        } else {
          setCurrentMatch(data);
        }
        setMatchLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setMatchLoading(false);
      });
  };

  return (
    <section className="bg-black exo-font relative min-h-screen pb-20">

      {/* ONLY show if profile NOT completed */}
      {!profileCompleted && (
        <div className="w-[60%] mx-auto flex flex-col items-center mt-10">
          <TypingText
            text={`Welcome, ${username}!\nWe request you to complete your profile so you can find the best matches for you to connect with.`}
            speed={60}
          />

          <button
            onClick={() => navigate("/profile")}
            className="bg-zinc-900 border border-zinc-800 text-white rounded-md p-3 mt-4 cursor-pointer hover:bg-zinc-800 transition"
          >
            Complete your profile
          </button>
        </div>
      )}

      {/* MATCH CARD */}
      <div className="bg-zinc-950 border border-zinc-800 pt-10 flex flex-col items-center w-[1000px] h-[550px] rounded-lg mx-auto mt-16 shadow-xl">

        <button
          onClick={fetchMatch}
          className="bg-zinc-900 border border-zinc-800 text-white rounded-md p-3 cursor-pointer hover:bg-zinc-800 transition"
        >
          Find your match
        </button>

        {/* LOADING STATE */}
        {matchLoading && (
          <p className="text-zinc-400 mt-8 text-lg">Searching...</p>
        )}

        {/* NO MATCH FOUND */}
        {noMatch && (
          <p className="text-zinc-400 mt-8 text-lg">
            No more matches found. Come back later!
          </p>
        )}

        {/* SHOW MATCH CARD */}
        {currentMatch && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 mt-6 w-[80%] text-white flex flex-col items-center">

            <img
              src={currentMatch.avatar}
              alt="avatar"
              className="w-32 h-32 rounded-full border border-zinc-700"
            />

            <h2 className="text-2xl font-bold mt-4">{currentMatch.username}</h2>

            <p className="text-zinc-400 text-center mt-2 w-[70%]">
              {currentMatch.bio || "No bio available."}
            </p>

            <div className="mt-4 flex gap-2 flex-wrap justify-center">
              {currentMatch.languages?.map((lang) => (
                <span
                  key={lang}
                  className="bg-zinc-800 text-zinc-300 px-3 py-1 rounded-md text-sm"
                >
                  {lang}
                </span>
              ))}
            </div>

            <button
              onClick={fetchMatch}
              className="mt-6 bg-zinc-800 border border-zinc-700 px-4 py-2 rounded-md text-white hover:bg-zinc-700 transition"
            >
              Next Match
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default Dashboard;
