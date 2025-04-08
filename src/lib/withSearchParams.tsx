"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

export function withSearchParams<T>(WrappedComponent: React.ComponentType<T>) {
  return function ComponentWithSearchParams(
    props: Omit<T, "router" | "pathname" | "searchParams">
  ) {
    return (
      <Suspense fallback={<div>Loading...</div>}>
        <InnerComponent {...props} />
      </Suspense>
    );
  };

  function InnerComponent(
    props: Omit<T, "router" | "pathname" | "searchParams">
  ) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    return (
      <WrappedComponent
        {...(props as T)}
        router={router}
        pathname={pathname}
        searchParams={searchParams}
      />
    );
  }
}
