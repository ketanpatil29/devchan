import React, { useEffect, useState } from "react";

const Profile = () => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const username = localStorage.getItem("githubUsername");
    const token = localStorage.getItem("githubToken");

    if (!username) {
      console.error("Username missing. User might not be logged in.");
      return;
    }

    fetch(`http://localhost:3000/user/me/${username}`)
      .then(res => res.json())
      .then(data => {
        console.log("FULL PROFILE DATA:", data);
        setUserData(data);
      })
      .catch(err => console.error(err));
  }, []);

  if (!userData) {
    return (
      <section className="text-white text-center pt-24">
        Loading profile...
      </section>
    );
  }

  return (
    <section className="bg-black max-h-screen">
      <div className="bg-zinc-950 border border-zinc-800 pt-10 flex flex-col items-center w-full max-w-[1000px] h-screen rounded-lg mx-auto mt-5 mb-10">
        
      <div className="text-center text-white mt-5">

        <img 
          src={userData.avatar}
          alt="avatar"
          className="w-44 h-44 rounded-full mx-auto border border-zinc-800"
        />
        <p className="text-xl mt-3">GitHub: {userData.username}</p>
        <p className="text-gray-400 mt-2">{userData.githubBio}</p>

        <div className="flex gap-6 justify-center mt-4">
          <p>Followers: {userData.followers}</p>
          <p>Following: {userData.following}</p>
          <p>Repos: {userData.repos}</p>
        </div>

        <p>Skills</p>
      </div>

      </div>
    </section>
  );
};

export default Profile;
