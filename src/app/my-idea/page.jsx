"use client";

import { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function MyIdeasPage() {
  const { data: session, isPending } = authClient.useSession();
  const currentUser = session?.user;
  const router = useRouter();

  const [myIdeas, setMyIdeas] = useState([]);
  const [loading, setLoading] = useState(true);

  const [activeUpdateIdea, setActiveUpdateIdea] = useState(null);
  const [activeDeleteId, setActiveDeleteId] = useState(null);

  // edit
  const [editForm, setEditForm] = useState({
    title: "",
    shortDescription: "",
    estimatedBudget: "",
    category: "",
  });

  useEffect(() => {
    if (!currentUser?.email) return;

    const fetchMyIdeas = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/my-idea?email=${currentUser.email}`,
          {
            credentials: "include",
          },
        );
        const data = await res.json();
        setMyIdeas(Array.isArray(data) ? data : []);
      } catch (err) {
        toast.error("Failed to load your startup workspace");
      } finally {
        setLoading(false);
      }
    };

    fetchMyIdeas();
  }, [currentUser?.email]);

  const handleDelete = async () => {
    if (!activeDeleteId) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/idea/${activeDeleteId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (res.ok) {
        toast.success("Idea completely wiped from ecosystem");

        setMyIdeas((prev) =>
          prev.filter((idea) => idea._id !== activeDeleteId),
        );
        setActiveDeleteId(null);
      }
    } catch (err) {
      toast.error("Wipe command execution failed");
    }
  };

  const openUpdateModal = (idea) => {
    setActiveUpdateIdea(idea);
    setEditForm({
      title: idea.title,
      shortDescription: idea.shortDescription,
      estimatedBudget: Number(idea.estimatedBudget) || "",
      category: idea.category,
    });
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    if (!activeUpdateIdea) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/idea/${activeUpdateIdea._id}`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({
            ...editForm,
            estimatedBudget: Number(editForm.estimatedBudget), 
          }),
        },
      );

      if (res.ok) {
        toast.success("Idea workspace updated successfully 🚀");

        const updatedIdea = await res.json();

        setMyIdeas((prev) =>
          prev.map((idea) =>
            idea._id === activeUpdateIdea._id ? { ...idea, ...editForm } : idea,
          ),
        );
        setActiveUpdateIdea(null);
      }
    } catch (err) {
      toast.error("Compilation error during update");
    }
  };

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <p className="text-sm font-bold uppercase text-red-500 tracking-widest">
          Access Denied. Please authenticate.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header  */}
        <div className="mb-10 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-black ">Control Center</h1>
            <p className="text-sm text-slate-500 mt-1">
              Manage and audit your deployed architectural blueprints.
            </p>
          </div>
          <button
            onClick={() => router.push("/add-idea")}
            className="px-4 py-2.5 bg-cyan-500 text-white text-xs font-bold   rounded-xl shadow-md hover:opacity-90 transition cursor-pointer"
          >
            + Deploy New Blueprint
          </button>
        </div>

        {/* Loading  */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : myIdeas.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
            <p className="text-slate-400 font-medium">
              You haven't initialized any ideas in this ecosystem yet.
            </p>
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-[11px] font-black uppercase tracking-wider text-slate-400">
                    <th className="p-4">Idea Concept</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Est. Budget</th>
                    <th className="p-4 text-right">Actions Workflow</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                  {myIdeas.map((idea) => (
                    <tr
                      key={idea._id}
                      className="hover:bg-slate-50/50 dark:hover:bg-slate-950/20 transition"
                    >
                      <td className="p-4">
                        <p className="font-bold text-slate-900 dark:text-white line-clamp-1">
                          {idea.title}
                        </p>
                        <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                          {idea.shortDescription}
                        </p>
                      </td>
                      <td className="p-4">
                        <span className="text-xs font-bold px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded-md">
                          {idea.category}
                        </span>
                      </td>
                      <td className="p-4 font-mono text-xs text-emerald-500 font-bold">
                        {idea.estimatedBudget
                          ? `$${idea.estimatedBudget}`
                          : "Flexible"}
                      </td>
                      <td className="p-4 text-right space-x-2">
                        <button
                          onClick={() => openUpdateModal(idea)}
                          className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-lg hover:bg-cyan-500 hover:text-white dark:hover:bg-cyan-500 transition cursor-pointer"
                        >
                          Modify
                        </button>
                        <button
                          onClick={() => setActiveDeleteId(idea._id)}
                          className="px-3 py-1.5 bg-red-500/10 text-red-500 text-xs font-bold rounded-lg hover:bg-red-500 hover:text-white transition cursor-pointer"
                        >
                          Wipe
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/*  Update  */}
        {activeUpdateIdea && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fadeIn">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-md rounded-2xl p-6 shadow-xl space-y-4">
              <div>
                <h3 className="text-lg font-black ">Modify Architecture</h3>
                <p className="text-xs text-slate-400">
                  Refine the parameters of your active startup concept.
                </p>
              </div>

              <form onSubmit={handleUpdateSubmit} className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase">
                    Concept Title
                  </label>
                  <input
                    type="text"
                    required
                    value={editForm.title}
                    onChange={(e) =>
                      setEditForm({ ...editForm, title: e.target.value })
                    }
                    className="w-full mt-1 p-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase">
                    Short Framework
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={editForm.shortDescription}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        shortDescription: e.target.value,
                      })
                    }
                    className="w-full mt-1 p-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase">
                      Budget Metric
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
                      className="w-full mt-1 p-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase">
                      Category
                    </label>
                    <select
                      value={editForm.category}
                      onChange={(e) =>
                        setEditForm({ ...editForm, category: e.target.value })
                      }
                      className="w-full mt-1 p-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-900"
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
                    className="px-4 py-2 text-xs font-bold border border-slate-200 dark:border-slate-700 rounded-lg cursor-pointer"
                  >
                    Abort
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-bold bg-slate-900 dark:bg-cyan-500 text-white rounded-lg cursor-pointer"
                  >
                    Commit Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/*  Delete  */}
        {activeDeleteId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-xs rounded-2xl p-6 shadow-xl space-y-4 text-center">
              <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center mx-auto text-red-500 font-black text-lg">
                ⚠️
              </div>
              <div>
                <h3 className="text-base font-bold">
                  Confirm Hard Deletion
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  This operation cannot be reversed. Are you absolutely certain?
                </p>
              </div>
              <div className="flex justify-center gap-2 pt-2">
                <button
                  onClick={() => setActiveDeleteId(null)}
                  className="px-4 py-2 text-xs font-bold border border-slate-200 dark:border-slate-700 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 text-xs font-bold bg-red-500 text-white rounded-lg cursor-pointer"
                >
                  Execute Wipe
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
