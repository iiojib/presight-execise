import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { ErrorView } from "../components/ErrorView.tsx";

import { ErrorBoundary } from "./ErrorBoundary.tsx";
import { Layout } from "./Layout.tsx";
import { Persons } from "../pages/Persons.tsx";
import { Stream } from "../pages/Stream.tsx";
import { JobSubscriptionProvider } from "../jobs/JobsSubscription.tsx";
import { Jobs } from "../pages/Jobs.tsx";

const queryClient = new QueryClient();

export const App = () => (
  <QueryClientProvider client={queryClient}>
    <ErrorBoundary>
      {(hasError, error, resolve) => {
        if (hasError) {
          return <ErrorView error={error} resolve={resolve} />;
        }

        return (
          <BrowserRouter>
            <Routes>
              <Route element={<Layout />}>
                <Route path="/" element={<Navigate to="/persons" />} />
                <Route path="/persons" element={<Persons />} />
                <Route path="/stream" element={<Stream />} />
                <Route path="/jobs" element={<JobSubscriptionProvider />}>
                  <Route index element={<Jobs />} />
                </Route>
                <Route path="*" element={<Navigate to="/persons" />} />
              </Route>
            </Routes>
          </BrowserRouter>
        );
      }}
    </ErrorBoundary>
  </QueryClientProvider>
);
