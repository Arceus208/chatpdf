"use client";

import {
  QueryClientProvider,
  QueryClient,
} from "@tanstack/react-query";
import { useState } from "react";

type Props = {
  children: React.ReactNode;
};

export const QueryProviders = ({
  children,
}: Props) => {
  const [queryClient] = useState(
    () => new QueryClient()
  );
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};
