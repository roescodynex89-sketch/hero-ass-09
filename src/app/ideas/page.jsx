"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

export default function IdeasPage() {
  const [ideas, setIdeas] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  const categories = [
    "All",
    "Tech",
    "AI",
    "Health",
    "Education",
    "FinTech",
  ];

  useEffect(() => {
    const controller = new AbortController();

    const fetchIdeas = async () => {
      try {
        setLoading(true);

        // query params build
        const params = new URLSearchParams();

        if (search.trim()) {
          params.append("search", search.trim());
        }

        if (category !== "All") {
          params.append("category", category);
        }

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/ideas?${params.toString()}`,
          {
            method: "GET",
            credentials: "include",
            signal: controller.signal,
            headers: {
              "Content-Type": "application/json",
            },
          },
        );

        if (!res.ok) {
          throw new Error("Failed to fetch ideas");
        }

        const data = await res.json();

        setIdeas(data);
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Ideas Fetch Error:", error);
        }
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(() => {
      fetchIdeas();
    }, 400);

    return () => {
      clearTimeout(debounce);
      controller.abort();
    };
  }, [search, category]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black tracking-tight">
            Ecosystem Ideas
          </h1>

          <p className="text-slate-500 mt-2">
            Explore and validate disruptive ideas from global architects.
          </p>
        </div>

        {/* Search + Filter */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-12 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">

          {/* Search */}
          <div className="w-full md:w-1/2">
            <input
              type="text"
              placeholder="Search ideas by title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent outline-none focus:ring-2 focus:ring-cyan-500 text-sm"
            />
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-2 w-full md:w-auto justify-start md:justify-end">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-4 py-2 text-xs font-bold rounded-xl transition-all duration-200 cursor-pointer ${
                  category === cat
                    ? "bg-cyan-500 text-white shadow-lg shadow-cyan-500/20"
                    : "bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : ideas.length === 0 ? (

          /* Empty State */
          <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
            <p className="text-slate-500 text-lg font-medium">
              No matching startup concepts deployed yet.
            </p>
          </div>

        ) : (

          /* Ideas Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

            {ideas.map((idea) => (
              <div
                key={idea._id}
                className="flex flex-col justify-between bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >

                {/* Image */}
                <div className="relative h-52 bg-slate-200 dark:bg-slate-800">

                  <Image
                    src={
                      idea.imageURL ||
                      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1200"
                    }
                    alt={idea.title}
                    fill
                    className="object-cover"
                  />

                  <span className="absolute top-3 left-3 bg-black/70 backdrop-blur-md text-cyan-400 text-[10px] uppercase font-black tracking-wider px-3 py-1 rounded-lg">
                    {idea.category}
                  </span>
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-1 justify-between">

                  <div>
                    <h2 className="text-xl font-bold line-clamp-1">
                      {idea.title}
                    </h2>

                    <p className="mt-2 text-sm text-slate-500 line-clamp-2">
                      {idea.shortDescription}
                    </p>
                  </div>

                  {/* Meta */}
                  <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">

                    <div>
                      <p className="text-[11px] text-slate-400 font-medium">
                        DEPLOYED BY
                      </p>

                      <p className="text-xs font-bold truncate max-w-[120px]">
                        {idea.userName}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-[11px] text-slate-400 font-medium">
                        BUDGET
                      </p>

                      <p className="text-xs font-bold text-emerald-500">
                        {idea.estimatedBudget
                          ? `$${idea.estimatedBudget}`
                          : "Flexible"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Button */}
                <div className="px-6 pb-6">
                  <Link
                    href={`/ideas/${idea._id}`}
                    className="block w-full py-3 rounded-xl bg-slate-950 dark:bg-slate-800 hover:bg-cyan-500 dark:hover:bg-cyan-500 text-white text-center text-sm font-bold transition-all duration-200"
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