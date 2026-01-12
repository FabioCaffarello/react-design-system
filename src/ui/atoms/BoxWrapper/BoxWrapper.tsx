import type { HTMLAttributes } from "react";

export interface BoxWrapperProps extends HTMLAttributes<HTMLDivElement> {}

export default function BoxWrapper({ className, ...props }: BoxWrapperProps) {
  const classNames = [className, "p-large", "bg-bg", "rounded", "shadow-card"];

  return <div className={classNames.join(" ")} {...props} />;
}
