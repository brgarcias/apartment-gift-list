"use client";

import { useMemo, useState } from "react";
import { Gift } from "@/types/gifts";
import GiftGrid from "./GiftGrid";
import HeaderFilterSection2 from "@/components/HeaderFilterSection2";
import { GiftStatusEnum } from "@/enums/gift.enum";

export default function GiftListClient({
  initialGifts,
}: Readonly<{
  initialGifts: Gift[];
}>) {
  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState([0, 2000]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [sortOrder, setSortOrder] = useState("");
  const [onlyAvailable, setOnlyAvailable] = useState(true);

  const clearAllFilters = () => {
    setSearchTerm("");
    setPriceRange([0, 2000]);
    setSelectedCategories([]);
    setSortOrder("");
    setOnlyAvailable(true);
  };

  const filteredGifts = useMemo(() => {
    let result = [...initialGifts];

    if (searchTerm) {
      result = result.filter((gift) =>
        gift.name.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    result = result.filter(
      (gift) => gift.price >= priceRange[0] && gift.price <= priceRange[1],
    );

    if (selectedCategories.length) {
      result = result.filter((gift) =>
        selectedCategories.includes(gift.Category?.name || ""),
      );
    }

    if (onlyAvailable) {
      result = result.filter(
        (gift) => gift.status.toLowerCase() === GiftStatusEnum.AVAILABLE,
      );
    }

    return result;
  }, [initialGifts, searchTerm, priceRange, selectedCategories, onlyAvailable]);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <HeaderFilterSection2
        searchQuery={searchTerm}
        setSearchQuery={setSearchTerm}
        priceRange={priceRange}
        setPriceRange={setPriceRange}
        selectedCategories={selectedCategories}
        setSelectedCategories={setSelectedCategories}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        onlyAvailable={onlyAvailable}
        setOnlyAvailable={setOnlyAvailable}
        clearAllFilters={clearAllFilters}
      />

      <GiftGrid gifts={filteredGifts} />
    </div>
  );
}
