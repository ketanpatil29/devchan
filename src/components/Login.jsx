import React from 'react';
import { FaGithub } from "react-icons/fa";

const Login = () => {
  return (
    <div className="bg-black flex flex-col items-center justify-center h-screen">
      <h1 className="exo-font font-bold absolute top-40 left-135 text-[#F7F4EA] text-[100px] mb-4">DEV</h1>
      <h1 className="exo-font font-light absolute top-40 left-183 text-[#F7F4EA] text-[100px] mb-4">ELOPER</h1>
      <h1 className="exo-font font-bold absolute top-70 left-220 text-[#F7F4EA] text-[100px] mb-4">CHAN</h1>
      <h1 className="exo-font font-light absolute top-70 left-286 text-[#F7F4EA] text-[100px] mb-4">NEL</h1>
      <a
        href={`${import.meta.env.VITE_API_URL}/auth/github`}
        className="flex bg-zinc-900 px-4 py-2 rounded text-[#F7F4EA] border border-zinc-800 text-xl"
      >
        Login with GitHub
        <FaGithub className="w-7 h-7 ml-3" />
      </a>
    </div>
  );
};

export default Login;
