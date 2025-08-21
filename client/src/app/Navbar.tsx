import type { ReactNode } from "react";
import { NavLink } from "react-router";

type LinkProps = {
  children?: ReactNode;
  to: string;
};

const Link = ({ children, to }: LinkProps) => (
  <NavLink to={to} className="[&.active]:text-cyan-600">
    {children}
  </NavLink>
);

export const Navbar = () => (
  <nav className="flex gap-6">
    <Link to="/persons">Persons</Link>
    <Link to="/stream">Stream</Link>
    <Link to="/jobs">Jobs</Link>
  </nav>
);
