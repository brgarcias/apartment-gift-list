"use client";

import React from "react";
import { motion } from "framer-motion";
import SectionPromo2 from "@/components/SectionPromo2";
import GiftList from "@/components/GiftList";
import SectionHero3 from "@/components/SectionHero/SectionHero3";

function PageHome() {
  return (
    <div className="nc-PageHome2 relative overflow-hidden">
      <motion.main
        initial={{ opacity: 0, y: 0 }}
        animate={{ opacity: 1, y: 10 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container px-4 mt-2">
          <SectionHero3 />
        </div>

        <div className="container relative space-y-24 my-3 lg:space-y-32 lg:my-20">
          <GiftList />
          <SectionPromo2 />
        </div>
      </motion.main>
    </div>
  );
}

export default PageHome;
