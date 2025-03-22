"use client";

import { motion } from "motion/react";

type Props = {
  children: React.ReactNode;
};

/**
 * This component is a wrapper that will be used to fade in the /interactive pages
 * @param props
 * @returns
 */
const FadeIn = (props: Props) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="h-full w-full"
    >
      {props.children}
    </motion.div>
  );
};

export default FadeIn;
