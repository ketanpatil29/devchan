import React, { useEffect, useState } from "react";

const Profile = () => {
  const [userData, setUserData] = useState(null);

  const [skills, setSkills] = useState([]);
  const [interests, setInterests] = useState([]);
  const [lookingFor, setLookingFor] = useState([]);
  const [ about, setAbout ] = useState("");
  const [role, setRole] = useState("");
  const [experience, setExperience] = useState(0);

  const [saving, setSaving] = useState(false);

  // Fetch GitHub + DB stored profile
  useEffect(() => {
    const username = localStorage.getItem("githubUsername");

    fetch(`${import.meta.env.VITE_API_URL}/user/me/${username}`, {
      method: "GET",
      credentials: "include"
    })
      .then(res => res.json())
      .then(data => {
        setUserData(data);

        // Prefill data if exists
        setSkills(data.languages || []);
        setInterests(data.interests || []);
        setLookingFor(data.lookingFor || []);
        setAbout(data.about || "");
        setRole(data.role || "");
        setExperience(data.experience || 0);
      });
  }, []);

  const toggleArrayItem = (arr, setter, item) => {
    if (arr.includes(item)) setter(arr.filter(i => i !== item));
    else setter([...arr, item]);
  };

  const saveProfile = async () => {
    setSaving(true);
    const username = userData.username;

    const body = {
      languages: skills,
      interests,
      lookingFor,
      about,
      role,
      experience,
    };

    await fetch(`${import.meta.env.VITE_API_URL}/auth/user/update/${username}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    setSaving(false);
    alert("Profile updated successfully!");
  };

  if (!userData) {
    return <section className="text-white text-center pt-24">Loading profile...</section>;
  }

  return (
    <section className="bg-black min-h-screen py-10">
      <div className="bg-zinc-950 border border-zinc-800 pt-10 pb-10 flex flex-col items-center w-full max-w-[900px] rounded-lg mx-auto">

        <img
          src={userData.avatar}
          alt="avatar"
          className="w-36 h-36 rounded-full border border-zinc-800"
        />

        <p className="text-xl text-white mt-3">{userData.username}</p>
        <p className="text-gray-400 mt-2 px-10">{userData.githubBio}</p>

        {/* Followers */}
        <div className="flex gap-6 text-gray-300 mt-3">
          <p>Followers: {userData.followers}</p>
          <p>Following: {userData.following}</p>
          <p>Repos: {userData.repos}</p>
        </div>

        {/* FORM START */}
        <div className="w-[80%] mt-10 text-white">

          <label className="block text-sm">About</label>
          <textarea
            className="w-full bg-zinc-900 border border-zinc-700 p-2 rounded mt-1"
            placeholder="Software devloper from India. Looking for friends to contribute on my projects"
            value={about}
            onChange={(e) => setAbout(e.target.value)}
          />

          {/* ROLE */}
          <label className="block mt-4 text-sm">Your Role</label>
          <input
            className="w-full bg-zinc-900 border border-zinc-700 p-2 rounded mt-1"
            placeholder="Full-stack Developer, Backend, ML Engineer..."
            value={role}
            onChange={(e) => setRole(e.target.value)}
          />

          {/* EXPERIENCE */}
          <label className="block mt-4 text-sm">Experience (years)</label>
          <input
            type="number"
            className="w-full bg-zinc-900 border border-zinc-700 p-2 rounded mt-1"
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
          />

          {/* SKILLS */}
          <p className="mt-6 text-sm">Skills (from GitHub)</p>
          <div className="flex flex-wrap gap-2 mt-2">
            {skills.map((lang) => (
              <span
                key={lang}
                className="px-3 py-1 bg-zinc-800 rounded-full text-sm"
              >
                {lang}
              </span>
            ))}
          </div>

          {/* INTERESTS */}
          <p className="mt-6 text-sm">Your Interests</p>
          <div className="flex flex-wrap gap-3 mt-3">
            {["AI", "Web Dev", "Backend", "ML", "Cybersecurity", "Open Source"].map((i) => (
              <button
                key={i}
                onClick={() => toggleArrayItem(interests, setInterests, i)}
                className={`px-3 py-1 rounded-full border ${interests.includes(i)
                    ? "bg-green-600 border-green-600"
                    : "bg-zinc-900 border-zinc-700"
                  }`}
              >
                {i}
              </button>
            ))}
          </div>

          {/* LOOKING FOR */}
          <p className="mt-6 text-sm">Looking For</p>
          <div className="flex flex-wrap gap-3 mt-3">
            {["Collaboration", "Study Partner", "Project Teammate", "Mentor", "Mentee"].map((i) => (
              <button
                key={i}
                onClick={() => toggleArrayItem(lookingFor, setLookingFor, i)}
                className={`px-3 py-1 rounded-full border ${lookingFor.includes(i)
                    ? "bg-blue-600 border-blue-600"
                    : "bg-zinc-900 border-zinc-700"
                  }`}
              >
                {i}
              </button>
            ))}
          </div>

          <button
            onClick={saveProfile}
            className="w-full bg-green-600 py-3 rounded mt-8"
          >
            {saving ? "Saving..." : "Save Profile"}
          </button>
        </div>
      </div>
    </section>
  );
};

export default Profile;
