import type { SelectHTMLAttributes } from "react";

interface Option {
  value: string;
  label: string;
  disabled?: boolean;
}

interface Props extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "children"> {
  options: Option[];
  placeholder?: string;
  error?: boolean;
}

/**
 * Select Component
 * 
 * A styled select dropdown component for forms.
 * Follows Atomic Design principles as an Atom component.
 * 
 * @example
 * ```tsx
 * <Select 
 *   options={[
 *     { value: "1", label: "Option 1" },
 *     { value: "2", label: "Option 2" }
 *   ]}
 *   placeholder="Select an option"
 * />
 * ```
 */
export default function Select({
  options,
  placeholder,
  error = false,
  className = "",
  ...props
}: Props) {
  const baseClasses = [
    "block",
    "w-full",
    "rounded",
    "h-form-element",
    "px-large",
    "border",
    "text-base",
    "focus:outline-none",
    "focus:ring-2",
    "focus:ring-offset-2",
  ];

  const errorClasses = error
    ? "border-red-500 focus:ring-red-500"
    : "border-gray-300 focus:ring-indigo-500";

  const classes = [
    ...baseClasses,
    errorClasses,
    className,
  ].filter(Boolean).join(" ");

  return (
    <select
      className={classes}
      aria-invalid={error}
      aria-describedby={error ? `${props.id}-error` : undefined}
      {...props}
    >
      {placeholder && (
        <option value="" disabled>
          {placeholder}
        </option>
      )}
      {options.map((option) => (
        <option
          key={option.value}
          value={option.value}
          disabled={option.disabled}
        >
          {option.label}
        </option>
      ))}
    </select>
  );
}
