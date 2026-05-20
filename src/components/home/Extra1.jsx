"use client";

import React from "react";
import Link from "next/link";
import {
  FiCpu,
  FiHeart,
  FiBookOpen,
  FiDollarSign,
  FiShoppingBag,
  FiCloud,
} from "react-icons/fi";

const categories = [
  {
    name: "Artificial Intelligence",
    icon: FiCpu,
    desc: "Next-gen machine learning and automation models.",
    count: "240+ Ideas",
    color: "from-blue-500/10 to-cyan-500/10 text-cyan-500",
  },
  {
    name: "Healthcare Tech",
    icon: FiHeart,
    desc: "Digital health solutions, telemedicine, and biotech.",
    count: "120+ Ideas",
    color: "from-red-500/10 to-pink-500/10 text-pink-500",
  },
  {
    name: "EdTech",
    icon: FiBookOpen,
    desc: "Innovative learning platforms and smart education.",
    count: "95+ Ideas",
    color: "from-green-500/10 to-emerald-500/10 text-emerald-500",
  },
  {
    name: "FinTech",
    icon: FiDollarSign,
    desc: "Decentralized finance, payments, and neo-banking.",
    count: "180+ Ideas",
    color: "from-amber-500/10 to-yellow-500/10 text-amber-500",
  },
  {
    name: "E-Commerce",
    icon: FiShoppingBag,
    desc: "D2C brands, smart logistics, and marketplace tools.",
    count: "150+ Ideas",
    color: "from-purple-500/10 to-indigo-500/10 text-indigo-500",
  },
  {
    name: "SaaS Ecosystems",
    icon: FiCloud,
    desc: "B2B productivity tools, software, and cloud utilities.",
    count: "310+ Ideas",
    color: "from-indigo-500/10 to-cyan-500/10 text-accent-cyan",
  },
];

export default function Extra1() {
  return (
    <section className="w-full py-20 bg-white dark:bg-dark-bg transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6">
        {/* Heading Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight text-light-text dark:text-dark-text">
            Explore Startup Categories
          </h2>
          <p className="mt-4 text-base sm:text-lg text-light-text-muted dark:text-dark-text-muted">
            Discover innovative startup ideas across multiple fast-growing
            industries and modern technologies.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => {
            const IconComponent = category.icon;
            return (
              <Link
                key={index}
                href={`/ideas?category=${category.name}`}
                className="group p-6 rounded-2xl border border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-dark-card/60 backdrop-blur-md shadow-sm hover:-translate-y-2 hover:shadow-xl dark:hover:border-accent-cyan/20 transition-all duration-300 flex flex-col justify-between cursor-pointer"
              >
                <div>
                  {/* Icon Wrapper */}
                  <div
                    className={`w-12 h-12 rounded-xl bg-linear-to-br ${category.color} flex items-center justify-center text-xl font-bold`}
                  >
                    <IconComponent className="w-6 h-6" />
                  </div>

                  <h3 className="text-lg font-bold mt-5 mb-2 text-light-text dark:text-dark-text group-hover:text-accent-cyan transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-sm text-light-text-muted dark:text-dark-text-muted leading-relaxed">
                    {category.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-xs font-semibold">
                  <span className="text-accent-purple dark:text-accent-cyan bg-slate-200/50 dark:bg-slate-800/50 px-2.5 py-1 rounded-md">
                    {category.count}
                  </span>
                  <span className="text-light-text-muted dark:text-dark-text-muted group-hover:translate-x-1 transition-transform">
                    Explore →
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
