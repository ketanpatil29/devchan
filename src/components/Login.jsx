import React from 'react';

const Login = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl mb-4">Welcome to DEVCHAN</h1>
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
