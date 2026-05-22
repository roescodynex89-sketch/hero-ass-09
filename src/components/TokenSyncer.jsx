"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";

export default function TokenSyncer() {
  const [mounted, setMounted] = useState(false);
  const [session, setSession] = useState(null);

  // ১. প্রথমে নিশ্চিত হওয়া যে এটি ব্রাউজারে রান করছে (সার্ভার/বিল্ড টাইমে নয়)
  useEffect(() => {
    setMounted(true);
  }, []);

  // ২. শুধুমাত্র ব্রাউজারে মাউন্ট হওয়ার পর সেশন ডেটা নিয়ে আসা (যা বিল্ড টাইমে সম্পূর্ণ স্কিপ হবে)
  useEffect(() => {
    if (!mounted) return;

    // সাইলেন্টলি BetterAuth থেকে কারেন্ট সেশন ডেটা তুলে আনা
    const fetchSessionAndSync = async () => {
      try {
        const sessionRes = await authClient.getSession();
        const currentSession = sessionRes?.data;

        if (currentSession?.user) {
          const existingToken = localStorage.getItem("idea_vault_token");
          
          // যদি সেশন থাকে কিন্তু লোকাল স্টোরেজে টোকেন না থাকে
          if (!existingToken) {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/jwt`, {
              method: "POST",
              headers: { "content-type": "application/json" },
              credentials: "include",
              body: JSON.stringify({ email: currentSession.user.email }),
            });

            const data = await res.json();
            if (data?.token) {
              localStorage.setItem("idea_vault_token", data.token);
              console.log("Google token synced successfully!");
              window.location.reload(); // পেজ রিফ্রেশ করে টোকেন সিঙ্ক কমপ্লিট করা
            }
          }
        }
      } catch (err) {
        console.error("Token sync background error:", err);
      }
    };

    fetchSessionAndSync();
  }, [mounted]);

  return null;
}