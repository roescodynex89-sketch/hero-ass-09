"use client";

import { authClient } from "@/lib/auth-client";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function MyProfilePage() {
  const { data: session } = authClient.useSession();
  const currentUser = session?.user;
  const router = useRouter();

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <p className="text-xs font-bold text-red-500">
          Authentication Required
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-12 px-4">
      <div className="max-w-md mx-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        {/* Ban */}
        <div className="h-32 bg-linear-to-r from-cyan-500 to-purple-600 relative"></div>

        {/* Avatar */}
        <div className="px-6 pb-6 relative">
          <div className="flex justify-between items-end -mt-12 mb-4">
            <Image
              src={currentUser.image}
              alt={currentUser.name}
              width={50}
              height={50}
              className="w-24 h-24 rounded-2xl border-4 border-white dark:border-slate-900 object-cover shadow-md"
            />
            <button
              onClick={() => router.push("/update-profile")}
              className="px-4 py-2 bg-slate-900 dark:bg-slate-800 text-white text-xs font-bold rounded-xl border border-transparent dark:border-slate-700 hover:opacity-90 transition cursor-pointer"
            >
              Edit Profile
            </button>
          </div>

          {/* Detailed */}
          <div className="space-y-4">
            <div>
              <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                {currentUser.name}
              </h2>
              <p className="text-xs font-medium text-slate-400 mt-0.5">
                Verified Network Identity
              </p>
            </div>

            <div className="border-t border-slate-100 dark:border-slate-800 pt-4 space-y-3">
              <div>
                <label className="text-[10px] font-bold text-slate-400 block">
                  Email Address
                </label>
                <span className="text-sm font-medium font-mono">
                  {currentUser.email}
                </span>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 block">
                  Account Status
                </label>
                <span className="inline-flex mt-1 items-center px-2.5 py-0.5 rounded-md text-xs font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                  Active Architect
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
