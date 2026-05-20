"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { FiUser, FiMail, FiLock, FiImage, FiArrowRight } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { TbRocket } from "react-icons/tb";

export default function RegisterPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  // cpy-
  const onSubmit = async (data) => {
    setLoading(true);

    const { name, email, password, photo } = data;

    const { error } = await authClient.signUp.email({
      name,
      email,
      password,
      image: photo,
    });

    if (error) {
      setLoading(false);

      toast.error(error.message || "Registration failed. Try again.");

      return;
    }

    const loginRes = await authClient.signIn.email({
      email,
      password,
    });

    if (loginRes.error) {
      setLoading(false);

      toast.warning(
        "Account created, but automatic sign-in failed. Please login manually.",
      );

      router.replace("/login");

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

      toast.success("Account provisions deployed successfully! Welcome. 🚀");

      router.replace("/");
    } catch (jwtErr) {
      toast.error("JWT Synchronization failed.");

      router.replace("/");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/",
      });
    } catch (err) {
      toast.error("Google registration failed.");
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-slate-50 dark:bg-linear-to-br dark:from-[#020617] dark:via-[#0F172A] dark:to-dark-secondary text-slate-900 dark:text-slate-100 relative overflow-hidden transition-colors duration-300 font-sans">
      <div className="hidden dark:block absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-violet-500/10 blur-[130px] rounded-full pointer-events-none z-0" />
      <div className="hidden dark:block absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-cyan-500/10 blur-[130px] rounded-full pointer-events-none z-0" />

      <div className="hidden lg:flex flex-col justify-center items-center p-12 relative z-10 border-r border-slate-200 dark:border-white/5 bg-slate-100/10 dark:bg-transparent text-center">
        <div className="max-w-md w-full space-y-10">
          {/* . Welcome  */}
          <h1 className="text-5xl sm:text-5xl font-black tracking-tight text-slate-800 dark:text-white uppercase">
            Welcome to
          </h1>

          <div className="flex flex-col items-center justify-center space-y-5 group">
            {/* Elastic Pulse Wrapper */}
            <div className="p-6 bg-slate-950 dark:bg-white/5 rounded-3xl border border-slate-200 dark:border-white/10 shadow-xl dark:shadow-[0_0_35px_rgba(139,92,246,0.15)] animate-[pulse_2.5s_infinite_ease-in-out]">
              <TbRocket className="text-7xl sm:text-8xl text-violet-500 dark:text-violet-400 rotate-45 transform transition-transform duration-500 group-hover:scale-110" />
            </div>

            {/* title */}
            <span className="text-5xl font-black tracking-wider bg-linear-to-r from-slate-900 to-slate-700 dark:from-cyan-400 dark:to-violet-400 bg-clip-text text-transparent ">
              IdeaVault
            </span>
          </div>

          {/* 3. Description Layer */}
          <p className="text-base sm:text-lg text-slate-400 dark:text-slate-400 font-sm  max-w-sm mx-auto">
            Create your secure ecosystem workspace. Capture iterative validation
            metrics and design features side-by-side with industry peers.
          </p>
        </div>
      </div>

      {/*  RIGHT  */}
      <div className="flex items-center justify-center p-6 sm:p-12 lg:p-20 relative z-10 bg-white/40 dark:bg-white/2 backdrop-blur-md">
        <div className="w-full max-w-md space-y-6">
          <div>
            <h2 className="text-3xl font-black  text-slate-900 dark:text-white">
              Create Account 🚀
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mt-1.5">
              Join the elite startup ecosystem today.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="text-xs font-bold  text-slate-600 dark:text-slate-400 block mb-1.5 ml-1">
                Full Name
              </label>
              <div className="relative">
                <FiUser className="absolute left-4 top-3.5 text-slate-400 dark:text-slate-500 w-4 h-4" />
                <input
                  {...register("name", { required: "Name is required" })}
                  className="w-full pl-11 pr-5 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-[#0F172A]/70 text-slate-900 dark:text-white focus:border-slate-950 dark:focus:border-cyan-400 focus:ring-4 focus:ring-slate-900/5 dark:focus:ring-cyan-500/10 outline-none transition-all text-sm font-medium"
                  placeholder="John Doe"
                />
              </div>
              {errors.name && (
                <p className="text-red-500 dark:text-rose-400 text-xs mt-1.5 ml-1 font-medium">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Email Address */}
            <div>
              <label className="text-xs font-bold  text-slate-600 dark:text-slate-400 block mb-1.5 ml-1">
                Email Address
              </label>
              <div className="relative">
                <FiMail className="absolute left-4 top-3.5 text-slate-400 dark:text-slate-500 w-4 h-4" />
                <input
                  {...register("email", { required: "Email is required" })}
                  type="email"
                  className="w-full pl-11 pr-5 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-[#0F172A]/70 text-slate-900 dark:text-white focus:border-slate-950 dark:focus:border-cyan-400 focus:ring-4 focus:ring-slate-900/5 dark:focus:ring-cyan-500/10 outline-none transition-all text-sm font-medium"
                  placeholder="john@example.com"
                />
              </div>
              {errors.email && (
                <p className="text-red-500 dark:text-rose-400 text-xs mt-1.5 ml-1 font-medium">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Photo URL */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 block mb-1.5 ml-1">
                Photo URL
              </label>
              <div className="relative">
                <FiImage className="absolute left-4 top-3.5 text-slate-400 dark:text-slate-500 w-4 h-4" />
                <input
                  {...register("photo", { required: "Photo URL is required" })}
                  className="w-full pl-11 pr-5 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-[#0F172A]/70 text-slate-900 dark:text-white focus:border-slate-950 dark:focus:border-cyan-400 focus:ring-4 focus:ring-slate-900/5 dark:focus:ring-cyan-500/10 outline-none transition-all text-sm font-medium"
                  placeholder="https://images.unsplash.com/..."
                />
              </div>
              {errors.photo && (
                <p className="text-red-500 dark:text-rose-400 text-xs mt-1.5 ml-1 font-medium">
                  {errors.photo.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 block mb-1.5 ml-1">
                Password
              </label>
              <div className="relative">
                <FiLock className="absolute left-4 top-3.5 text-slate-400 dark:text-slate-500 w-4 h-4" />
                <input
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Must be at least 6 characters long",
                    },
                    validate: {
                      hasUppercase: (v) =>
                        /[A-Z]/.test(v) ||
                        "Must contain at least one uppercase letter",
                      hasLowercase: (v) =>
                        /[a-z]/.test(v) ||
                        "Must contain at least one lowercase letter",
                    },
                  })}
                  type="password"
                  className="w-full pl-11 pr-5 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-[#0F172A]/70 text-slate-900 dark:text-white focus:border-slate-950 dark:focus:border-cyan-400 focus:ring-4 focus:ring-slate-900/5 dark:focus:ring-cyan-500/10 outline-none transition-all text-sm font-medium"
                  placeholder="••••••••"
                />
              </div>
              {errors.password && (
                <p className="text-red-500 dark:text-rose-400 text-xs mt-1.5 ml-1 font-medium">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Register btn */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 dark:bg-linear-to-r from-accent-cyan  to-accent-purple text-white
                py-4 rounded-xl font-semibold text-sm 
                hover:brightness-110 active:scale-95 shadow-md shadow-accent-cyan/10 transition-all duration-300
                
                flex items-center justify-center space-x-2 mt-4 cursor-pointer"
            >
              <span>{loading ? "Provisioning..." : "Register Account"}</span>
              {!loading && <FiArrowRight className="w-4 h-4 stroke-3" />}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-5 text-center">
            <span className="absolute inset-x-0 top-1/2 -translate-y-1/2 border-b border-slate-200 dark:border-white/5" />
            <span className="relative bg-slate-50 dark:bg-[#0A0F1D] px-4 text-xs text-slate-400 dark:text-slate-500 font-bold ">
              OR
            </span>
          </div>

          {/* Google  */}
          <button
            onClick={handleGoogleRegister}
            className="w-full border border-slate-200 dark:border-white/10 py-3 rounded-xl bg-white dark:bg-[#0F172A]/40 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/40 flex items-center justify-center gap-2.5 text-sm font-bold transition-all active:scale-[0.98] shadow-sm cursor-pointer backdrop-blur-sm"
          >
            <FcGoogle className="w-5 h-5" />
            <span>Register with Google</span>
          </button>

          {/* Link */}
          <p className="text-center text-slate-500 dark:text-slate-400 text-sm mt-6 font-semibold">
            Already have an active workspace?{" "}
            <Link
              href="/login"
              className="text-slate-900 dark:text-cyan-400 font-extrabold hover:underline"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
