import React from "react";

import devchanLogo from "../assets/devchanlogo.png";

import { FaGithub } from "react-icons/fa";

const Footer = () => {
    return (
        <footer className="border-t border-zinc-800 bg-black text-zinc-400 text-xs">

            <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col md:flex-row justify-center gap-4">
                {/* Center links */}
                <div className="flex flex-wrap items-center justify-center gap-4">
                    <a href="https://github.com/ketanpatil29/devchan" target="_blank" rel="noopener noreferrer" className="inline-flex items-center transition-colors hover:text-white">
                        <FaGithub className="w-7 h-7" />
                    </a>
                    <a className="hover:text-white" href="#">copyright</a>
                    <a className="hover:text-white" href="#">Docs</a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
