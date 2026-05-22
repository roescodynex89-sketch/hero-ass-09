"use client";

import React from "react";
import Link from "next/link";
import { FiArrowLeft, FiHome } from "react-icons/fi";
import { TbRocketOff } from "react-icons/tb";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-linear-to-br dark:from-[#020617] dark:via-[#0F172A] dark:to-[#111827] text-slate-900 dark:text-slate-100 relative overflow-hidden transition-colors duration-300 font-sans p-6 text-center">
      <div className="hidden dark:block absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none z-0" />
      <div className="hidden dark:block absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-violet-500/10 blur-[120px] rounded-full pointer-events-none z-0" />

      <div className="max-w-md w-full space-y-8 relative z-10">
        <div className="flex flex-col items-center justify-center space-y-4 group">
          <div className="p-6 bg-slate-950 dark:bg-white/5 rounded-3xl border border-slate-200 dark:border-white/10 shadow-xl dark:shadow-[0_0_35px_rgba(239,68,68,0.15)] animate-[pulse_2.5s_infinite_ease-in-out]">
            <TbRocketOff className="text-7xl sm:text-8xl text-rose-500 dark:text-rose-400 -rotate-12 transform transition-transform duration-500 group-hover:scale-110" />
          </div>

          {/* Big 404 Error Code */}
          <h1 className="text-8xl font-black tracking-extrawide bg-linear-to-r from-slate-900 to-slate-600 dark:from-cyan-400 dark:to-violet-400 bg-clip-text text-transparent uppercase">
            404
          </h1>
        </div>

        {/* Message Layer */}
        <div className="space-y-3">
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
            Lost in Cyberspace?
          </h2>
          <p className="text-base text-slate-600 dark:text-slate-400 font-medium leading-relaxed max-w-sm mx-auto">
            The workspace or destination module you are looking for doesn't
            exist or has been shifted to a new coordinate.
          </p>
        </div>

        {/*action */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          {/* Back Button */}
          <button
            onClick={() => window.history.back()}
            className="w-full sm:w-auto border border-slate-200 dark:border-white/10 px-6 py-3.5 rounded-xl bg-white dark:bg-[#0F172A]/40 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/40 flex items-center justify-center gap-2 text-sm font-bold transition-all active:scale-[0.98] shadow-sm cursor-pointer"
          >
            <FiArrowLeft className="w-4 h-4" />
            <span>Go Back</span>
          </button>

          {/* Home Button */}
          <Link
            href="/"
            className="w-full sm:w-auto bg-slate-900 dark:bg-linear-to-r dark:from-cyan-400 dark:to-violet-500 text-white dark:text-slate-950 px-6 py-3.5 rounded-xl font-bold text-sm tracking-wide active:scale-[0.98] hover:scale-[1.01] dark:hover:shadow-[0_0_25px_rgba(34,211,238,0.2)] transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <FiHome className="w-4 h-4 stroke-[2.5]" />
            <span>Return Workspace</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
