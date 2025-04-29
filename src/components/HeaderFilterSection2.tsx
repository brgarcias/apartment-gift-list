"use client";

import React, { FC, useEffect, useState } from "react";
import Heading from "@/shared/Heading/Heading";
import Nav from "@/shared/Nav/Nav";
import NavItem from "@/shared/NavItem/NavItem";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import ButtonPrimary from "@/shared/Button/ButtonPrimary";
import TabFilters from "@/components/TabFilters";
import { Transition } from "@/app/headlessui";
import { Category } from "@prisma/client";

export interface HeaderFilterSectionProps {
  className?: string;
  priceRange: number[];
  setPriceRange: (range: number[]) => void;
  selectedCategories: string[];
  setSelectedCategories: (categories: string[]) => void;
  sortOrder: string;
  setSortOrder: (order: string) => void;
  onlyAvailable: boolean;
  setOnlyAvailable: (available: boolean) => void;
}

const HeaderFilterSection2: FC<HeaderFilterSectionProps> = ({
  className = "mb-6",
  priceRange,
  setPriceRange,
  selectedCategories,
  setSelectedCategories,
  sortOrder,
  setSortOrder,
  onlyAvailable,
  setOnlyAvailable,
}) => {
  const [categories, setCategories] = useState<Category[]>([]);

  const fetchCategories = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_NETLIFY_URL}/categories`
      );
      if (!res.ok) throw new Error("Falha ao carregar categorias");
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className={`flex flex-col relative ${className}`}>
      <Heading
        desc="Escolha seu presente com muito carinho."
        className="mb-1"
      >{`Lista de Presentes`}</Heading>

      <Transition
        show
        enter="transition-opacity duration-150"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-150"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="w-full border-b border-neutral-200 dark:border-neutral-700 my-6"></div>
        <TabFilters
          categories={categories}
          priceRange={priceRange}
          setPriceRange={setPriceRange}
          selectedCategories={selectedCategories}
          setSelectedCategories={setSelectedCategories}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
          onlyAvailable={onlyAvailable}
          setOnlyAvailable={setOnlyAvailable}
        />
      </Transition>
    </div>
  );
};

export default HeaderFilterSection2;
