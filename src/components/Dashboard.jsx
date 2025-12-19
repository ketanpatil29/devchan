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

  const [currentMatch, setCurrentMatch] = useState(null);
  const [matchLoading, setMatchLoading] = useState(false);
  const [noMatch, setNoMatch] = useState(false);

  // 🔥 FRIEND SYSTEM
  const [friendRequests, setFriendRequests] = useState([]);
  const [sendingRequest, setSendingRequest] = useState(false);

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

      fetch(`${import.meta.env.VITE_API_URL}/user/me/${u}`, {
        method: "GET",
        credentials: "include"
      })
        .then((res) => res.json())
        .then((data) => {
          setUserData(data);
          setFriendRequests(data.friendRequests || []);
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

  const fetchMatch = () => {
    setMatchLoading(true);
    setNoMatch(false);

    fetch(`${import.meta.env.VITE_API_URL}/user/match/${username}`, {
      method: "GET",
      credentials: "include"
    })
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

  // 🔥 SEND FRIEND REQUEST
  const sendFriendRequest = async () => {
    if (!currentMatch) return;

    setSendingRequest(true);

    try {
      await fetch(`${import.meta.env.VITE_API_URL}/user/connect`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          fromUsername: username,
          toUsername: currentMatch.username,
        }),
      });
    } catch (err) {
      console.error(err);
    }

    setSendingRequest(false);
  };

  // 🔥 ACCEPT FRIEND REQUEST
  const acceptFriendRequest = async (fromUserId) => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/user/accept`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          fromUserId,
          toUserId: userData._id,
        }),
      });

      setFriendRequests((prev) =>
        prev.filter((req) => req.from._id !== fromUserId)
      );
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <section className="bg-black exo-font relative min-h-screen pb-20 px-4 sm:px-6 lg:px-0">
      <div className="grid grid-cols-3 lg:grid-cols-[300px_1fr_340px] max-w-full mx-4 gap-8">

        {/* LEFT */}
        <div className="space-y-6 mt-4">
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4">
            <h2 className="text-white font-semibold mb-2">Community</h2>
            <p className="text-zinc-400 text-sm">
              Join dev discussions, tips, and help.
            </p>
          </div>
        </div>

        {/* CENTER */}
        <div>
          {!profileCompleted && (
            <div className="w-full sm:w-[80%] md:w-[60%] mx-auto flex flex-col items-center mt-10 text-center">
              <TypingText
                text={`Welcome, ${username}!\nWe request you to complete your profile so you can find the best matches for you to connect with.`}
                speed={60}
              />

              <button
                onClick={() => navigate("/profile")}
                className="bg-zinc-900 border border-zinc-800 text-white rounded-md p-3 mt-4 cursor-pointer hover:bg-zinc-800 transition w-full sm:w-auto"
              >
                Complete your profile
              </button>
            </div>
          )}

          <div className="bg-zinc-950 border border-zinc-800 pt-10 flex flex-col items-center w-full sm:w-[90%] md:w-[1000px] max-w-full h-auto md:h-[550px] rounded-lg mx-auto mt-16 shadow-xl px-4">

            <button
              onClick={fetchMatch}
              className="bg-zinc-900 border border-zinc-800 text-white rounded-md p-3 cursor-pointer hover:bg-zinc-800 transition w-full sm:w-auto"
            >
              Find your match
            </button>

            {matchLoading && (
              <p className="text-zinc-400 mt-8 text-lg text-center">Searching...</p>
            )}

            {noMatch && (
              <p className="text-zinc-400 mt-8 text-lg text-center">
                No more matches found. Come back later!
              </p>
            )}

            {currentMatch && (
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 mt-6 mb-6 w-full sm:w-[80%] text-white flex flex-col items-center">

                <img
                  src={currentMatch.avatar}
                  alt="avatar"
                  className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border border-zinc-700"
                />

                <h2 className="text-xl sm:text-2xl font-bold mt-4 text-center">
                  {currentMatch.username}
                </h2>

                <p className="text-zinc-400 text-center mt-2 w-full sm:w-[70%]">
                  {currentMatch.githubBio || "No bio available."}
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
                  className="mt-6 bg-zinc-800 border border-zinc-700 px-4 py-2 rounded-md text-white hover:bg-zinc-700 transition w-full sm:w-auto"
                >
                  Next Match
                </button>

                <button
                  onClick={sendFriendRequest}
                  disabled={sendingRequest}
                  className="mt-3 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-md text-white transition w-full sm:w-auto"
                >
                  {sendingRequest ? "Sending..." : "Connect 🤝"}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT */}
        <div className="space-y-6 mt-2">
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 h-[260px] flex flex-col">
            <h2 className="text-white font-semibold mb-2 flex items-center gap-2">
              Friends
              {friendRequests.length > 0 && (
                <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
              )}
            </h2>

            <div className="space-y-2 overflow-y-auto">
              {friendRequests.length === 0 && (
                <p className="text-zinc-400 text-sm">No requests</p>
              )}

              {friendRequests.map((req) => (
                <div
                  key={req.from._id}
                  className="flex justify-between items-center bg-zinc-900 border border-zinc-800 p-2 rounded-md"
                >
                  <span className="text-white text-sm">
                    {req.from.username}
                  </span>

                  <button
                    onClick={() => acceptFriendRequest(req.from._id)}
                    className="bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded text-sm text-white"
                  >
                    Accept
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Dashboard;
