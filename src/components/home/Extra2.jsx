"use client";

import React from "react";
import {
  FiShare2,
  FiUsers,
  FiMessageSquare,
  FiTrendingUp,
} from "react-icons/fi";

const features = [
  {
    title: "Share Innovative Ideas",
    desc: "Securely document and pitch your innovative concepts to global builders.",
    icon: FiShare2,
  },
  {
    title: "Collaborate With Creators",
    desc: "Find technical co-founders, talented developers, and business strategists.",
    icon: FiUsers,
  },
  {
    title: "Get Community Feedback",
    desc: "Validate market demand with direct upvotes, reviews, and dynamic polls.",
    icon: FiMessageSquare,
  },
  {
    title: "Discover Trending Concepts",
    desc: "Stay ahead of the curve by analyzing decentralized market gaps and global trends.",
    icon: FiTrendingUp,
  },
];

export default function Extra2() {
  return (
    <section className="w-full py-20 bg-slate-50 dark:bg-slate-900/40 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6">
        {/* Left-Right Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Text & Illustration Column */}
          <div className="lg:col-span-5 space-y-6 text-center lg:text-left">
            <h2 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight text-light-text dark:text-dark-text">
              Why Innovators Choose IdeaVault
            </h2>
            <p className="text-base text-light-text-muted dark:text-dark-text-muted leading-relaxed max-w-xl mx-auto lg:mx-0">
              A comprehensive sandbox environment engineered specifically for
              founders, engineers, and dreamers to turn blueprints into scalable
              tech companies.
            </p>

            <div className="hidden lg:block p-6 rounded-2xl border border-white/10 bg-linear-to-br from-accent-cyan/10 to-accent-purple/10 backdrop-blur-md relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-accent-cyan/20 rounded-full filter blur-xl" />
              <p className="text-xs font-mono text-accent-cyan uppercase tracking-widest">
                Network Analytics
              </p>
              <p className="text-xl font-bold mt-2 text-light-text dark:text-white">
                Active Global Sandbox
              </p>
              <div className="mt-4 flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-sm font-semibold text-emerald-500">
                  4.8k Builders Online Now
                </span>
              </div>
            </div>
          </div>

          {/* Right Cards Column */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div
                  key={index}
                  className="p-6 rounded-2xl border border-slate-100 dark:border-white/5 bg-white dark:bg-dark-card shadow-sm hover:-translate-y-2 hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    {/* Minimal Circular Icon */}
                    <div className="w-10 h-10 rounded-xl bg-linear-to-r from-accent-cyan to-accent-purple p-px">
                      <div className="w-full h-full rounded-[11px] bg-white dark:bg-dark-card flex items-center justify-center">
                        <IconComponent className="w-5 h-5 text-accent-cyan" />
                      </div>
                    </div>
                    <h3 className="text-lg font-bold text-light-text dark:text-dark-text">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-light-text-muted dark:text-dark-text-muted leading-relaxed">
                      {feature.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
