import Link from "next/link";
import React from "react";

const Header = () => {
  return (
    <header className="fixed top-0 z-50 w-full border-b border-solid border-[#e7ebf3] dark:border-white/10 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-3 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2 text-primary">
          <div className="size-6">
            <svg
              fill="currentColor"
              viewBox="0 0 48 48"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M4 42.4379C4 42.4379 14.0962 36.0744 24 41.1692C35.0664 46.8624 44 42.2078 44 42.2078L44 7.01134C44 7.01134 35.068 11.6577 24.0031 5.96913C14.0971 0.876274 4 7.27094 4 7.27094L4 42.4379Z"></path>
            </svg>
          </div>
          <h2 className="text-[#0d121b] dark:text-white text-xl font-extrabold tracking-tight">
            TraderFlow
          </h2>
        </div>
        <nav className="hidden md:flex items-center gap-10">
          <Link
            className="text-sm font-medium hover:text-primary transition-colors"
            href="#"
          >
            Features
          </Link>
          <Link
            className="text-sm font-medium hover:text-primary transition-colors"
            href="#"
          >
            Pricing
          </Link>
          <Link
            className="text-sm font-medium hover:text-primary transition-colors"
            href="#"
          >
            Resources
          </Link>
          <Link
            className="text-sm font-medium hover:text-primary transition-colors"
            href="#"
          >
            Company
          </Link>
        </nav>
        <div className="flex items-center gap-3">
          <Link
            href={"/sign-in"}
            className="hidden sm:flex px-4 py-2 text-sm font-semibold hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-all"
          >
            Login
          </Link>
          <Link
            href={"/sign-up"}
            className="bg-primary text-white px-5 py-2 rounded-lg text-sm font-bold shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
          >
            Get Started
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
