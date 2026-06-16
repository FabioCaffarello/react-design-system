"use client";

import { forwardRef, useState, memo, useId } from "react";
import { getSpacingClass } from "../../tokens/spacing";
import { X, Eye, EyeOff } from "lucide-react";
import Button from "../Button/Button";
import InputBase from "./InputBase";
import type { InputBaseProps } from "./InputBase";

// The presentational variant types live on InputBase now (the shared,
// server-safe core). Re-exported here so existing deep imports and the
// folder index keep resolving them from "./Input".
export type { InputSize, InputVariant, InputState } from "./InputBase";

export interface InputProps extends Omit<InputBaseProps, "rightSlot"> {
  showClearButton?: boolean;
  onClear?: () => void;
}

/**
 * Input Component
 *
 * The interactive text input: everything `InputBase` renders, plus the
 * client-only affordances that require React state — the password
 * visibility toggle (`type="password"`), the clear button
 * (`showClearButton`), and the `useId` auto-id fallback. It **composes**
 * `InputBase` (issue #224): the presentational shell lives once in
 * `InputBase`, and `Input` layers the stateful affixes on top, passing
 * the resolved `id`, the toggled `type`, and its buttons via `rightSlot`.
 *
 * Need a server-renderable / native-form input with no client state?
 * Import `InputBase` from `@fabio.caffarello/react-design-system/server`.
 *
 * @example
 * ```tsx
 * <Input
 *   id="email"
 *   label="Email"
 *   type="email"
 *   placeholder="Enter your email"
 *   error={hasError}
 *   helperText={errorMessage}
 *   leftIcon={<MailIcon />}
 * />
 * ```
 */
const Input = memo(
  forwardRef<HTMLInputElement, InputProps>(function Input(
    {
      id,
      label,
      error = false,
      success = false,
      helperText,
      size = "md",
      variant = "outlined",
      leftIcon,
      rightIcon,
      showClearButton = false,
      onClear,
      className = "",
      disabled = false,
      type = "text",
      value,
      onChange,
      ...props
    },
    ref,
  ) {
    // Stable fallback id when the consumer doesn't provide one. This is
    // the client hook that keeps Input on the main entry; InputBase (no
    // useId) is the server-safe half and receives the resolved id below.
    const reactId = useId();
    const inputId = id || `input-${reactId}`;

    // Password toggle state.
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === "password";
    const inputType = isPassword && showPassword ? "text" : type;

    const hasValue = value !== undefined && value !== null && value !== "";
    const shouldShowClear = showClearButton && hasValue && !disabled;

    const iconSize =
      size === "sm" ? "h-4 w-4" : size === "lg" ? "h-5 w-5" : "h-4 w-4";

    const handleClear = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (onClear) {
        onClear();
      } else if (onChange) {
        // Create a synthetic event to clear the input when the consumer
        // is controlled but didn't pass onClear.
        const inputElement = e.currentTarget
          .closest(".relative")
          ?.querySelector("input") as HTMLInputElement;
        if (inputElement) {
          const syntheticEvent = {
            target: inputElement,
            currentTarget: inputElement,
            bubbles: true,
            cancelable: true,
            defaultPrevented: false,
            eventPhase: 2,
            isTrusted: false,
            nativeEvent: new Event("change"),
            preventDefault: () => {},
            stopPropagation: () => {},
            persist: () => {},
            timeStamp: Date.now(),
          } as unknown as React.ChangeEvent<HTMLInputElement>;
          Object.defineProperty(syntheticEvent.target, "value", {
            value: "",
            writable: true,
          });
          Object.defineProperty(syntheticEvent.currentTarget, "value", {
            value: "",
            writable: true,
          });
          onChange(syntheticEvent);
        }
      }
    };

    const handleTogglePassword = () => setShowPassword((prev) => !prev);

    // Trailing-affix slot: the interactive clear + password-toggle
    // buttons (the reason Input stays client), falling back to the
    // decorative rightIcon when neither is active. Same content and DOM
    // order the pre-composition Input rendered, now projected into
    // InputBase's right-affix container.
    const hasRightAffix = shouldShowClear || isPassword || Boolean(rightIcon);
    const rightSlot = hasRightAffix ? (
      <>
        {shouldShowClear && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className={`h-auto ${getSpacingClass("xs", "p")}`}
            aria-label="Clear input"
          >
            <X className={iconSize} />
          </Button>
        )}
        {isPassword && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleTogglePassword}
            className={`h-auto ${getSpacingClass("xs", "p")}`}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <EyeOff className={iconSize} />
            ) : (
              <Eye className={iconSize} />
            )}
          </Button>
        )}
        {rightIcon && !shouldShowClear && !isPassword && (
          <div
            className={`text-fg-secondary opacity-60 pointer-events-none ${iconSize}`}
          >
            {rightIcon}
          </div>
        )}
      </>
    ) : undefined;

    return (
      <InputBase
        ref={ref}
        id={inputId}
        label={label}
        error={error}
        success={success}
        helperText={helperText}
        size={size}
        variant={variant}
        leftIcon={leftIcon}
        rightSlot={rightSlot}
        className={className}
        disabled={disabled}
        type={inputType}
        value={value}
        onChange={onChange}
        {...props}
      />
    );
  }),
);

Input.displayName = "Input";

export default Input;
