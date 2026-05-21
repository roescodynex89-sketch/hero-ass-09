"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function TrendingIdeas() {
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);

  // ================= FETCH TRENDING IDEAS =================
  useEffect(() => {
    const fetchTrendingIdeas = async () => {
      try {
        setLoading(true);

        const res = await fetch(
          `${API_URL}/ideas?limit=6`,
          {
            method: "GET",
            cache: "no-store",
          }
        );

        if (!res.ok) {
          throw new Error("Failed to fetch ideas");
        }

        const data = await res.json();

        setIdeas(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Trending ideas fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingIdeas();
  }, []);

  return (
    <section className="w-full px-4 sm:px-6 lg:px-8 py-16 bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        {/* ================= HEADER ================= */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
          <div>
            <span className="text-[10px] font-black uppercase text-cyan-500 bg-cyan-500/10 px-2.5 py-1 rounded-md border border-cyan-500/20">
              🔥 Trending Ideas
            </span>

            <h2 className="text-3xl font-black mt-3 text-slate-900 dark:text-white">
              Explore Startup Concepts
            </h2>

            <p className="text-sm text-slate-500 mt-2">
              Discover the latest and most popular startup ideas from the
              community.
            </p>
          </div>

          <Link
            href="/ideas"
            className="text-xs font-bold uppercase text-cyan-500 hover:underline flex items-center gap-1"
          >
            View All Ideas →
          </Link>
        </div>

        {/* ================= LOADING ================= */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : ideas.length === 0 ? (
          // ================= EMPTY =================
          <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
            <p className="text-slate-400 text-sm font-medium">
              No ideas found yet.
            </p>
          </div>
        ) : (
          // ================= IDEAS GRID =================
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ideas.map((idea) => (
              <div
                key={idea._id}
                className="flex flex-col justify-between bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                {/* IMAGE */}
                <div className="relative h-52 bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <Image
                    src={
                      idea.imageURL ||
                      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1200"
                    }
                    alt={idea.title || "Idea image"}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover"
                  />

                  <span className="absolute top-3 left-3 bg-black/70 backdrop-blur-sm text-cyan-400 text-[10px] font-black uppercase px-2.5 py-1 rounded-md">
                    {idea.category || "General"}
                  </span>
                </div>

                {/* CONTENT */}
                <div className="p-6 flex flex-col flex-1 justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white line-clamp-1">
                      {idea.title}
                    </h3>

                    <p className="text-sm text-slate-500 mt-2 leading-relaxed line-clamp-2">
                      {idea.shortDescription}
                    </p>
                  </div>

                  {/* META */}
                  <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                    <div>
                      <p className="text-[10px] uppercase font-bold text-slate-400">
                        Created By
                      </p>

                      <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 truncate max-w-[120px]">
                        {idea.userName || "Anonymous"}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-[10px] uppercase font-bold text-slate-400">
                        Budget
                      </p>

                      <p className="text-xs font-bold text-emerald-500">
                        {idea.estimatedBudget
                          ? `$${idea.estimatedBudget}`
                          : "Flexible"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* BUTTON */}
                <div className="px-6 pb-6">
                  <Link
                    href={`/ideas/${idea._id}`}
                    className="block w-full py-3 text-center text-xs font-bold text-white bg-slate-950 dark:bg-slate-800 hover:bg-cyan-500 dark:hover:bg-cyan-500 rounded-xl transition"
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