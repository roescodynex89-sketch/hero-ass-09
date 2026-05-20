"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import Image from "next/image";

export default function IdeaDetailsPage() {
  const { id } = useParams();
  const router = useRouter();

  // Better-Auth
  const { data: session, isPending: isSessionPending } =
    authClient.useSession();
  const currentUser = session?.user;

  const [idea, setIdea] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);

  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingText, setEditingText] = useState("");

  useEffect(() => {
    if (!isSessionPending && !currentUser) {
      toast.error("Please login to access operational details");
      router.push("/login");
    }
  }, [currentUser, isSessionPending, router]);

  useEffect(() => {
    if (!id || !currentUser) return;

    const fetchIdeaDetails = async () => {
      try {
        const res = await fetch(`http://localhost:5000/ideas/${id}`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Idea not found");
        const data = await res.json();
        setIdea(data);
      } catch (err) {
        toast.error("Failed to load idea details");
        router.push("/ideas");
      }
    };

    const fetchComments = async () => {
      try {
        const res = await fetch(`http://localhost:5000/comments/${id}`);
        const data = await res.json();
        setComments(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching comments", err);
      } finally {
        setLoading(false);
      }
    };

    fetchIdeaDetails();
    fetchComments();
  }, [id, currentUser]);

  //  ADD
  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const commentPayload = {
      ideaId: id,
      commentText: newComment,
      userName: currentUser.name,
      userEmail: currentUser.email,
      userPhoto:
        currentUser.image ||
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100",
      createdAt: new Date().toISOString(),
    };

    try {
      const res = await fetch("http://localhost:5000/comments", {
        method: "POST",
        credentials: "include",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(commentPayload),
      });

      if (res.ok) {
        toast.success("Comment deployed to workflow!");
        setNewComment("");
        const updatedRes = await fetch(`http://localhost:5000/comments/${id}`);
        const updatedData = await updatedRes.json();
        setComments(Array.isArray(updatedData) ? updatedData : []);
      }
    } catch (err) {
      toast.error("Failed to sync comment");
    }
  };

  //  EDIT
  const handleEditComment = async (commentId) => {
    if (!editingText.trim()) return;

    try {
      const res = await fetch(`http://localhost:5000/comments/${commentId}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ text: editingText }),
      });

      if (res.ok) {
        toast.success("Comment optimized successfully!");
        setEditingCommentId(null);
        setEditingText("");

        setComments((prev) =>
          prev.map((c) =>
            c._id === commentId ? { ...c, commentText: editingText } : c,
          ),
        );
      } else {
        toast.error("Failed to update comment");
      }
    } catch (err) {
      toast.error("Could not update comment");
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const res = await fetch(`http://localhost:5000/comments/${commentId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (res.ok) {
        toast.success("Comment retracted successfully");
        setComments((prev) => prev.filter((c) => c._id !== commentId));
      }
    } catch (err) {
      toast.error("Could not delete comment");
    }
  };

  // Auth
  if (isSessionPending || (loading && currentUser)) {
    return (
      <div className="flex justify-center items-center h-screen bg-slate-50 dark:bg-slate-950">
        <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!currentUser || !idea) return null;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* --- back*/}
        <button
          onClick={() => router.push("/ideas")}
          className="group flex items-center gap-2 text-xs font-bold uppercase  text-slate-500 hover:text-cyan-500 transition cursor-pointer outline-none"
        >
          <span className="transform group-hover:-translate-x-1 transition-transform">
            ←
          </span>{" "}
          Back to Ecosystem Space
        </button>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-3xl p-6 sm:p-10 shadow-sm hover:shadow-md transition-shadow duration-300 space-y-8">
          {/* Header  */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-6">
            <div className="space-y-3 flex-1">
              <span className="inline-block bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 text-[11px] font-black uppercase  px-3 py-1 rounded-full border border-cyan-500/20">
                {idea.category}
              </span>
              <h1 className="text-2xl sm:text-4xl font-bold text-slate-900 dark:text-white leading-tight">
                {idea.title}
              </h1>
              <p className="text-slate-500 dark:text-slate-400 font-medium text-base leading-relaxed">
                {idea.shortDescription}
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-950/60 border border-slate-200/60 dark:border-slate-800 p-4 rounded-2xl flex items-center gap-4 shrink-0 w-full sm:w-auto shadow-2xs">
              <Image
                src={
                  idea.userPhoto ||
                  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100"
                }
                width={44}
                height={44}
                alt="Architect image"
                className="rounded-xl object-cover ring-2 ring-cyan-500/10"
              />
              <div>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 font-black uppercase ">
                  ARCHITECT
                </p>
                <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  {idea.userName}
                </p>
              </div>
            </div>
          </div>

          {/*IMAGE SECTION */}
          <div className="w-full relative h-60 sm:h-100 rounded-2xl overflow-hidden shadow-xs border border-slate-100 dark:border-slate-800">
            <Image
              src={
                idea.imageURL ||
                "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1200"
              }
              alt={idea.title}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 800px"
              className="object-cover hover:scale-[1.01] transition-transform duration-500"
            />
          </div>

          <div className="border-t border-slate-100 dark:border-slate-800/80"></div>

          <div className="space-y-8">
            <div className="space-y-2">
              <h3 className="text-xs font-black uppercase text-cyan-500">
                Detailed Vision
              </h3>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50/50 dark:bg-slate-950/30 p-5 rounded-2xl border border-slate-100/50 dark:border-slate-800/30">
                {idea.description}
              </p>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-slate-50 dark:bg-slate-950 p-5 rounded-2xl border border-slate-200/60 dark:border-slate-800 flex flex-col justify-center">
                <h3 className="text-[11px] font-bold uppercase  text-slate-400 mb-1">
                  Target Audience
                </h3>
                <p className="text-sm sm:text-base font-bold text-slate-700 dark:text-slate-200">
                  {idea.targetAudience}
                </p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-950 p-5 rounded-2xl border border-slate-200/60 dark:border-slate-800 flex flex-col justify-center">
                <h3 className="text-[11px] font-bold uppercase text-slate-400 mb-1">
                  Operational Budget
                </h3>
                <p className="text-sm sm:text-base font-black text-emerald-500">
                  {idea.estimatedBudget
                    ? `$${idea.estimatedBudget}`
                    : "Flexible Deployment"}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div className="border-l-4 border-red-500 bg-red-50/30 dark:bg-red-950/10 p-5 rounded-r-2xl border border-y-slate-100 border-r-slate-100 dark:border-y-slate-800/40 dark:border-r-slate-800/40">
                <h3 className="text-xs font-black uppercase tracking-wider text-red-500 mb-2">
                  Problem Statement
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {idea.problemStatement}
                </p>
              </div>

              <div className="border-l-4 border-emerald-500 bg-emerald-50/30 dark:bg-emerald-950/10 p-5 rounded-r-2xl border border-y-slate-100 border-r-slate-100 dark:border-y-slate-800/40 dark:border-r-slate-800/40">
                <h3 className="text-xs font-black uppercase tracking-wider text-emerald-500 mb-2">
                  Proposed Solution
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {idea.proposedSolution}
                </p>
              </div>
            </div>

            {/* Tags Display */}
            {idea.tags && idea.tags.length > 0 && (
              <div className="pt-2 flex items-center gap-2 flex-wrap">
                {idea.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="text-[11px] font-bold bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-lg text-slate-500 dark:text-slate-400 border border-slate-200/30 dark:border-slate-700/30"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* --- cmnt--- */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-sm space-y-6">
          <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            Community Validation Workspace
            <span className="text-sm bg-slate-100 dark:bg-slate-800 text-slate-500 px-2.5 py-0.5 rounded-full font-bold">
              {comments.length}
            </span>
          </h2>

          {/* Comment Submission Area */}
          <form onSubmit={handleAddComment} className="space-y-3">
            <textarea
              rows={3}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Provide feedback or suggest optimizations..."
              className="w-full p-4 text-sm sm:text-base rounded-2xl border border-slate-200 dark:border-slate-700 bg-transparent outline-none focus:ring-2 focus:ring-cyan-500 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500 resize-none"
            />
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={!newComment.trim()}
                className="px-6 py-3 text-xs font-bold text-white bg-slate-950 dark:bg-cyan-500 rounded-xl hover:opacity-95 transition-all shadow-xs disabled:opacity-30 cursor-pointer"
              >
                Deploy Comment
              </button>
            </div>
          </form>

          {/* Feed List Render */}
          <div className="space-y-4 pt-6 border-t border-slate-100 dark:border-slate-800">
            {comments.length === 0 ? (
              <p className="text-center py-10 text-slate-400 dark:text-slate-500 text-sm font-medium">
                No community reviews synced yet. Be the first architect to
                review!
              </p>
            ) : (
              comments.map((comment) => (
                <div
                  key={comment._id}
                  className="p-5 bg-slate-50/60 dark:bg-slate-950/40 rounded-2xl border border-slate-200/50 dark:border-slate-800/60 flex gap-4 items-start transition-all duration-200"
                >
                  <Image
                    src={
                      comment.userPhoto ||
                      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100"
                    }
                    alt="User avatar"
                    width={38}
                    height={38}
                    className="rounded-xl object-cover shrink-0 ring-2 ring-slate-200/20"
                  />

                  <div className="flex-1 space-y-1.5 min-w-0">
                    <div className="flex justify-between items-start gap-4">
                      <div className="min-w-0">
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block truncate">
                          {comment.userName}
                        </span>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                          {comment.createdAt
                            ? new Date(comment.createdAt).toLocaleString()
                            : "Recent"}
                        </span>
                      </div>

                      {/*  Access Check */}
                      {currentUser &&
                        currentUser.email === comment.userEmail && (
                          <div className="flex gap-3 text-[10px] font-black uppercase tracking-wider shrink-0">
                            {editingCommentId === comment._id ? (
                              <>
                                <button
                                  onClick={() => handleEditComment(comment._id)}
                                  className="text-emerald-500 hover:text-emerald-600 cursor-pointer transition"
                                >
                                  Save
                                </button>
                                <button
                                  onClick={() => setEditingCommentId(null)}
                                  className="text-slate-400 dark:text-slate-500 hover:underline cursor-pointer transition"
                                >
                                  Cancel
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  onClick={() => {
                                    setEditingCommentId(comment._id);
                                    setEditingText(comment.commentText);
                                  }}
                                  className="text-cyan-500 hover:text-cyan-600 cursor-pointer transition"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() =>
                                    handleDeleteComment(comment._id)
                                  }
                                  className="text-red-500 hover:text-red-600 cursor-pointer transition"
                                >
                                  Delete
                                </button>
                              </>
                            )}
                          </div>
                        )}
                    </div>

                    {editingCommentId === comment._id ? (
                      <div className="pt-1 flex gap-2 w-full">
                        <input
                          type="text"
                          value={editingText}
                          onChange={(e) => setEditingText(e.target.value)}
                          className="flex-1 p-2 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
                        />
                      </div>
                    ) : (
                      <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed wrap-break-word">
                        {comment.commentText}
                      </p>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
