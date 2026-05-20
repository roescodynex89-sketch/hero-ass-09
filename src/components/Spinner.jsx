"use client";

import React from "react";
import { RiseLoader } from "react-spinners";

export default function Spinner() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-slate-50 dark:bg-linear-to-br dark:from-[#020617] dark:via-[#0F172A] dark:to-dark-secondary relative overflow-hidden transition-colors duration-300 z-50">
      {/* Ambient Glow behind spinner */}
      <div className="hidden dark:block absolute w-75 h-75 bg-cyan-500/10 blur-[80px] rounded-full pointer-events-none" />

      <div className="flex flex-col items-center justify-center space-y-6 relative z-10">
        <RiseLoader color="#22d3ee" size={18} margin={4} speedMultiplier={1} />

        <p className="text-slate-600 dark:text-cyan-400 text-base font-bold  uppercase animate-pulse pt-4">
          Synchronizing Workspace...
        </p>
      </div>
    </div>
  );
}
