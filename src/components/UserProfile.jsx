import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const UserProfile = () => {
  const { username } = useParams();
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/user/me/${username}`, {
      credentials: "include"
    })
      .then(res => res.json())
      .then(data => setUser(data));
  }, [username]);

  if (!user) return <p className="text-white text-center mt-10">Loading...</p>;

  return (
    <section className="bg-black min-h-screen p-6 text-white">
      <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-6 max-w-2xl mx-auto">
        <div className="flex flex-col items-center">
          <img src={user.avatar} className="w-32 h-32 rounded-full border" />
          <h2 className="text-2xl font-bold mt-2">{user.username}</h2>
          <p className="text-zinc-400 mt-1">{user.githubBio}</p>
        </div>

        <div className="mt-4">
          <p><span className="font-semibold">About:</span> {user.about}</p>
          <p><span className="font-semibold">Role:</span> {user.role}</p>
          <p><span className="font-semibold">Experience:</span> {user.experience} yrs</p>

          <p className="mt-2 font-semibold">Skills:</p>
          <div className="flex flex-wrap gap-2 mt-1">
            {user.languages?.map(lang => (
              <span key={lang} className="bg-zinc-800 px-2 py-1 rounded-full text-xs">{lang}</span>
            ))}
          </div>

          <p className="mt-2 font-semibold">Interests:</p>
          <div className="flex flex-wrap gap-2 mt-1">
            {user.interests?.map(interest => (
              <span key={interest} className="bg-zinc-800 px-2 py-1 rounded-full text-xs">{interest}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default UserProfile;
