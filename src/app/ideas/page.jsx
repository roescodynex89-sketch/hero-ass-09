"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

export default function IdeasPage() {
  const [ideas, setIdeas] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  const categories = ["All", "Tech", "AI", "Health", "Education", "FinTech"];

  useEffect(() => {
    const controller = new AbortController();

    const fetchIdeas = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `http://localhost:5000/ideas?search=${search}&category=${category}`,
          {
            credentials: "include",
            signal: controller.signal,
          },
        );

        if (!res.ok) throw new Error("Failed to fetch ideas");

        const data = await res.json();
        setIdeas(data);
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error(err);
        }
      } finally {
        setLoading(false);
      }
    };

    const delayDebounce = setTimeout(() => {
      fetchIdeas();
    }, 300);

    return () => {
      clearTimeout(delayDebounce);
      // controller.abort();
    };
  }, [search, category]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/*  Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black tracking-tight">
            Ecosystem Ideas
          </h1>
          <p className="text-slate-500 mt-2">
            Explore and validate disruptive ideas from global architects.
          </p>
        </div>

        {/* Search  */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-12 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          {/* Search*/}
          <div className="w-full md:w-1/2">
            <input
              type="text"
              placeholder="Search ideas by title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent outline-none focus:ring-2 focus:ring-cyan-500 text-sm"
            />
          </div>

          {/* Category  */}
          <div className="flex flex-wrap gap-2 w-full md:w-auto justify-start md:justify-end">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-4 py-2 text-xs font-bold rounded-xl transition cursor-pointer ${
                  category === cat
                    ? "bg-cyan-500 text-white shadow-md shadow-cyan-500/20"
                    : "bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : ideas.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
            <p className="text-slate-500 text-lg font-medium">
              No matching startup concepts deployed yet.
            </p>
          </div>
        ) : (
          /* 3-Column  */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ideas.map((idea) => (
              <div
                key={idea._id}
                className="flex flex-col justify-between bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden hover:scale-[1.01] transition-all duration-200"
              >
                <div className="h-48 bg-slate-200 dark:bg-slate-800 relative">
                  <Image
                    src={
                      idea.imageURL ||
                      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=600"
                    }
                    alt={idea.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover"
                    priority={false}
                  />
                  <span className="absolute top-3 left-3 bg-slate-950/80 text-cyan-400 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md backdrop-blur-xs">
                    {idea.category}
                  </span>
                </div>

                {/* Card Main */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-bold tracking-tight line-clamp-1 text-slate-900 dark:text-white">
                      {idea.title}
                    </h3>
                    <p className="text-slate-500 text-sm mt-2 line-clamp-2">
                      {idea.shortDescription}
                    </p>
                  </div>

                  <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                    <div className="flex flex-col">
                      <span className="text-[11px] text-slate-400 font-medium">
                        DEPLOYED BY
                      </span>
                      <span className="text-xs font-bold truncate max-w-30">
                        {idea.userName}
                      </span>
                    </div>
                    <div className="flex flex-col text-right">
                      <span className="text-[11px] text-slate-400 font-medium">
                        BUDGET
                      </span>
                      <span className="text-xs font-bold text-emerald-500">
                        {idea.estimatedBudget
                          ? `$${idea.estimatedBudget}`
                          : "Flexible"}
                      </span>
                    </div>
                  </div>
                </div>

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
    </div>
  );
}
