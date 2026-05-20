"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

import {
  FiType,
  FiAlignLeft,
  FiTag,
  FiImage,
  FiDollarSign,
  FiUsers,
  FiAlertCircle,
  FiCpu,
} from "react-icons/fi";

export default function AddIdeaPage() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const [loading, setLoading] = useState(false);
  const { data: session } = authClient.useSession();
  const router = useRouter();

  const onSubmit = async (data) => {
    if (!session?.user) {
      toast.error("You must be logged in");
      return;
    }

    setLoading(true);

    // server
    try {
      const jwtRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/jwt`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email: session.user.email,
          name: session.user.name,
        }),
      });

      const jwtData = await jwtRes.json();
      console.log("JWT Sync Response:", jwtData); // Debugging log
    } catch (jwtErr) {
      console.error("JWT sync issue:", jwtErr);
    }

    const ideaPayload = {
      ...data,
      tags: data.tags?.split(",").map((t) => t.trim()),
      estimatedBudget: Number(data.estimatedBudget),
      userName: session.user.name,
      userEmail: session.user.email,
      userPhoto: session.user.image,
      createdAt: new Date().toISOString(),
    };

    // sub
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ideas`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(ideaPayload),
      });

      if (!res.ok) throw new Error("Failed");

      toast.success("Idea submitted successfully 🚀");
      reset();
      router.push("/my-idea");
    } catch (err) {
      toast.error("Failed to submit idea");
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { name: "shortDescription", label: "Short Description", icon: FiAlignLeft },
    { name: "description", label: "Detailed Description", icon: FiAlignLeft },
    { name: "tags", label: "Tags (comma separated)", icon: FiTag },
    { name: "imageURL", label: "Image URL", icon: FiImage },
    { name: "estimatedBudget", label: "Estimated Budget", icon: FiDollarSign },
    { name: "targetAudience", label: "Target Audience", icon: FiUsers },
    {
      name: "problemStatement",
      label: "Problem Statement",
      icon: FiAlertCircle,
    },
    { name: "proposedSolution", label: "Proposed Solution", icon: FiCpu },
  ];

  const textareaFields = [
    "shortDescription",
    "description",
    "problemStatement",
    "proposedSolution",
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4 py-10">
      <div className="w-full max-w-3xl bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-6 sm:p-10">
        {/* header */}
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
            Add New Startup Idea
          </h2>
          <p className="text-sm text-slate-500 mt-2">
            Share your idea with the world 🌍
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* title */}
          <div>
            <label className="text-sm font-medium flex items-center gap-2">
              <FiType /> Idea Title
            </label>
            <input
              {...register("title", { required: "Title is required" })}
              className="w-full mt-1 p-3 rounded-xl border dark:border-slate-700 bg-transparent outline-none focus:ring-2 focus:ring-cyan-500"
              placeholder="Enter idea title"
            />
            {errors.title && (
              <p className="text-red-500 text-xs mt-1">
                {errors.title.message}
              </p>
            )}
          </div>

          {/* Category dropdown */}
          <div>
            <label className="text-sm font-medium">Category</label>
            <select
              {...register("category", { required: "Category is required" })}
              className="w-full mt-1 p-3 rounded-xl border dark:border-slate-700 
               outline-none bg-slate-900"
            >
              <option value="">Select category</option>
              <option value="Tech">Tech</option>
              <option value="AI">AI</option>
              <option value="Health">Health</option>
              <option value="Education">Education</option>
              <option value="FinTech">FinTech</option>
            </select>
            {errors.category && (
              <p className="text-red-500 text-xs mt-1">
                {errors.category.message}
              </p>
            )}
          </div>

          {/* Dynamic Fields */}
          {fields.map((f) => {
            const Icon = f.icon;

            return (
              <div key={f.name}>
                <label className="text-sm font-medium flex items-center gap-2">
                  <Icon /> {f.label}
                </label>

                {textareaFields.includes(f.name) ? (
                  <textarea
                    {...register(f.name, {
                      required: `${f.label} is required`,
                    })}
                    rows={3}
                    className="w-full mt-1 p-3 rounded-xl border dark:border-slate-700 bg-transparent outline-none focus:ring-2 focus:ring-cyan-500"
                    placeholder={f.label}
                  />
                ) : (
                  <input
                    type={f.name === "estimatedBudget" ? "number" : "text"}
                    {...register(f.name, {
                      required: `${f.label} is required`,
                      ...(f.name === "imageURL" && {
                        pattern: {
                          value: /^https?:\/\/.+/,
                          message: "Enter valid image URL",
                        },
                      }),
                    })}
                    className="w-full mt-1 p-3 rounded-xl border dark:border-slate-700 bg-transparent outline-none focus:ring-2 focus:ring-cyan-500"
                    placeholder={f.label}
                  />
                )}

                {errors[f.name] && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors[f.name].message}
                  </p>
                )}
              </div>
            );
          })}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-linear-to-r from-cyan-500 to-purple-600 text-white font-semibold hover:scale-[1.01] active:scale-95 transition cursor-pointer"
          >
            {loading ? "Submitting..." : "Submit Idea"}
          </button>
        </form>
      </div>
    </div>
  );
}
