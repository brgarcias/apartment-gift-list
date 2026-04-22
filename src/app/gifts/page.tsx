"use client";

import { motion } from "framer-motion";
import GiftList from "@/components/GiftList";

function Gifts() {
  return (
    <div className="nc-Gifts relative overflow-hidden">
      <motion.main
        initial={{ opacity: 0, y: 0 }}
        animate={{ opacity: 1, y: 10 }}
        transition={{ duration: 0.5 }}
      >
        <GiftList />
      </motion.main>
    </div>
  );
}

export default Gifts;
