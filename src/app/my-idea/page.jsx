"use client";

import { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function MyIdeasPage() {
  const { data: session, isPending } = authClient.useSession();

  const currentUser = session?.user;
  const router = useRouter();

  const [myIdeas, setMyIdeas] = useState([]);
  const [loading, setLoading] = useState(true);

  const [activeUpdateIdea, setActiveUpdateIdea] = useState(null);
  const [activeDeleteId, setActiveDeleteId] = useState(null);

  const [editForm, setEditForm] = useState({
    title: "",
    shortDescription: "",
    estimatedBudget: "",
    category: "",
  });

  // ================= FETCH USER IDEAS =================
  useEffect(() => {
    if (isPending) return;

    if (!currentUser) {
      toast.error("Please login first");
      router.push("/login");
      return;
    }

    const fetchMyIdeas = async () => {
      try {
        setLoading(true);

        const res = await fetch(
          `${API_URL}/ideas/user/${currentUser.email}`,
          {
            method: "GET",
            credentials: "include",
            cache: "no-store",
          }
        );

        if (!res.ok) {
          throw new Error("Failed to fetch ideas");
        }

        const data = await res.json();

        setMyIdeas(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load your ideas");
      } finally {
        setLoading(false);
      }
    };

    fetchMyIdeas();
  }, [currentUser, isPending, router]);

  // ================= DELETE IDEA =================
  const handleDelete = async () => {
    if (!activeDeleteId) return;

    try {
      const res = await fetch(`${API_URL}/ideas/${activeDeleteId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Delete failed");
      }

      toast.success("Idea deleted successfully");

      setMyIdeas((prev) =>
        prev.filter((idea) => idea._id !== activeDeleteId)
      );

      setActiveDeleteId(null);
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete idea");
    }
  };

  // ================= OPEN UPDATE MODAL =================
  const openUpdateModal = (idea) => {
    setActiveUpdateIdea(idea);

    setEditForm({
      title: idea.title || "",
      shortDescription: idea.shortDescription || "",
      estimatedBudget: idea.estimatedBudget || "",
      category: idea.category || "",
    });
  };

  // ================= UPDATE IDEA =================
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();

    if (!activeUpdateIdea) return;

    try {
      const payload = {
        ...editForm,
        estimatedBudget: Number(editForm.estimatedBudget) || 0,
      };

      const res = await fetch(
        `${API_URL}/ideas/${activeUpdateIdea._id}`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) {
        throw new Error("Update failed");
      }

      const updatedIdea = await res.json();

      setMyIdeas((prev) =>
        prev.map((idea) =>
          idea._id === activeUpdateIdea._id
            ? {
                ...idea,
                ...updatedIdea,
              }
            : idea
        )
      );

      toast.success("Idea updated successfully");

      setActiveUpdateIdea(null);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update idea");
    }
  };

  // ================= LOADING =================
  if (isPending || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // ================= NO USER =================
  if (!currentUser) return null;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* HEADER */}
        <div className="mb-10 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-black">My Ideas</h1>

            <p className="text-sm text-slate-500 mt-1">
              Manage your startup ideas
            </p>
          </div>

          <button
            onClick={() => router.push("/add-idea")}
            className="px-4 py-2.5 bg-cyan-500 text-white text-xs font-bold rounded-xl shadow-md hover:opacity-90 transition cursor-pointer"
          >
            + Add New Idea
          </button>
        </div>

        {/* EMPTY */}
        {!myIdeas.length ? (
          <div className="text-center py-20 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
            <p className="text-slate-400 font-medium">
              No ideas found
            </p>
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-[11px] font-black uppercase tracking-wider text-slate-400">
                    <th className="p-4">Title</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Budget</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                  {myIdeas.map((idea) => (
                    <tr
                      key={idea._id}
                      className="hover:bg-slate-50/50 dark:hover:bg-slate-950/20 transition"
                    >
                      <td className="p-4">
                        <p className="font-bold line-clamp-1">
                          {idea.title}
                        </p>

                        <p className="text-xs text-slate-400 line-clamp-1 mt-1">
                          {idea.shortDescription}
                        </p>
                      </td>

                      <td className="p-4">
                        <span className="text-xs font-bold px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-md">
                          {idea.category}
                        </span>
                      </td>

                      <td className="p-4 font-bold text-emerald-500">
                        {idea.estimatedBudget
                          ? `$${idea.estimatedBudget}`
                          : "Flexible"}
                      </td>

                      <td className="p-4 text-right space-x-2">
                        <button
                          onClick={() => openUpdateModal(idea)}
                          className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-xs font-bold rounded-lg hover:bg-cyan-500 hover:text-white transition cursor-pointer"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => setActiveDeleteId(idea._id)}
                          className="px-3 py-1.5 bg-red-500/10 text-red-500 text-xs font-bold rounded-lg hover:bg-red-500 hover:text-white transition cursor-pointer"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* UPDATE MODAL */}
        {activeUpdateIdea && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-md rounded-2xl p-6 shadow-xl">
              <h3 className="text-xl font-bold mb-5">
                Update Idea
              </h3>

              <form
                onSubmit={handleUpdateSubmit}
                className="space-y-4"
              >
                <div>
                  <label className="text-sm font-medium">
                    Title
                  </label>

                  <input
                    type="text"
                    required
                    value={editForm.title}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        title: e.target.value,
                      })
                    }
                    className="w-full mt-1 p-3 rounded-xl border dark:border-slate-700 bg-transparent outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">
                    Short Description
                  </label>

                  <textarea
                    rows={3}
                    required
                    value={editForm.shortDescription}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        shortDescription: e.target.value,
                      })
                    }
                    className="w-full mt-1 p-3 rounded-xl border dark:border-slate-700 bg-transparent outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium">
                      Budget
                    </label>

                    <input
                      type="number"
                      value={editForm.estimatedBudget}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          estimatedBudget: e.target.value,
                        })
                      }
                      className="w-full mt-1 p-3 rounded-xl border dark:border-slate-700 bg-transparent outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">
                      Category
                    </label>

                    <select
                      value={editForm.category}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          category: e.target.value,
                        })
                      }
                      className="w-full mt-1 p-3 rounded-xl border dark:border-slate-700 bg-slate-900 outline-none"
                    >
                      <option value="Tech">Tech</option>
                      <option value="AI">AI</option>
                      <option value="Health">Health</option>
                      <option value="Education">Education</option>
                      <option value="FinTech">FinTech</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveUpdateIdea(null)}
                    className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="px-4 py-2 bg-cyan-500 text-white rounded-lg text-sm font-semibold cursor-pointer"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* DELETE MODAL */}
        {activeDeleteId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-sm rounded-2xl p-6 shadow-xl text-center">
              <div className="w-14 h-14 mx-auto rounded-full bg-red-500/10 flex items-center justify-center text-2xl">
                ⚠️
              </div>

              <h3 className="mt-4 text-lg font-bold">
                Delete Idea?
              </h3>

              <p className="text-sm text-slate-400 mt-2">
                This action cannot be undone.
              </p>

              <div className="flex justify-center gap-3 mt-6">
                <button
                  onClick={() => setActiveDeleteId(null)}
                  className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-semibold cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-semibold cursor-pointer"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}