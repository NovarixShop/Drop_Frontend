"use client";
import { motion } from "framer-motion";

export default function CategoriesPage() {
  return (
    <div className="min-h-below-nav flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <h1 className="text-4xl md:text-6xl font-bold mb-4">Categories</h1>
        <p className="text-gray-400 text-lg">Categories are being curated...</p>
      </motion.div>
    </div>
  );
}
