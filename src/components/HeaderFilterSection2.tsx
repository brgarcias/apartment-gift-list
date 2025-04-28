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
}

const HeaderFilterSection2: FC<HeaderFilterSectionProps> = ({
  className = "mb-12",
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const [tabActive, setTabActive] = useState("Todos");
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);

  const fetchCategories = async () => {
    try {
      setIsLoadingCategories(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_NETLIFY_URL}/categories`
      );
      if (!res.ok) throw new Error("Falha ao carregar categorias");
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setIsLoadingCategories(false);
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
        <TabFilters />
      </Transition>
    </div>
  );
};

export default HeaderFilterSection2;
