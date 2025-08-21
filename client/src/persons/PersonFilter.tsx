import { useMemo, type ReactNode } from "react";
import { Checkbox, CheckboxSkeleton } from "../components/Checkbox";

export type PersonFilterProps = {
  isLoading: boolean;
  items: string[];
  selection: string[];
  children?: ReactNode;
  onItemChange: (item: string, checked: boolean) => void;
};

export const PersonFilter = ({ isLoading, items, selection, children, onItemChange }: PersonFilterProps) => {
  const selectionSet = useMemo(() => {
    const set = new Set<string>();

    selection.forEach((item) => {
      set.add(item);
    });

    return set;
  }, [selection]);

  return (
    <div className="flex flex-col gap-2">
      <h4 className="font-medium">{children}</h4>

      <ul className="pl-2 flex flex-col gap-1">
        {isLoading && Array.from({ length: 6 }, (_, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: ignore
          <li key={i}><CheckboxSkeleton /></li>
        ))}

        {!isLoading && items.map((item) => (
          <li key={item}>
            <Checkbox
              checked={selectionSet.has(item)}
              onChange={(checked) => onItemChange(item, checked)}
            >
              {item}
            </Checkbox>
          </li>
        ))}
      </ul>
    </div>
  );
};
