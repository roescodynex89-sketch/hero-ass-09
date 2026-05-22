"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

export default function IdeaDetailsPage() {
  const { id } = useParams();
  const router = useRouter();

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
      toast.error("Please login first");
      router.push("/login");
    }
  }, [currentUser, isSessionPending, router]);

  const fetchComments = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/comments/${id}`,
        {
          credentials: "include",
        },
      );
      if (!res.ok) throw new Error("Failed to fetch comments");
      const data = await res.json();
      setComments(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!id || !currentUser) return;

    const fetchIdeaDetails = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("idea_vault_token");

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/ideas/${id}`,
          {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
              ...(token && { authorization: `Bearer ${token}` }),
            },
          },
        );

        if (res.status === 401 || res.status === 403) {
          toast.error("Unauthorized Access");
          router.push("/login");
          return;
        }

        if (!res.ok) throw new Error("Idea not found");
        const data = await res.json();
        setIdea(data);
        await fetchComments();
      } catch (error) {
        console.error(error);
        toast.error("Failed to load idea details");
        router.push("/ideas");
      } finally {
        setLoading(false);
      }
    };

    fetchIdeaDetails();
  }, [id, currentUser, router]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return toast.error("Comment cannot be empty");

    const token = localStorage.getItem("idea_vault_token");
    const commentPayload = {
      ideaId: id,
      commentText: newComment.trim(),
      userName: currentUser.name,
      userEmail: currentUser.email,
      userPhoto:
        currentUser.image ||
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100",
      createdAt: new Date().toISOString(),
    };

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/comments`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          ...(token && { authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(commentPayload),
      });

      if (!res.ok) throw new Error("Failed");
      toast.success("Comment deployed successfully!");
      setNewComment("");
      await fetchComments();
    } catch (error) {
      console.error(error);
      toast.error("Failed to add comment");
    }
  };

  const handleEditComment = async (commentId) => {
    if (!editingText.trim()) return toast.error("Comment cannot be empty");

    try {
      const token = localStorage.getItem("idea_vault_token");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/comments/${commentId}`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            ...(token && { authorization: `Bearer ${token}` }),
          },
          body: JSON.stringify({ text: editingText.trim() }),
        },
      );

      if (!res.ok) throw new Error("Update failed");
      toast.success("Comment updated successfully!");
      setEditingCommentId(null);
      setEditingText("");
      await fetchComments();
    } catch (error) {
      console.error(error);
      toast.error("Could not update comment");
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const token = localStorage.getItem("idea_vault_token");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/comments/${commentId}`,
        {
          method: "DELETE",
          credentials: "include",
          headers: {
            ...(token && { authorization: `Bearer ${token}` }),
          },
        },
      );

      if (!res.ok) throw new Error("Delete failed");
      toast.success("Comment deleted successfully");
      await fetchComments();
    } catch (error) {
      console.error(error);
      toast.error("Could not delete comment");
    }
  };

  if (isSessionPending || loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-slate-50 dark:bg-slate-950">
        <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!idea || !currentUser) return null;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <button
          onClick={() => router.push("/ideas")}
          className="group flex items-center gap-2 text-xs font-bold uppercase text-slate-500 hover:text-cyan-500 transition cursor-pointer"
        >
          <span className="group-hover:-translate-x-1 transition-transform">
            ←
          </span>
          Back to Ideas
        </button>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-sm space-y-8">
          <div className="flex flex-col sm:flex-row justify-between gap-6">
            <div className="space-y-3 flex-1">
              <span className="inline-block bg-cyan-500/10 text-cyan-500 text-[11px] font-black uppercase px-3 py-1 rounded-full border border-cyan-500/20">
                {idea.category}
              </span>
              <h1 className="text-3xl sm:text-4xl font-bold leading-tight">
                {idea.title}
              </h1>
              <p className="text-slate-500 dark:text-slate-400">
                {idea.shortDescription}
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl flex items-center gap-4">
              <Image
                src={
                  idea.userPhoto ||
                  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100"
                }
                width={44}
                height={44}
                alt="User"
                className="rounded-xl object-cover"
              />
              <div>
                <p className="text-[10px] uppercase font-black text-slate-400">
                  Creator
                </p>
                <p className="text-sm font-bold">{idea.userName}</p>
              </div>
            </div>
          </div>

          <div className="relative h-64 sm:h-105 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800">
            <Image
              src={
                idea.imageURL ||
                "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1200"
              }
              alt={idea.title}
              fill
              priority
              className="object-cover"
            />
          </div>

          <div className="space-y-8">
            <div>
              <h3 className="text-xs font-black uppercase text-cyan-500 mb-2">
                Detailed Description
              </h3>
              <p className="text-sm sm:text-base leading-relaxed text-slate-600 dark:text-slate-300">
                {idea.description}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-slate-50 dark:bg-slate-950 p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
                <h3 className="text-[11px] uppercase font-bold text-slate-400 mb-1">
                  Target Audience
                </h3>
                <p className="font-bold">{idea.targetAudience}</p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-950 p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
                <h3 className="text-[11px] uppercase font-bold text-slate-400 mb-1">
                  Estimated Budget
                </h3>
                <p className="font-bold text-emerald-500">
                  {idea.estimatedBudget
                    ? `$${idea.estimatedBudget}`
                    : "Flexible"}
                </p>
              </div>
            </div>

            <div className="border-l-4 border-red-500 bg-red-50/30 dark:bg-red-950/10 p-5 rounded-r-2xl">
              <h3 className="text-xs font-black uppercase text-red-500 mb-2">
                Problem Statement
              </h3>
              <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                {idea.problemStatement}
              </p>
            </div>

            <div className="border-l-4 border-emerald-500 bg-emerald-50/30 dark:bg-emerald-950/10 p-5 rounded-r-2xl">
              <h3 className="text-xs font-black uppercase text-emerald-500 mb-2">
                Proposed Solution
              </h3>
              <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                {idea.proposedSolution}
              </p>
            </div>

            {idea.tags && idea.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {idea.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="text-[11px] font-bold bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-lg text-slate-500"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-sm space-y-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            Community Comments
            <span className="text-sm bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
              {comments.length}
            </span>
          </h2>

          <form onSubmit={handleAddComment} className="space-y-3">
            <textarea
              rows={3}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write your feedback..."
              className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-transparent outline-none focus:ring-2 focus:ring-cyan-500 resize-none"
            />
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={!newComment.trim()}
                className="px-6 py-3 text-xs font-bold text-white bg-slate-950 dark:bg-cyan-500 rounded-xl hover:opacity-90 transition disabled:opacity-40 cursor-pointer"
              >
                Add Comment
              </button>
            </div>
          </form>

          <div className="space-y-4 pt-6 border-t border-slate-100 dark:border-slate-800">
            {comments.length === 0 ? (
              <p className="text-center py-10 text-slate-400 text-sm">
                No comments yet.
              </p>
            ) : (
              comments.map((comment) => (
                <div
                  key={comment._id}
                  className="p-5 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 flex gap-4"
                >
                  <Image
                    src={
                      comment.userPhoto ||
                      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100"
                    }
                    alt="User"
                    width={38}
                    height={38}
                    className="rounded-xl object-cover shrink-0"
                  />
                  <div className="flex-1 space-y-2">
                    <div className="flex justify-between gap-4">
                      <div>
                        <p className="text-xs font-bold">{comment.userName}</p>
                        <p className="text-[10px] text-slate-400">
                          {comment.createdAt
                            ? new Date(comment.createdAt).toLocaleString()
                            : "Recent"}
                        </p>
                      </div>

                      {currentUser.email?.toLowerCase() ===
                        comment.userEmail?.toLowerCase() && (
                        <div className="flex gap-3 text-[10px] font-black uppercase">
                          {editingCommentId === comment._id ? (
                            <>
                              <button
                                onClick={() => handleEditComment(comment._id)}
                                className="text-emerald-500 hover:text-emerald-600 cursor-pointer"
                              >
                                Save
                              </button>
                              <button
                                onClick={() => {
                                  setEditingCommentId(null);
                                  setEditingText("");
                                }}
                                className="text-slate-400 hover:underline cursor-pointer"
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
                                className="text-cyan-500 hover:text-cyan-600 cursor-pointer"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteComment(comment._id)}
                                className="text-red-500 hover:text-red-600 cursor-pointer"
                              >
                                Delete
                              </button>
                            </>
                          )}
                        </div>
                      )}
                    </div>

                    {editingCommentId === comment._id ? (
                      <input
                        type="text"
                        value={editingText}
                        onChange={(e) => setEditingText(e.target.value)}
                        className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 outline-none focus:ring-2 focus:ring-cyan-500"
                      />
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
