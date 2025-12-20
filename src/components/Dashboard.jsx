import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

import sendButton from "../assets/send.png";

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
      className="text-white text-lg sm:text-xl md:text-2xl mt-4 text-center w-full sm:w-[80%]"
      style={{ whiteSpace: "pre-line" }}
    >
      {displayMessage}
    </p>
  );
};

const Dashboard = () => {
  const [searchParams] = useSearchParams();
  const [username, setUsername] = useState("");
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [currentMatch, setCurrentMatch] = useState(null);
  const [matchLoading, setMatchLoading] = useState(false);
  const [noMatch, setNoMatch] = useState(false);

  const [friendRequests, setFriendRequests] = useState([]);
  const [sendingRequest, setSendingRequest] = useState(false);
  const [requestSent, setRequestSent] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const u = searchParams.get("username");

    if (u) {
      setUsername(u);
      localStorage.setItem("githubUsername", u);

      fetch(`${import.meta.env.VITE_API_URL}/user/me/${u}`, {
        credentials: "include",
      })
        .then((res) => res.json())
        .then((data) => {
          setUserData(data);
          setFriendRequests(data.friendRequests || []);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [searchParams]);

  if (loading) {
    return (
      <section className="bg-black h-screen flex items-center justify-center">
        <p className="text-white text-xl">Loading...</p>
      </section>
    );
  }

  const profileCompleted = userData?.profileCompleted === true;

  const fetchMatch = () => {
    setMatchLoading(true);
    setNoMatch(false);

    fetch(`${import.meta.env.VITE_API_URL}/user/match/${username}`, {
      credentials: "include",
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
      .catch(() => setMatchLoading(false));
  };

  const sendFriendRequest = async () => {
    if (!currentMatch) return;

    setSendingRequest(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/user/connect`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          fromUsername: username,
          toUsername: currentMatch.username,
        }),
      });

      if (res.ok) {
        setRequestSent(true);
      }
    } finally {
      setSendingRequest(false);
    }
  };

  const acceptFriendRequest = async (fromUserId) => {
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
      prev.filter(
        (req) => (req.from._id || req.from).toString() !== fromUserId
      )
    );
  };

  return (
    <section className="bg-black min-h-screen px-4 pb-24">
      <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr_340px] gap-6 max-w-full mx-auto">

        {/* LEFT (hidden on mobile) */}
        <div className="hidden lg:block mt-6">
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
            <div className="flex flex-col items-center mt-10 text-center">
              <TypingText
                text={`Welcome, ${username}!\nComplete your profile to find better matches.`}
                speed={60}
              />
              <button
                onClick={() => navigate("/profile")}
                className="bg-zinc-900 border border-zinc-800 text-white rounded-md p-3 mt-4 w-full sm:w-auto"
              >
                Complete your profile
              </button>
            </div>
          )}

          <div className="bg-zinc-950 border border-zinc-800 mt-16 rounded-lg p-6 flex flex-col items-center w-full sm:w-[95%] md:w-[90%] lg:w-[1000px] mx-auto">
            <button
              onClick={fetchMatch}
              className="bg-zinc-900 border border-zinc-800 text-white rounded-md p-3 w-full sm:w-auto"
            >
              Find your match
            </button>

            {matchLoading && (
              <p className="text-zinc-400 mt-8">Searching...</p>
            )}

            {noMatch && (
              <p className="text-zinc-400 mt-8">No more matches found.</p>
            )}

            {currentMatch && (
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 mt-6 w-full max-w-3xl text-white">

                <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-4">

                  <div className="flex flex-col items-center text-center">
                    <img
                      onClick={() => navigate(`/user/${currentMatch.username}`)}
                      src={currentMatch.avatar}
                      className="w-24 h-24 rounded-full border border-zinc-700 cusrot-pointer"
                    />

                    <h2 className="text-lg font-semibold mt-3">
                      {currentMatch.username}
                    </h2>

                    <p className="text-zinc-400 text-sm mt-1 line-clamp-2">
                      {currentMatch.githubBio || "No bio available"}
                    </p>

                    <div className="flex flex-wrap gap-1 mt-3 justify-center">
                      {currentMatch.languages?.slice(0, 4).map((lang) => (
                        <span
                          key={lang}
                          className="bg-zinc-800 px-2 py-0.5 rounded-full text-xs"
                        >
                          {lang}
                        </span>
                      ))}
                    </div>

                    <div className="flex gap-2 mt-4 w-full">
                      <button
                        onClick={fetchMatch}
                        className="flex-1 bg-zinc-800 hover:bg-zinc-700 px-3 py-1.5 rounded-md text-sm"
                      >
                        Next
                      </button>

                      {!currentMatch.isFriend && !currentMatch.requestSent && (
                        <button
                          onClick={sendFriendRequest}
                          disabled={sendingRequest}
                          className="flex-1 bg-green-600 hover:bg-green-500 px-3 py-1.5 rounded-md text-sm"
                        >
                          {sendingRequest ? "..." : "Connect"}
                        </button>
                      )}
                    </div>

                    {currentMatch.isFriend && (
                      <p className="mt-2 text-xs text-green-400">
                        ✔ Already your friend
                      </p>
                    )}

                    {currentMatch.requestSent && (
                      <p className="mt-2 text-xs text-yellow-400">
                        ⏳ Request sent
                      </p>
                    )}
                  </div>

                  <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-sm space-y-2">
                    <p>
                      <span className="text-zinc-400">Role:</span>{" "}
                      {currentMatch.role || "—"}
                    </p>

                    <p>
                      <span className="text-zinc-400">Experience:</span>{" "}
                      {currentMatch.experience || 0} yrs
                    </p>

                    <p className="text-zinc-400">About</p>
                    <p className="text-zinc-300 text-sm leading-snug">
                      {currentMatch.about || "No about info provided."}
                    </p>

                    <div>
                      <p className="text-zinc-400 mb-1">Interests</p>
                      <div className="flex flex-wrap gap-1">
                        {currentMatch.interests?.length ? (
                          currentMatch.interests.map((i) => (
                            <span
                              key={i}
                              className="bg-zinc-800 px-2 py-0.5 rounded-full text-xs"
                            >
                              {i}
                            </span>
                          ))
                        ) : (
                          <span className="text-zinc-500 text-xs">—</span>
                        )}
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            )}

          </div>
        </div>

        {/* RIGHT (moves below on mobile) */}
        <div className="mt-6">
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4">
            <h2 className="text-white font-semibold mb-2">Friends</h2>

            {friendRequests.length === 0 && (
              <p className="text-zinc-400 text-sm">No requests</p>
            )}

            {friendRequests.map((req) => (
              <div
                key={req.from._id}
                className="flex justify-between items-center bg-zinc-900 p-2 rounded-md mb-2"
              >
                <span className="text-white text-sm">
                  {req.from.username}
                </span>
                <button
                  onClick={() => acceptFriendRequest(req.from._id)}
                  className="bg-blue-600 px-2 py-1 rounded text-sm"
                >
                  Accept
                </button>
              </div>
            ))}

            {userData.friends?.map((friend) => (
              <div
                key={friend._id}
                className="flex justify-between items-center bg-zinc-900 p-2 rounded-md mt-2"
              >
                <div className="flex gap-2">
                  <img
                    src={friend.avatar}
                    alt="avatar"
                    className="w-8 h-8 rounded-full border border-zinc-800 cursor-pointer"
                  />
                  <span className="text-white text-sm">{friend.username}</span>
                </div>
                <button
                  onClick={() => navigate(`/chat/${friend.username}`)}
                  className="p-2 rounded-md bg-transparent hover:bg-zinc-800 transition"
                >
                  <img
                    src={sendButton}
                    alt="Chat"
                    className="w-5 h-5 opacity-80 hover:opacity-100"
                  />
                </button>

              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default Dashboard;
