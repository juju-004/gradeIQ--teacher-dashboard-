import React, { ReactNode } from "react";
import { motion } from "framer-motion";

function Fadein({
  className,
  children,
}: {
  className?: string;
  children?: ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className={className ?? ""}
    >
      {children}
    </motion.div>
  );
}

export default Fadein;
