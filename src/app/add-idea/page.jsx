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
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();

  const onSubmit = async (data) => {
    if (!session?.user) {
      toast.error("Please login first");
      return;
    }

    setLoading(true);

    try {
      // JWT CREATE
      const jwtRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/jwt`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email: session.user.email,
          name: session.user.name,
          image: session.user.image,
        }),
      });

      const jwtData = await jwtRes.json();
      let activeToken = jwtData?.token;

      if (activeToken) {
        localStorage.setItem("idea_vault_token", activeToken);
      } else {
        activeToken = localStorage.getItem("idea_vault_token");
      }

      const ideaPayload = {
        title: data.title,
        shortDescription: data.shortDescription,
        description: data.description,
        category: data.category,
        tags: data.tags
          ? data.tags
              .split(",")
              .map((tag) => tag.trim())
              .filter(Boolean)
          : [],
        imageURL: data.imageURL,
        estimatedBudget: data.estimatedBudget
          ? Number(data.estimatedBudget)
          : null,
        targetAudience: data.targetAudience,
        problemStatement: data.problemStatement,
        proposedSolution: data.proposedSolution,
        userName: session.user.name,
        userEmail: session.user.email,
        userPhoto: session.user.image,
        createdAt: new Date().toISOString(),
      };

      // ADD IDEA
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ideas`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          ...(activeToken && { authorization: `Bearer ${activeToken}` }),
        },
        credentials: "include",
        body: JSON.stringify(ideaPayload),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result?.message || "Failed to add idea");

      toast.success("Idea submitted successfully 🚀");
      reset();
      router.push("/my-idea");
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Failed to submit idea");
    } finally {
      setLoading(false);
    }
  };

  if (isPending) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-slate-50 dark:bg-slate-950">
        <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

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
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
            Add New Startup Idea
          </h2>
          <p className="text-sm text-slate-500 mt-2">
            Share your innovative startup concept with the community
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="text-sm font-medium flex items-center gap-2">
              <FiType /> Idea Title
            </label>
            <input
              type="text"
              placeholder="Enter startup idea title"
              {...register("title", { required: "Title is required" })}
              className="w-full mt-1 p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent outline-none focus:ring-2 focus:ring-cyan-500"
            />
            {errors.title && (
              <p className="text-red-500 text-xs mt-1">
                {errors.title.message}
              </p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium">Category</label>
            <select
              {...register("category", { required: "Category is required" })}
              className="w-full mt-1 p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 outline-none focus:ring-2 focus:ring-cyan-500"
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

          {fields.map((field) => {
            const Icon = field.icon;
            return (
              <div key={field.name}>
                <label className="text-sm font-medium flex items-center gap-2">
                  <Icon /> {field.label}
                </label>
                {textareaFields.includes(field.name) ? (
                  <textarea
                    rows={4}
                    placeholder={field.label}
                    {...register(field.name, {
                      required:
                        field.name !== "tags" &&
                        field.name !== "estimatedBudget"
                          ? `${field.label} is required`
                          : false,
                    })}
                    className="w-full mt-1 p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent outline-none focus:ring-2 focus:ring-cyan-500 resize-none"
                  />
                ) : (
                  <input
                    type={field.name === "estimatedBudget" ? "number" : "text"}
                    placeholder={field.label}
                    {...register(field.name, {
                      required:
                        field.name !== "tags" &&
                        field.name !== "estimatedBudget"
                          ? `${field.label} is required`
                          : false,
                      ...(field.name === "imageURL" && {
                        pattern: {
                          value: /^https?:\/\/.+/,
                          message: "Enter valid image URL",
                        },
                      }),
                    })}
                    className="w-full mt-1 p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                )}
                {errors[field.name] && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors[field.name]?.message}
                  </p>
                )}
              </div>
            );
          })}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-linear-to-r from-cyan-500 to-purple-600 text-white font-semibold hover:scale-[1.01] active:scale-95 transition cursor-pointer disabled:opacity-50"
          >
            {loading ? "Submitting..." : "Submit Idea"}
          </button>
        </form>
      </div>
    </div>
  );
}
