"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import Image from "next/image";

export default function IdeaDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  
  // Better-Auth সেশন এবং লোডিং ট্র্যাকিং
  const { data: session, isPending: isSessionPending } = authClient.useSession();
  const currentUser = session?.user;

  const [idea, setIdea] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);

  // এডিট স্টেটের জন্য ভ্যারিয়েবল
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingText, setEditingText] = useState("");

  // 🔒 ১. PRIVATE ROUTE GUARD: লগইন না থাকলে সরাসরি লগইন পেজে রিডাইরেক্ট
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
        // ✅ ব্যাকএন্ডের verifyToken এ কুকি পাস করার জন্য credentials সেট করা হলো
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

  // 💬 ২. ADD COMMENT FUNCTION
  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const commentPayload = {
      ideaId: id,
      commentText: newComment,
      userName: currentUser.name,
      userEmail: currentUser.email,
      userPhoto: currentUser.image || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100",
      createdAt: new Date().toISOString(), // ⏳ Timestamp রিকোয়ারমেন্ট
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

  // 📝 ৩. EDIT COMMENT FUNCTION (রিকোয়ারমেন্ট অনুযায়ী নতুন যুক্ত করা হলো)
  const handleEditComment = async (commentId) => {
    if (!editingText.trim()) return;

    try {
      const res = await fetch(`http://localhost:5000/comments/${commentId}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ text: editingText }), // ব্যাকএন্ডে req.body.text রিসিভ করে
      });

      if (res.ok) {
        toast.success("Comment optimized successfully!");
        setEditingCommentId(null);
        setEditingText("");
        
        // রিয়েল-টাইম স্টেট আপডেট (UI তে সাথে সাথে দেখানোর জন্য)
        setComments((prev) =>
          prev.map((c) => (c._id === commentId ? { ...c, commentText: editingText } : c))
        );
      } else {
        toast.error("Failed to update comment");
      }
    } catch (err) {
      toast.error("Could not update comment");
    }
  };

  // 🗑️ ৪. DELETE COMMENT FUNCTION
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

  // Auth সেশন লোড হওয়ার সময়ে সুন্দর স্পিনার
  if (isSessionPending || (loading && currentUser)) {
    return (
      <div className="flex justify-center items-center h-screen bg-slate-50 dark:bg-slate-950">
        <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!currentUser || !idea) return null;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* --- BACK BUTTON --- */}
        <button
          onClick={() => router.push("/ideas")}
          className="text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-cyan-500 transition cursor-pointer"
        >
          ← Back to Ecosystem Space
        </button>

        {/* --- MAIN IDEA PROFILE CARD --- */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-wrap justify-between items-start gap-4">
            <div>
              <span className="bg-cyan-500/10 text-cyan-500 text-xs font-black uppercase tracking-widest px-3 py-1 rounded-md border border-cyan-500/20">
                {idea.category}
              </span>
              <h1 className="text-3xl font-black tracking-tight mt-3 text-slate-900 dark:text-white">
                {idea.title}
              </h1>
              <p className="text-slate-500 font-medium mt-2">
                {idea.shortDescription}
              </p>
            </div>

            {/* Creator Metadata */}
            <div className="bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 p-3 rounded-xl flex items-center gap-3">
              <Image
                src={idea.userPhoto || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100"}
                width={80}
                height={80}
                alt="Architect image"
                className="w-10 h-10 rounded-lg object-cover"
              />
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">ARCHITECT</p>
                <p className="text-sm font-bold">{idea.userName}</p>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-100 dark:border-slate-800 my-4"></div>

          {/* Full Specifications Display */}
          <div className="space-y-6">
            <div>
              <h3 className="text-xs font-black uppercase tracking-widest text-cyan-500 mb-1">Detailed Vision</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{idea.description}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 dark:bg-slate-950 p-5 rounded-xl border border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">Target Audience</h3>
                <p className="text-sm font-bold text-slate-700 dark:text-slate-200">{idea.targetAudience}</p>
              </div>
              <div>
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">Operational Budget</h3>
                <p className="text-sm font-bold text-emerald-500">
                  {idea.estimatedBudget ? `$${idea.estimatedBudget}` : "Flexible Deployment"}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="border-l-2 border-red-500 pl-4">
                <h3 className="text-xs font-black uppercase tracking-wider text-red-500 mb-1">Problem Statement</h3>
                <p className="text-sm text-slate-600 dark:text-slate-300">{idea.problemStatement}</p>
              </div>

              <div className="border-l-2 border-emerald-500 pl-4">
                <h3 className="text-xs font-black uppercase tracking-wider text-emerald-500 mb-1">Proposed Solution</h3>
                <p className="text-sm text-slate-600 dark:text-slate-300">{idea.proposedSolution}</p>
              </div>
            </div>

            {idea.tags && idea.tags.length > 0 && (
              <div className="pt-2">
                <div className="flex flex-wrap gap-1.5">
                  {idea.tags.map((tag, i) => (
                    <span key={i} className="text-[11px] font-bold bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-md text-slate-500 dark:text-slate-400">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* --- 💬 INTERACTION WORKFLOW (COMMENT SYSTEM) --- */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
          <h2 className="text-xl font-bold tracking-tight">
            Community Validation Workspace ({comments.length})
          </h2>

          {/* Comment Submission Area */}
          <form onSubmit={handleAddComment} className="space-y-3">
            <textarea
              rows={3}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Provide feedback or suggest optimizations..."
              className="w-full p-4 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent outline-none focus:ring-2 focus:ring-cyan-500"
            />
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={!newComment.trim()}
                className="px-5 py-2.5 text-xs font-bold text-white bg-slate-900 dark:bg-cyan-500 rounded-xl hover:opacity-90 transition disabled:opacity-40 cursor-pointer"
              >
                Deploy Comment
              </button>
            </div>
          </form>

          {/* Feed List Render */}
          <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            {comments.length === 0 ? (
              <p className="text-center py-6 text-slate-400 text-sm font-medium">
                No community reviews synced yet. Be the first architect to review!
              </p>
            ) : (
              comments.map((comment) => (
                <div key={comment._id} className="p-4 bg-slate-50 dark:bg-slate-950/40 rounded-xl border border-slate-100 dark:border-slate-800/60 flex gap-4">
                  <Image
                    src={comment.userPhoto || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100"}
                    alt="User avatar"
                    width={80}
                    height={80}
                    className="w-9 h-9 rounded-lg object-cover shrink-0"
                  />

                  <div className="flex-1 space-y-1">
                    <div className="flex justify-between items-center">
                      <div>
                        {/* ⏳ User Name & Timestamp রিকোয়ারমেন্ট */}
                        <span className="text-xs font-bold block">{comment.userName}</span>
                        <span className="text-[10px] text-slate-400 font-medium">
                          {comment.createdAt ? new Date(comment.createdAt).toLocaleString() : "Recent"}
                        </span>
                      </div>

                      {/* 🛡️ Ownership Access Check: শুধু নিজের কমেন্ট এডিট ও ডিলিট করা যাবে */}
                      {currentUser && currentUser.email === comment.userEmail && (
                        <div className="flex gap-3 text-[10px] font-black uppercase tracking-wider">
                          {editingCommentId === comment._id ? (
                            <>
                              <button onClick={() => handleEditComment(comment._id)} className="text-emerald-500 hover:underline cursor-pointer">Save</button>
                              <button onClick={() => setEditingCommentId(null)} className="text-slate-400 hover:underline cursor-pointer">Cancel</button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => {
                                  setEditingCommentId(comment._id);
                                  setEditingText(comment.commentText);
                                }}
                                className="text-cyan-500 hover:underline cursor-pointer"
                              >
                                Edit
                              </button>
                              <button onClick={() => handleDeleteComment(comment._id)} className="text-red-500 hover:underline cursor-pointer">
                                Delete
                              </button>
                            </>
                          )}
                        </div>
                      )}
                    </div>

                    {/* এডিট মোড বনাম নরমাল টেক্সট রেন্ডারিং */}
                    {editingCommentId === comment._id ? (
                      <input
                        type="text"
                        value={editingText}
                        onChange={(e) => setEditingText(e.target.value)}
                        className="w-full mt-1 p-2 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg outline-none focus:ring-1 focus:ring-cyan-500"
                      />
                    ) : (
                      // ⏳ Comment Text রিকোয়ারমেন্ট
                      <p className="text-sm text-slate-600 dark:text-slate-300 pt-1 leading-relaxed">
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