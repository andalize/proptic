"use client";

import { FC, PropsWithChildren } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const Providers: FC<PropsWithChildren> = ({ children }) => {
  const reactQuery = new QueryClient();

//   const { data: userProfile } = useProfileStore();
    return (
      <QueryClientProvider client={reactQuery}>
        {children}
        {process.env.NODE_ENV === 'development' && (
          <ReactQueryDevtools initialIsOpen={false} />
        )}
      </QueryClientProvider>
  );
};

export default Providers;
