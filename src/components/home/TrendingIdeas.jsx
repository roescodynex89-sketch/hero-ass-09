"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

export default function TrendingIdeas() {
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrendingIdeas = async () => {
      try {
        // expresss-
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ideas?limit=6`);
        const data = await res.json();
        setIdeas(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch trending ideas:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingIdeas();
  }, []);

  return (
    <section className="w-full px-4 sm:px-6 lg:px-8 py-16 bg-light-bg dark:bg-dark-bg transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
          <div>
            <span className="text-[10px] font-black uppercase  text-cyan-500 bg-cyan-500/10 px-2.5 py-1 rounded-md border border-cyan-500/20">
              🔥 Trending Frameworks
            </span>
            <h2 className="text-3xl font-black  mt-2 text-slate-900 dark:text-white">
              Explore Top Startup Concepts
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              The most validated and newly deployed architectural setups in the
              community.
            </p>
          </div>

          <Link
            href="/ideas"
            className="text-xs font-bold uppercase  text-cyan-500 hover:underline flex items-center gap-1 cursor-pointer"
          >
            See All Blueprints —
          </Link>
        </div>

        {/* Loading Spinner */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : ideas.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
            <p className="text-slate-400 text-sm font-medium">
              No active startup blueprints discovered yet.
            </p>
          </div>
        ) : (
          /* 3-Column Grid Layout for 6 Cards */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ideas.map((idea) => (
              <div
                key={idea._id}
                className="flex flex-col justify-between bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden hover:scale-[1.01] transition-all duration-200"
              >
                {/* Image Placeholder with Category Badge */}
                <div className="h-48 bg-slate-100 dark:bg-slate-800 relative">
                  <Image
                    src={idea.imageURL}
                    alt={idea.title}
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-3 left-3 bg-slate-950/80 text-cyan-400 text-[10px] font-black uppercase  px-2.5 py-1 rounded-md backdrop-blur-xs">
                    {idea.category}
                  </span>
                </div>

                {/* Content Area */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white line-clamp-1">
                      {idea.title}
                    </h3>
                    <p className="text-slate-500 text-xs mt-2 line-clamp-2 leading-relaxed">
                      {idea.shortDescription}
                    </p>
                  </div>

                  {/* Metadata line */}
                  <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-[11px] text-slate-400 font-medium">
                    <span>
                      BY {idea.userName?.toUpperCase() || "ANONYMOUS"}
                    </span>
                    <span className="text-emerald-500 font-bold">
                      {idea.estimatedBudget || "Flexible"}
                    </span>
                  </div>
                </div>

                {/* Navigation Button */}
                <div className="px-6 pb-6">
                  <Link
                    href={`/ideas/${idea._id}`}
                    className="block w-full py-2.5 text-center text-xs font-bold text-white bg-slate-950 dark:bg-slate-800 hover:bg-cyan-500 dark:hover:bg-cyan-500 rounded-xl transition cursor-pointer"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
