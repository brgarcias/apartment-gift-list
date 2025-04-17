import React from "react";
import SectionPromo2 from "@/components/SectionPromo2";
import SectionHero3 from "@/components/SectionHero/SectionHero3";
import GiftList from "@/components/GiftList";

function PageHome2() {
  return (
    <div className="nc-PageHome2 relative overflow-hidden">
      <div className="container px-4">
        <SectionHero3 />
      </div>

      <div className="container relative space-y-24 my-24 lg:space-y-32 lg:my-32">
        <GiftList />
        <SectionPromo2 />
      </div>
    </div>
  );
}

export default PageHome2;
