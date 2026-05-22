"use client";

import { useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export default function TokenSyncer() {
  const { data: session } = authClient.useSession();
  const router = useRouter();

  useEffect(() => {
    const syncGoogleToken = async () => {
      if (
        session?.user &&
        !localStorage.getItem("idea_vault_token")
      ) {
        try {
          const jwtRes = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/jwt`,
            {
              method: "POST",
              headers: {
                "content-type": "application/json",
              },
              credentials: "include",
              body: JSON.stringify({
                email: session.user.email,
                name: session.user.name,
                image: session.user.image,
              }),
            }
          );

          const jwtData = await jwtRes.json();

          if (jwtData?.token) {
            localStorage.setItem(
              "idea_vault_token",
              jwtData.token
            );

            console.log("Google token synced!");

            router.refresh();
          }
        } catch (error) {
          console.error("Google token sync error:", error);
        }
      }
    };

    syncGoogleToken();
  }, [session, router]);

  return null;
}