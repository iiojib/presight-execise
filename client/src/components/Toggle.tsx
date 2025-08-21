export type ToggleProps = {
  checked: boolean;
  onChange?: ((checked: boolean) => void) | undefined;
};

export const Toggle = ({ checked, onChange }: ToggleProps) => (
  <label
    className="
      block relative h-6 w-10
      rounded-full
      transition-colors outline-0
      bg-gray-300 has-checked:bg-cyan-500
      dark:bg-gray-600 dark:has-checked:bg-cyan-600
      has-focus:outline-2 has-focus:outline-offset-1 has-focus:outline-cyan-600
    "
  >
    <input
      type="checkbox"
      className="peer block h-0 w-0 overflow-hidden appearance-none outline-none"
      checked={checked}
      onChange={() => onChange?.(!checked)}
    />

    <div
      className="
        absolute inset-y-0 start-0
        m-1 size-4
        rounded-full
        transition-[inset-inline-start] peer-checked:start-4
        bg-white dark:bg-gray-900
      "
    />
  </label>
);
