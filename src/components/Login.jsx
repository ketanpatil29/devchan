import React from 'react';

const Login = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="exo-font font-bold absolute top-40 left-135 text-[100px] mb-4">DEV</h1>
      <h1 className="exo-font font-light absolute top-40 left-183 text-[100px] mb-4">ELOPER</h1>
      <h1 className="exo-font font-bold absolute top-70 left-250 text-[100px] mb-4">CHAN</h1>
      <a
        href="http://localhost:3000/auth/github"
        className="bg-emerald-400 px-4 py-2 rounded text-xl"
      >
        Login with GitHub
      </a>
    </div>
  );
};

export default Login;
