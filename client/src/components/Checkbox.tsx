import { memo } from "react";

import { Check } from "../icons/Check";

export type CheckboxProps<Type extends string | number | undefined> = {
  value?: Type;
  checked?: boolean;
  onChange?: (checked: boolean, value: Type | undefined) => void;
  children?: string;
};

export const Checkbox = <Type extends string | number | undefined = undefined>({
  value,
  checked,
  onChange,
  children,
}: CheckboxProps<Type>) => {
  return (
    <label className="flex gap-2 place-items-center" title={children}>
      <input
        type="checkbox"
        value={value}
        checked={checked}
        onChange={(e) => onChange?.(e.target.checked, value)}
        className="peer absolute block h-0 w-0 overflow-hidden appearance-none outline-none"
      />

      <div
        className="
          group size-5 min-w-5 rounded border-1
          peer-focus:outline-2 peer-focus:outline-offset-1 peer-focus:outline-cyan-600
          border-gray-300 dark:border-gray-600 dark:bg-gray-900
          peer-checked:bg-cyan-600
        "
      >
        <div className="hidden size-full place-content-center place-items-center text-white group-peer-checked:flex">
          <Check />
        </div>
      </div>

      <span className="overflow-hidden whitespace-nowrap text-ellipsis">{children}</span>
    </label>
  );
};

export const SkeletonSize = {
  small: "small",
  medium: "medium",
  large: "large",
} as const;

export type SkeletonSize = (typeof SkeletonSize)[keyof typeof SkeletonSize];

export type CheckboxSkeletonProps = {
  size?: SkeletonSize | undefined;
};

const skeletonSizeArr = [SkeletonSize.small, SkeletonSize.medium, SkeletonSize.large];

const checkboxSkeleton = ({
  size = skeletonSizeArr[Math.floor(Math.random() * skeletonSizeArr.length)],
}: CheckboxSkeletonProps) => (
  <div className="h-6 flex gap-2 place-items-center animate-pulse">
    <div className="size-5 rounded bg-gray-300 dark:bg-gray-600" />
    <div
      data-size={SkeletonSize[size ?? SkeletonSize.medium]}
      className="
        h-4 $ rounded
        data-[size=small]:w-16
        data-[size=medium]:w-24
        data-[size=large]:w-32
        bg-gray-300 dark:bg-gray-600
      "
    />
  </div>
);

export const CheckboxSkeleton = memo(checkboxSkeleton);
