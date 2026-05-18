"use client";

import Link from "next/link";
import { TbRocket } from "react-icons/tb";
import {
  FiMail,
  FiPhone,
  FiMapPin,
  FiGithub,
  FiLinkedin,
  FiFacebook,
} from "react-icons/fi";
import { FaXTwitter } from "react-icons/fa6";

export default function Footer() {
  return (
    <footer className="w-full border-t border-white/5 dark:border-white/10 bg-white dark:bg-dark-bg text-light-text-sec dark:text-dark-text-sec transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2 group">
              <TbRocket className="text-2xl text-accent-cyan transition-transform group-hover:rotate-45 duration-300" />
              <span className="font-heading text-xl font-bold tracking-wider bg-linear-to-r from-accent-cyan to-accent-purple bg-clip-text text-transparent">
                IdeaVault
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-light-text-muted dark:text-dark-text-muted">
              IdeaVault is a web-based platform where innovators share startup
              ideas, connect with minds, and build the future together.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold tracking-wider uppercase text-light-text dark:text-dark-text font-heading">
              Platform
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  href="/"
                  className="hover:text-accent-cyan dark:hover:text-accent-cyan transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/ideas"
                  className="hover:text-accent-cyan dark:hover:text-accent-cyan transition-colors"
                >
                  Explore Ideas
                </Link>
              </li>
              <li>
                <Link
                  href="/add-idea"
                  className="hover:text-accent-cyan dark:hover:text-accent-cyan transition-colors"
                >
                  Submit Idea
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold tracking-wider uppercase text-light-text dark:text-dark-text font-heading">
              Categories
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  href="/ideas?category=Tech"
                  className="hover:text-accent-cyan dark:hover:text-accent-cyan transition-colors"
                >
                  Technology
                </Link>
              </li>
              <li>
                <Link
                  href="/ideas?category=AI"
                  className="hover:text-accent-cyan dark:hover:text-accent-cyan transition-colors"
                >
                  Artificial Intelligence
                </Link>
              </li>
              <li>
                <Link
                  href="/ideas?category=Health"
                  className="hover:text-accent-cyan dark:hover:text-accent-cyan transition-colors"
                >
                  Healthcare
                </Link>
              </li>
              <li>
                <Link
                  href="/ideas?category=Education"
                  className="hover:text-accent-cyan dark:hover:text-accent-cyan transition-colors"
                >
                  Education
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold tracking-wider uppercase text-light-text dark:text-dark-text font-heading">
              Contact Us
            </h3>
            <ul className="space-y-3 text-sm text-light-text-muted dark:text-dark-text-muted">
              <li className="flex items-center space-x-2.5">
                <FiMail className="text-accent-cyan shrink-0" />
                <span className="truncate">support@ideavault.com</span>
              </li>
              <li className="flex items-center space-x-2.5">
                <FiPhone className="text-accent-cyan shrink-0" />
                <span>+1 (555) 019-2834</span>
              </li>
              <li className="flex items-center space-x-2.5">
                <FiMapPin className="text-accent-cyan shrink-0" />
                <span>Silicon Valley, CA</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-200 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-light-text-muted dark:text-dark-text-muted text-center sm:text-left order-2 sm:order-1">
            &copy; {new Date().getFullYear()} IdeaVault. All rights reserved.
            Built for innovation.
          </p>

          <div className="flex items-center space-x-5 order-1 sm:order-2 text-light-text-sec dark:text-dark-text-sec">
            <a
              href="https://x.com"
              target="_blank"
              rel="noreferrer"
              className="text-lg hover:text-accent-cyan dark:hover:text-accent-cyan transition-colors"
              aria-label="X"
            >
              <FaXTwitter />
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="text-lg hover:text-accent-cyan dark:hover:text-accent-cyan transition-colors"
              aria-label="GitHub"
            >
              <FiGithub />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noreferrer"
              className="text-lg hover:text-accent-cyan dark:hover:text-accent-cyan transition-colors"
              aria-label="LinkedIn"
            >
              <FiLinkedin />
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              className="text-lg hover:text-accent-cyan dark:hover:text-accent-cyan transition-colors"
              aria-label="Facebook"
            >
              <FiFacebook />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
