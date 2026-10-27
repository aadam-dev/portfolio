"use client";

import { motion, useScroll, useSpring } from "framer-motion";

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const x = useSpring(scrollYProgress, { stiffness: 120, damping: 20, mass: 0.2 });

  return (
    <motion.div
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 z-[45] h-[2px] origin-left pointer-events-none"
      style={{
        scaleX: x,
        background:
          "linear-gradient(90deg, transparent 0%, var(--accent) 50%, var(--accent-2) 100%)",
      }}
    />
  );
}
