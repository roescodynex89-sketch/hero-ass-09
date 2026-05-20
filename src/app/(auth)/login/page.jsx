"use client";

import React, { useState, Suspense } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { FiMail, FiLock, FiArrowRight } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { TbRocket } from "react-icons/tb";

// react-hook

const LoginPageComponent = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect") || "/";

  // main logic
  const onSubmit = async (data) => {
    setLoading(true);

    const { email, password } = data;

    const { error } = await authClient.signIn.email({
      email,
      password,
      rememberMe: true,
    });

    if (error) {
      setLoading(false);

      toast.error(
        error.message ||
          "Authentication failed. Please check your credentials.",
      );

      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/jwt`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        throw new Error("JWT generation failed");
      }

      toast.success("Welcome back to IdeaVault! 👋");

      router.replace(redirectPath);
    } catch (jwtErr) {
      toast.error("JWT Synchronization failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: redirectPath,
      });
    } catch (err) {
      toast.error("Google authentication failed.");
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-slate-50 dark:bg-linear-to-br dark:from-[#020617] dark:via-[#0F172A] dark:to-dark-secondary text-slate-900 dark:text-slate-100 relative overflow-hidden transition-colors duration-300 font-sans">
      {/* dark:to-dark-secondary */}

      {/* background*/}
      <div className="hidden dark:block absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-cyan-500/10 blur-[130px] rounded-full pointer-events-none z-0" />
      <div className="hidden dark:block absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-violet-500/10 blur-[130px] rounded-full pointer-events-none z-0" />

      {/* left */}
      <div className="hidden lg:flex flex-col justify-center items-center p-12 relative z-10 border-r border-slate-200 dark:border-white/5 bg-slate-100/10 dark:bg-transparent text-center">
        <div className="max-w-md w-full space-y-10">
          {/* 1. Welcome */}
          <h1 className="text-5xl sm:text-5xl font-black tracking-tight text-slate-800 dark:text-white uppercase">
            Welcome to
          </h1>

          {/* 2. Enhanced Animated Logo & Brand Header */}
          <div className="flex flex-col items-center justify-center space-y-5 group">
            <div className="p-6 bg-slate-950 dark:bg-white/5 rounded-3xl border border-slate-200 dark:border-white/10 shadow-xl dark:shadow-[0_0_35px_rgba(34,211,238,0.15)] animate-[pulse_2.5s_infinite_ease-in-out]">
              <TbRocket className="text-7xl sm:text-8xl text-cyan-500 dark:text-cyan-400 rotate-45 transform transition-transform duration-500 group-hover:scale-110" />
            </div>

            {/* title */}
            <span className="text-5xl font-black tracking-wider bg-linear-to-r from-slate-900 to-slate-700 dark:from-cyan-400 dark:to-violet-400 bg-clip-text text-transparent ">
              IdeaVault
            </span>
          </div>

          {/* 3. description */}
          <p className="text-base sm:text-lg text-slate-400 dark:text-slate-400 font-sm  max-w-sm mx-auto">
            Turn innovative ideas into the next big startup. Share visions,
            validate concepts, and build the future with global architects.
          </p>
        </div>
      </div>

      {/* right */}
      <div className="flex items-center justify-center p-6 sm:p-12 lg:p-20 relative z-10 bg-white/40 dark:bg-white/2 backdrop-blur-md">
        <div className="w-full max-w-md space-y-8">
          <div>
            <h2 className="text-3xl font-black  text-slate-900 dark:text-white">
              Sign In
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mt-2">
              Log in to your dashboard workspace to resume.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* email  */}
            <div>
              <label className="text-xs font-bold  text-slate-600 dark:text-slate-400 block mb-2 ml-1">
                Email Address
              </label>
              <div className="relative">
                <FiMail className="absolute left-4 top-4 text-slate-400 dark:text-slate-500 w-4 h-4" />
                <input
                  {...register("email", {
                    required: "Email address is required",
                  })}
                  type="email"
                  className="w-full pl-11 pr-5 py-3.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-[#0F172A]/70 text-slate-900 dark:text-white focus:border-slate-950 dark:focus:border-cyan-400 focus:ring-4 focus:ring-slate-900/5 dark:focus:ring-cyan-500/10 outline-none transition-all text-sm font-medium"
                  placeholder="name@company.com"
                />
              </div>
              {errors.email && (
                <p className="text-red-500 dark:text-rose-400 text-xs mt-2 ml-1 font-medium">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* password */}
            <div>
              <div className="flex justify-between items-center mb-2 ml-1">
                <label className="text-xs font-bold  text-slate-600 dark:text-slate-400 block">
                  Password
                </label>
                <span className="text-xs text-slate-900 dark:text-cyan-400 font-bold hover:underline cursor-pointer">
                  Forgot?
                </span>
              </div>
              <div className="relative">
                <FiLock className="absolute left-4 top-4 text-slate-400 dark:text-slate-500 w-4 h-4" />
                <input
                  {...register("password", {
                    required: "Password is required",
                  })}
                  type="password"
                  className="w-full pl-11 pr-5 py-3.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-[#0F172A]/70 text-slate-900 dark:text-white focus:border-slate-950 dark:focus:border-cyan-400 focus:ring-4 focus:ring-slate-900/5 dark:focus:ring-cyan-500/10 outline-none transition-all text-sm font-medium"
                  placeholder="••••••••"
                />
              </div>
              {errors.password && (
                <p className="text-red-500 dark:text-rose-400 text-xs mt-2 ml-1 font-medium">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 dark:bg-linear-to-r from-accent-cyan  to-accent-purple text-white
                py-4 rounded-xl font-semibold text-sm 
                hover:brightness-110 active:scale-95 shadow-md shadow-accent-cyan/10 transition-all duration-300
                
                flex items-center justify-center space-x-2 mt-4 cursor-pointer "
            >
              <span className="font-extrabold">
                {loading ? "Authenticating..." : "Sign In to Workspace"}
              </span>
              {!loading && <FiArrowRight className="w-4 h-4 stroke-3" />}
            </button>
          </form>

          <div className="relative my-6 text-center">
            <span className="absolute inset-x-0 top-1/2 -translate-y-1/2 border-b border-slate-200 dark:border-white/5" />
            <span className="relative bg-slate-50 dark:bg-[#0A0F1D] px-4 text-xs text-slate-400 dark:text-slate-500 font-bold">
              OR
            </span>
          </div>

          {/* Google  */}
          <button
            onClick={handleGoogleLogin}
            className="w-full border border-slate-200 dark:border-white/10 py-3.5 rounded-xl bg-white dark:bg-[#0F172A]/40 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/40 flex items-center justify-center gap-2.5 text-sm font-bold transition-all active:scale-[0.98] shadow-sm cursor-pointer"
          >
            <FcGoogle className="w-5 h-5" />
            <span>Continue with Google</span>
          </button>

          {/* Registration  */}
          <p className="text-center text-slate-500 dark:text-slate-400 text-sm mt-8 font-semibold">
            Don't have an account?{" "}
            <Link
              href="/register"
              className="text-slate-900 dark:text-cyan-400 font-extrabold hover:underline"
            >
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center text-sm font-medium">
          Loading workspace configuration...
        </div>
      }
    >
      <LoginPageComponent />
    </Suspense>
  );
}
