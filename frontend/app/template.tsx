"use client";

import { motion } from "motion/react";

type Props = {
  children: React.ReactNode;
};

const Template = (props: Props) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      exit={{
        opacity: 0,
        scale: 0,
        transition: { duration: 0.1 },
      }}
      className="h-full w-full"
    >
      {props.children}
    </motion.div>
  );
};

export default Template;
