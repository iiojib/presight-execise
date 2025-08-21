import { useEffect, useState, type FormEvent } from "react";

import { TextField } from "../components/TextField";
import { Button } from "../components/Button";
import { Magnifier } from "../icons/Magnifier";

export type PersonSearchProps = {
  value: string;
  onSubmit: (value: string) => void;
};

export const PersonSearch = ({ value, onSubmit }: PersonSearchProps) => {
  const [search, setSearch] = useState(value);

  useEffect(() => {
    setSearch(value);
  }, [value]);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(search);
  };

  return (
    <form onSubmit={submit} className="w-full flex gap-2">
      <TextField value={search} onChange={setSearch} placeholder="Search persons by name..." maxLength={512} />
      <Button type="submit"><Magnifier /></Button>
    </form>
  );
};
