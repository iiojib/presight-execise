import { Button } from "./Button";

export type ErrorViewProps = {
  error: unknown;
  resolve: () => void;
};

export const ErrorView = ({ error, resolve }: ErrorViewProps) => (
  <section className="flex min-h-full place-content-center place-items-center">
    <div className="flex flex-col gap-4 max-w-prose text-center px-4 py-16 sm:px-6 sm:py-24 lg:px-8 lg:py-32">
      <h2 className="text-2xl font-bold sm:text-5xl">An error occurred</h2>

      <p className="text-base text-pretty sm:text-lg/relaxed text-gray-700 dark:text-gray-200">
        {error instanceof Error ? `${error.name}: ${error.message}` : String(error)}
      </p>

      <div>
        <Button onClick={resolve}>Try again</Button>
      </div>
    </div>
  </section>
);
