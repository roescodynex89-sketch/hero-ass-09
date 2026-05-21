"use client";

import { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function MyInteractionsPage() {
  const { data: session, isPending } = authClient.useSession();

  const currentUser = session?.user;
  const router = useRouter();

  const [interactions, setInteractions] = useState([]);
  const [loading, setLoading] = useState(true);

  //
  useEffect(() => {
    if (isPending) return;

    if (!currentUser) {
      toast.error("Please login first");
      router.push("/login");
      return;
    }

    const fetchInteractions = async () => {
      try {
        setLoading(true);

        const res = await fetch(
          `${API_URL}/my-interactions?email=${currentUser.email}`,
          {
            method: "GET",
            credentials: "include",
            cache: "no-store",
          },
        );

        if (!res.ok) {
          throw new Error("Failed to fetch interactions");
        }

        const data = await res.json();

        setInteractions(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load interactions");
      } finally {
        setLoading(false);
      }
    };

    fetchInteractions();
  }, [currentUser, isPending, router]);

  if (isPending || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!currentUser) return null;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-3xl font-black">My Interactions</h1>

          <p className="text-sm text-slate-500 mt-1">
            Track your comments and community activity.
          </p>
        </div>

        {/* EMPTY */}
        {interactions.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
            <p className="text-slate-400 text-sm font-medium">
              No interactions found.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {interactions.map((log) => (
              <div
                key={log._id}
                className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm"
              >
                {/* TOP */}
                <div className="flex justify-between items-start gap-4">
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-500">
                      Commented On
                    </span>

                    <Link
                      href={`/ideas/${log.ideaId || log.idea_id}`}
                      className="block mt-1 font-bold text-slate-900 dark:text-white hover:text-cyan-500 transition line-clamp-1"
                    >
                      {log.ideaTitle || "Untitled Idea"}
                    </Link>
                  </div>

                  <span className="text-[10px] font-mono font-bold text-slate-400 whitespace-nowrap">
                    {log.createdAt
                      ? new Date(log.createdAt).toLocaleDateString()
                      : "Recent"}
                  </span>
                </div>

                {/* COMMENT */}
                <div className="mt-4">
                  <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-950/40 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                    {log.commentText ||
                      log.comment ||
                      log.text ||
                      "No comment found"}
                  </p>
                </div>

                {/* FOOTER */}
                <div className="mt-4 flex justify-end">
                  <Link
                    href={`/ideas/${log.ideaId || log.idea_id}`}
                    className="text-xs font-bold text-cyan-500 hover:underline"
                  >
                    View Idea →
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
