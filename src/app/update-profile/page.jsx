


"use client";

import { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function UpdateProfilePage() {
  const { data: session, isPending } = authClient.useSession();
  const currentUser = session?.user;
  const router = useRouter();

  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Fix: সেশন ডাটা অ্যাসিনক্রোনাসলি লোড হওয়ার পর স্টেটে পুশ করার জন্য useEffect গার্ড
  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || "");
      setImage(currentUser.image || "");
    }
  }, [currentUser]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!name.trim()) return toast.error("Name string cannot be empty");

    setLoading(true);

    try {
      // Better Auth-এর ক্লায়েন্ট মেথড দিয়ে সরাসরি প্রোফাইল আপডেট
      const { data, error } = await authClient.updateUser({
        name: name,
        image: image,
      });

      if (error) throw new Error(error.message);

      toast.success("Profile architecture synchronized successfully! 🚀");
      router.push("/my-profile");
    } catch (err) {
      toast.error(err.message || "Failed to update deployment parameters");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fix: সেশন চেক পেন্ডিং থাকা অবস্থায় ব্ল্যাংক স্ক্রিন বা বাফারিং এড়াতে প্রি-লোডার গার্ড
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
        <p className="text-xs font-black uppercase tracking-widest text-red-500">
          Authentication Required
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-12 px-4">
      <div className="max-w-md mx-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
        <div>
          <h1 className="text-2xl font-black tracking-tight">Update Identity</h1>
          <p className="text-xs text-slate-500 mt-1">
            Modify your network credentials and operational metrics.
          </p>
        </div>

        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Full Identity Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full mt-1 p-3 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent outline-none focus:ring-2 focus:ring-cyan-500"
              placeholder="Enter new identity name"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Avatar Image URL
            </label>
            <input
              type="url"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              className="w-full mt-1 p-3 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent outline-none focus:ring-2 focus:ring-cyan-500"
              placeholder="Paste hotlinked image URL"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => router.push("/my-profile")}
              className="flex-1 py-3 border border-slate-200 dark:border-slate-700 text-xs font-bold rounded-xl transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 bg-slate-900 dark:bg-cyan-500 text-white text-xs font-bold rounded-xl hover:opacity-90 transition disabled:opacity-50 cursor-pointer"
            >
              {loading ? "Syncing..." : "Save Identity"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}