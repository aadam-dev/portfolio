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
          "linear-gradient(90deg, rgba(232,178,58,0) 0%, #E8B23A 50%, #F2CB6B 100%)",
      }}
    />
  );
}
