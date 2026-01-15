"use client";

import { loadingService } from "@/services/loading";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function LoadingProvider() {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    return loadingService.subscribe(setLoading);
  }, []);

  if (!loading) return null;

  return (
    <AnimatePresence mode="wait">
      {loading && (
        <motion.div
          key="overlay"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            duration: 0.4,
            ease: "easeInOut",
          }}
        >
          <motion.div
            className="loader"
            initial={{ scale: 0.75, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.85, opacity: 0 }}
            transition={{
              duration: 0.35,
              ease: [0.22, 1, 0.36, 1], // smooth cubic-bezier
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
