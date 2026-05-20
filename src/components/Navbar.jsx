"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import ThemeToggle from "../components/ThemeToggle";
import { FiMenu, FiX, FiChevronDown, FiLogOut, FiUser } from "react-icons/fi";
import { TbRocket } from "react-icons/tb";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

export default function Navbar() {
  const pathname = usePathname();

  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const { data: session } = authClient.useSession();
  const user = session?.user;

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Ideas", href: "/ideas" },
  ];

  const privateLinks = [
    { name: "Add Idea", href: "/add-idea" },
    { name: "My Ideas", href: "/my-idea" },
    { name: "My Interactions", href: "/my-interactions" },
  ];

  const isActive = (path) => pathname === path;

  const handleLogout = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/logout`, {
        method: "POST",
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Logout failed");
      }

      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            toast.success("Logged out successfully");

            setIsProfileOpen(false);
            setIsOpen(false);

            router.replace("/login");
          },
        },
      });
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/5 dark:border-white/10 bg-light-bg/80 dark:bg-dark-bg/80 backdrop-blur-md transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="shrink-0">
            <Link href="/" className="flex items-center space-x-2 group">
              <TbRocket className="text-2xl text-accent-cyan transition-transform duration-300 group-hover:rotate-45 group-hover:-translate-y-0.5" />
              <span className="font-heading text-2xl font-bold tracking-wider bg-linear-to-r from-accent-cyan to-accent-purple bg-clip-text text-transparent">
                IdeaVault
              </span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive(link.href)
                    ? "text-accent-cyan bg-slate-200/50 dark:bg-slate-800/50"
                    : "text-light-text-sec dark:text-dark-text-sec hover:text-accent-cyan dark:hover:text-accent-cyan"
                }`}
              >
                {link.name}
              </Link>
            ))}

            {user &&
              privateLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive(link.href)
                      ? "text-accent-cyan bg-slate-200/50 dark:bg-slate-800/50"
                      : "text-light-text-sec dark:text-dark-text-sec hover:text-accent-cyan dark:hover:text-accent-cyan"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <ThemeToggle />

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-2 p-1.5 rounded-xl border border-white/5 bg-slate-100 dark:bg-slate-900 cursor-pointer hover:border-white/20 transition-all"
                >
                  <Image
                    src={user.image || "/default-user.png"}
                    alt={user.name}
                    width={28}
                    height={28}
                    className="rounded-lg object-cover"
                    unoptimized
                  />
                  <FiChevronDown
                    className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${isProfileOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-white/10 bg-white dark:bg-dark-card p-2 shadow-xl backdrop-blur-xl">
                    <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800 mb-1">
                      <p className="text-sm font-semibold text-light-text dark:text-dark-text">
                        {user.name}
                      </p>
                      <p className="text-xs text-light-text-muted dark:text-dark-text-muted truncate">
                        {user.email}
                      </p>
                    </div>

                    <div className="space-y-1">
                      <Link
                        href="/my-profile"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center space-x-2 p-2 rounded-xl text-sm text-light-text-sec dark:text-dark-text-sec hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      >
                        <FiUser className="w-4 h-4 text-accent-cyan" />
                        <span>My Profile</span>
                      </Link>

                      <Link
                        href="/update-profile"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center space-x-2 p-2 rounded-xl text-sm text-light-text-sec dark:text-dark-text-sec hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      >
                        <FiUser className="w-4 h-4 text-accent-cyan" />
                        <span>Update Profile</span>
                      </Link>
                    </div>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center space-x-2 p-2 rounded-xl text-sm text-error hover:bg-red-500/10 transition-colors text-left cursor-pointer"
                    >
                      <FiLogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/login"
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-linear-to-r from-accent-cyan to-accent-purple hover:brightness-110 active:scale-95 shadow-md shadow-accent-cyan/10 transition-all duration-300"
                >
                  Sign In
                </Link>

                <Link
                  href="/register"
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold border border-slate-300 dark:border-slate-700 text-light-text dark:text-dark-text hover:border-accent-cyan transition-all duration-300"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          <div className="md:hidden flex items-center space-x-3">
            <ThemeToggle />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl text-light-text-sec dark:text-dark-text-sec hover:bg-slate-200/50 dark:hover:bg-slate-800/50 cursor-pointer"
            >
              {isOpen ? (
                <FiX className="w-6 h-6" />
              ) : (
                <FiMenu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden border-t border-white/5 dark:border-white/10 bg-light-bg dark:bg-dark-bg transition-colors duration-300 px-4 pt-2 pb-4 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className={`block px-4 py-2.5 rounded-xl text-base font-medium ${
                isActive(link.href)
                  ? "text-accent-cyan bg-slate-200/50 dark:bg-slate-800/50"
                  : "text-light-text-sec dark:text-dark-text-sec"
              }`}
            >
              {link.name}
            </Link>
          ))}

          {user && (
            <>
              {privateLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`block px-4 py-2.5 rounded-xl text-base font-medium ${
                    isActive(link.href)
                      ? "text-accent-cyan bg-slate-200/50 dark:bg-slate-800/50"
                      : "text-light-text-sec dark:text-dark-text-sec"
                  }`}
                >
                  {link.name}
                </Link>
              ))}

              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 mt-2">
                <Link
                  href="/my-profile"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center space-x-3 px-4 py-2.5 rounded-xl text-light-text-sec dark:text-dark-text-sec"
                >
                  <Image
                    src={user.image || "/default-user.png"}
                    alt=""
                    width={24}
                    height={24}
                    className="rounded-md object-cover"
                    unoptimized
                  />
                  <span className="text-sm font-medium">My Profile</span>
                </Link>

                <Link
                  href="/update-profile"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center space-x-3 px-4 py-2.5 rounded-xl text-light-text-sec dark:text-dark-text-sec"
                >
                  <FiUser className="w-5 h-5 text-accent-cyan" />
                  <span className="text-sm font-medium">Update Profile</span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl text-error text-left"
                >
                  <FiLogOut className="w-5 h-5" />
                  <span className="text-sm font-medium">Logout</span>
                </button>
              </div>
            </>
          )}

          {!user && (
            <div className="pt-4 mt-2 border-t border-slate-200 dark:border-slate-800">
              <Link
                href="/login"
                onClick={() => setIsOpen(false)}
                className="block w-full text-center px-4 py-2.5 rounded-xl font-semibold bg-linear-to-r from-accent-cyan to-accent-purple text-white"
              >
                Sign In
              </Link>

              <Link
                href="/register"
                onClick={() => setIsOpen(false)}
                className="block w-full text-center px-4 py-2.5 rounded-xl font-semibold border border-slate-300 dark:border-slate-700 text-light-text dark:text-dark-text mt-3"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
