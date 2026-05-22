"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";

export default function TokenSyncer() {
  const { data: session } = authClient.useSession();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const syncToken = async () => {
      const existingToken = localStorage.getItem("idea_vault_token");

      if (session?.user && !existingToken) {
        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/jwt`,
            {
              method: "POST",
              headers: {
                "content-type": "application/json",
              },
              credentials: "include",
              body: JSON.stringify({
                email: session.user.email,
              }),
            }
          );

          const data = await res.json();

          if (data?.token) {
            localStorage.setItem("idea_vault_token", data.token);

            console.log("Google token synced!");
          }
        } catch (err) {
          console.error("Token sync failed:", err);
        }
      }
    };

    syncToken();
  }, [session, mounted]);

  return null;
}