import React from "react";
import type { HTMLAttributes } from "react";

export interface BoxWrapperProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export default function BoxWrapper({ className, ...props }: BoxWrapperProps): React.JSX.Element {
  const classNames = [className, "p-large", "bg-bg", "rounded", "shadow-card"];

  return <div className={classNames.join(" ")} {...props} />;
}
