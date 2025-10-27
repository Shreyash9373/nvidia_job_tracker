"use client";
import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, Menu } from "lucide-react"; // nice icons

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed top-0 left-0 z-50 w-full bg-black text-white p-3 flex items-center justify-between">
      {/* === Hamburger / Cross Button === */}
      <button
        className="z-50 text-white focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

      {/* === Title === */}
      <h1 className="text-xl font-semibold absolute left-1/2 transform -translate-x-1/2">
        Job Tracker
      </h1>

      {/* === Sidebar Sliding Menu === */}
      <AnimatePresence>
        {isOpen && (
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.3 }}
            className="fixed top-0 left-0 h-full w-3/4 max-w-[250px] bg-gray-900 shadow-lg p-6 z-40"
          >
            <nav className="flex flex-col space-y-4 mt-10">
              <Link
                href="/"
                className="text-lg font-medium hover:text-green-400 transition"
                onClick={() => setIsOpen(false)}
              >
                ➕ Add Job
              </Link>
              <Link
                href="/viewJobs"
                className="text-lg font-medium hover:text-green-400 transition"
                onClick={() => setIsOpen(false)}
              >
                👁️ View Job
              </Link>
            </nav>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* === Background Overlay === */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/50 z-30"
        ></div>
      )}
    </div>
  );
};

export default Sidebar;
