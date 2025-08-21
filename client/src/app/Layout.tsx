import { Outlet } from "react-router";

import { Navbar } from "./Navbar";
import { ModeSwitcher } from "./ModeSwitcher";

export const Layout = () => (
  <div className="flex flex-col">
    <header
      className="
        sticky top-0 z-1
        h-16 flex place-content-center
        bg-white border-b-1 border-gray-300/50
        dark:bg-gray-800 dark:border-gray-700/50
      "
    >
      <div className="w-full max-w-7xl px-8 flex gap-8 justify-between place-items-center whitespace-nowrap">
        <Navbar />
        <ModeSwitcher />
      </div>
    </header>

    <main>
      <Outlet />
    </main>
  </div>
);
