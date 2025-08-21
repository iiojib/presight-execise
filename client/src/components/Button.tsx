import type { ReactNode } from "react";

export type ButtonProps = {
  children?: ReactNode;
  type?: "button" | "submit";
  onClick?: (() => void) | undefined;
};

export const Button = ({ children, onClick, type = "button" }: ButtonProps) => (
  <button
    type={type}
    className="
      inline-block px-5 py-2
      rounded border border-cyan-600
      bg-cyan-600 hover:bg-cyan-700
      font-medium text-white
      shadow-sm transition-colors
      active:bg-cyan-800
      outline-cyan-600 focus:outline-2 focus:outline-offset-1
    "
    onClick={onClick}
  >
    {children}
  </button>
);
