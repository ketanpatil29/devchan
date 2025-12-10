import React from 'react';
import { FaGithub } from "react-icons/fa";

const Login = () => {
  return (
    <div className="bg-black flex flex-col items-center justify-center min-h-screen px-4">
      {/* Text Section */}
      <div className="text-center mb-10">
        <h1 className="exo-font font-bold text-[#F7F4EA] text-6xl sm:text-8xl md:text-[100px] leading-none">
          DEV
        </h1>
        <h1 className="exo-font font-light text-[#F7F4EA] text-6xl sm:text-8xl md:text-[100px] leading-none">
          ELOPER
        </h1>
        <h1 className="exo-font font-bold text-[#F7F4EA] text-6xl sm:text-8xl md:text-[100px] leading-none">
          CHAN
        </h1>
        <h1 className="exo-font font-light text-[#F7F4EA] text-6xl sm:text-8xl md:text-[100px] leading-none">
          NEL
        </h1>
      </div>

      {/* GitHub Login Button */}
      <a
        href="https://devchan.onrender.com/auth/github"
        className="flex items-center bg-zinc-900 px-4 py-2 rounded text-[#F7F4EA] border border-zinc-800 text-xl hover:bg-zinc-800 transition"
      >
        Login with GitHub
        <FaGithub className="w-7 h-7 ml-3" />
      </a>
    </div>
  );
};

export default Login;
