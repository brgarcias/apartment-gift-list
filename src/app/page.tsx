import React from "react";
import SectionPromo2 from "@/components/SectionPromo2";
import GiftList from "@/components/GiftList";
import SectionHero3 from "@/components/SectionHero/SectionHero3";

function PageHome() {
  return (
    <div className="nc-PageHome2 relative overflow-hidden">
      <div className="container px-4 mt-2">
        <SectionHero3 />
      </div>

      <div className="container relative space-y-24 my-3 lg:space-y-32 lg:my-20">
        <GiftList />
        <SectionPromo2 />
      </div>
    </div>
  );
}

export default PageHome;
