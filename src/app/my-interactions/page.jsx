// "use client";

// import { useState, useEffect } from "react";
// import { authClient } from "@/lib/auth-client";
// import { toast } from "sonner";
// import Link from "next/link";

// export default function MyInteractionsPage() {
//   const { data: session, isPending } = authClient.useSession();
//   const currentUser = session?.user;

//   const [interactions, setInteractions] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (!currentUser?.email) return;

//     const fetchInteractions = async () => {
//       try {
//         const res = await fetch(
//           `${process.env.NEXT_PUBLIC_API_URL}/my-interactions?email=${currentUser.email}`,
//           {
//             credentials: "include",
//           },
//         );

//         if (!res.ok) {
//           throw new Error("Fetch failed");
//         }

//         const data = await res.json();
//         setInteractions(Array.isArray(data) ? data : []);
//       } catch (err) {
//         toast.error("Failed to fetch your community footprint");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchInteractions();
//   }, [currentUser?.email]);

//   if (isPending) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
//         <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
//       </div>
//     );
//   }

//   if (!currentUser) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
//         <p className="text-xs font-black uppercase tracking-widest text-red-500">
//           Authentication Required
//         </p>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-12 px-4">
//       <div className="max-w-3xl mx-auto">
//         <div className="mb-8">
//           <h1 className="text-3xl font-black ">Interaction History</h1>
//           <p className="text-sm text-slate-500 mt-1">
//             Audit and track your architectural reviews across the network.
//           </p>
//         </div>

//         {loading ? (
//           <div className="flex justify-center py-20">
//             <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
//           </div>
//         ) : interactions.length === 0 ? (
//           <div className="text-center py-16 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
//             <p className="text-slate-400 text-sm font-medium">
//               No system reviews logged yet.
//             </p>
//           </div>
//         ) : (
//           <div className="space-y-4">
//             {interactions.map((log) => (
//               <div
//                 key={log._id}
//                 className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs space-y-2"
//               >
//                 <div className="flex justify-between items-start gap-4">
//                   <div>
//                     <span className="text-[10px] font-bold text-cyan-500">
//                       COMMENTED ON
//                     </span>
//                     <Link
//                       href={`/ideas/${log.ideaId}`}
//                       className="block font-bold text-slate-900 dark:text-white hover:underline line-clamp-1 mt-0.5"
//                     >
//                       {log.ideaTitle}
//                     </Link>
//                   </div>
//                   <span className="text-[10px] font-mono font-bold text-slate-400 whitespace-nowrap">
//                     {log.createdAt
//                       ? new Date(log.createdAt).toLocaleDateString()
//                       : "Recent"}
//                   </span>
//                 </div>
//                 <p className="text-sm text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-950/40 p-3 rounded-xl border border-slate-100 dark:border-slate-800/60 leading-relaxed">
//                   {log.text || log.commentText}
//                 </p>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }


"use client";

import { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function MyInteractionsPage() {
  const { data: session, isPending } = authClient.useSession();
  const currentUser = session?.user;
  const router = useRouter();

  const [interactions, setInteractions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isPending || !currentUser?.email) return;

    const fetchInteractions = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/my-interactions?email=${currentUser.email}`,
          {
            credentials: "include",
          }
        );
        const data = await res.json();
        setInteractions(Array.isArray(data) ? data : []);
      } catch (err) {
        toast.error("Failed to load your ecosystem interactions");
      } finally {
        setLoading(false);
      }
    };

    fetchInteractions();
  }, [currentUser?.email, isPending]);

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
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-black">My Interactions</h1>
          <p className="text-sm text-slate-500 mt-1">
            Review your activity and engagement logs across the application.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : interactions.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
            <p className="text-slate-400 font-medium">
              You haven't added any feedback or reviews yet.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {interactions.map((interaction) => (
              <div
                key={interaction._id}
                onClick={() => router.push(`/ideas/${interaction.ideaId}`)}
                className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs hover:shadow-md hover:border-cyan-500/50 dark:hover:border-cyan-500/50 transition duration-200 cursor-pointer group"
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="space-y-1.5">
                    <span className="text-[10px] uppercase font-black tracking-wider text-cyan-500 bg-cyan-500/10 px-2 py-0.5 rounded-md">
                      Source Idea
                    </span>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-cyan-500 transition">
                      {interaction.ideaTitle}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-300 italic">
                      "{interaction.commentText}"
                    </p>
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium whitespace-nowrap">
                    {interaction.createdAt
                      ? new Date(interaction.createdAt).toLocaleDateString()
                      : "Recent"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}