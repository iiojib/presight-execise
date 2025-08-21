export type TextFieldProps = {
  placeholder: string;
  value?: string | undefined;
  maxLength?: number | undefined;
  onChange?: (value: string) => void;
};

export const TextField = ({ placeholder, value, maxLength, onChange }: TextFieldProps) => (
  <input
    type="text"
    placeholder={placeholder}
    value={value}
    maxLength={maxLength}
    onChange={(e) => onChange?.(e.target.value)}
    className="
      appearance-none w-full rounded border-1 px-3 py-2 sm:text-sm
      border-gray-300 dark:border-gray-600 dark:bg-gray-900
      focus:outline-2 focus:outline-cyan-600
    "
  />
);
