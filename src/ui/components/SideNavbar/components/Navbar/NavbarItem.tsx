"use client";

import React from "react";
import { useNavbarRequired } from "../../contexts/NavbarContext";
import { cn } from "../../../../utils";
import { getSpacingClass } from "../../../../tokens/spacing";
import { getZIndexClass } from "../../../../tokens/z-index";
import Tooltip from "../../../../primitives/Tooltip/Tooltip";
import type { NavbarItemProps, NavbarLabelMode } from "../../types";

/**
 * Size configuration for navbar items
 */
const SIZE_CLASSES = {
  sm: {
    container: "w-8 h-8",
    icon: "w-4 h-4",
    badge: "min-w-3.5 h-3.5 text-2xs",
  },
  md: {
    container: "w-10 h-10",
    icon: "w-5 h-5",
    badge: "min-w-5 h-5 text-xs",
  },
  lg: {
    container: "w-12 h-12",
    icon: "w-6 h-6",
    badge: "min-w-5 h-5 text-xs",
  },
} as const;

/**
 * Badge variant colors
 */
const BADGE_VARIANTS = {
  default: "bg-red-500",
  success: "bg-green-500",
  warning: "bg-amber-500",
  danger: "bg-red-600",
} as const;

/**
 * Navigation item for the Navbar subcomponent
 *
 * Displays an icon button with optional tooltip, badge, and active state.
 * Supports multiple sizes, variants, and can render as a link when href is provided.
 *
 * @example
 * ```tsx
 * // Basic button
 * <SideNavbar.Navbar.Item
 *   icon={<Home />}
 *   label="Home"
 *   onClick={() => navigate('/')}
 * />
 *
 * // As a link
 * <SideNavbar.Navbar.Item
 *   icon={<Docs />}
 *   label="Documentation"
 *   href="/docs"
 * />
 *
 * // With badge
 * <SideNavbar.Navbar.Item
 *   icon={<Bell />}
 *   label="Notifications"
 *   badge={5}
 *   badgeVariant="danger"
 * />
 * ```
 */
const LABEL_STYLES: Record<NavbarLabelMode, string> = {
  tooltip: "", // Uses existing tooltip behavior
  inline: `flex-row ${getSpacingClass("sm", "gap")} w-full ${getSpacingClass("md", "px")}`,
  below: `flex-col ${getSpacingClass("1.5", "gap")}`,
};

export default function NavbarItem({
  id,
  icon,
  label,
  labelMode,
  showLabel = true,
  active = false,
  showTooltip = true,
  badge,
  badgeVariant = "default",
  variant = "default",
  size = "md",
  href,
  target,
  onClick,
  disabled = false,
  className = "",
  ...props
}: NavbarItemProps) {
  const {
    activeItem,
    setActiveItem,
    labelMode: contextLabelMode,
  } = useNavbarRequired();

  // Use prop labelMode or fallback to context labelMode or 'tooltip'
  const effectiveLabelMode = labelMode ?? contextLabelMode ?? "tooltip";

  const isActive = active || (id && activeItem === id);
  const sizeConfig = SIZE_CLASSES[size];

  const handleClick = (e: React.MouseEvent) => {
    if (disabled) {
      e.preventDefault();
      return;
    }
    if (id) {
      setActiveItem(id);
    }
    onClick?.();
  };

  // Label element (for inline and below modes)
  const labelElement = effectiveLabelMode !== "tooltip" &&
    showLabel &&
    label && (
      <span
        className={cn(
          "text-xs",
          "flex-shrink-0", // Prevenir que label encolha
          "relative z-10", // Garantir que label fique na frente do ícone
          effectiveLabelMode === "below" && "text-center",
          effectiveLabelMode === "inline" && "truncate",
        )}
        style={{
          // Garantir que label não seja afetada por transformações
          willChange: "auto",
          transform: "none",
          zIndex: 10, // Garantir que label fique na frente do ícone
        }}
      >
        {label}
      </span>
    );

  // Base classes for the item
  // Removido transition-colors e duration-150 para eliminar animações
  // Adicionado box-border para estabilidade dimensional
  const baseClasses = cn(
    "relative",
    "flex",
    "items-center",
    effectiveLabelMode === "inline" ? "justify-start" : "justify-center",
    effectiveLabelMode === "below" && "flex-col",
    "rounded-lg",
    "box-border", // Garantir box-sizing consistente
    "focus:outline-none",
    "focus:ring-2",
    "focus:ring-[var(--color-primary-500)]",
    "focus:ring-offset-1",
    "w-full", // Ensure full width for vertical layout
    "flex-shrink-0", // Prevent items from shrinking
    "min-w-0", // Prevent flex items from overflowing
    // Remover todas as transições que possam causar movimento
    "[&>*]:!transition-none",
    "[&>*]:!transform-none",
    effectiveLabelMode === "tooltip"
      ? sizeConfig.container
      : cn(getSpacingClass("sm", "px"), getSpacingClass("1.5", "py")),
    effectiveLabelMode !== "tooltip" && LABEL_STYLES[effectiveLabelMode],
    disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer",
    className,
  );

  // Variant-specific classes usando variáveis CSS via Tailwind arbitrary values
  // Estados hover/active sem transições para evitar movimento
  const variantClasses = {
    default: isActive
      ? "bg-[var(--color-primary-100)] text-[var(--color-primary-600)]"
      : disabled
        ? "text-[var(--color-neutral-400)]"
        : "text-[var(--color-neutral-600)] hover:bg-[var(--color-neutral-100)] hover:text-[var(--color-neutral-900)] [&:hover]:!transform-none",
    ghost: isActive
      ? "text-[var(--color-primary-600)]"
      : disabled
        ? "text-[var(--color-neutral-400)]"
        : "text-[var(--color-neutral-600)] hover:text-[var(--color-neutral-900)] [&:hover]:!transform-none",
    subtle: isActive
      ? "bg-[var(--color-neutral-100)] text-[var(--color-neutral-900)]"
      : disabled
        ? "text-[var(--color-neutral-400)]"
        : "text-[var(--color-neutral-500)] hover:bg-[var(--color-neutral-50)] hover:text-[var(--color-neutral-700)] [&:hover]:!transform-none",
  };

  const content = (
    <>
      {/* Wrapper do ícone - sem animações, com estabilidade dimensional */}
      <span
        className={cn(
          "flex-shrink-0",
          sizeConfig.icon,
          "[&>svg]:transition-none",
          "[&>svg]:!transform-none",
          "[&>svg]:!will-change-auto",
          "box-border",
          "flex items-center justify-center",
          // Garantir que ícone não sobreponha label - z-index menor que label
          `relative ${getZIndexClass("base")}`,
        )}
        style={{
          // Garantir dimensões mínimas fixas para evitar "pular"
          minWidth:
            sizeConfig.icon === "w-4 h-4"
              ? "1rem"
              : sizeConfig.icon === "w-5 h-5"
                ? "1.25rem"
                : "1.5rem",
          minHeight:
            sizeConfig.icon === "w-4 h-4"
              ? "1rem"
              : sizeConfig.icon === "w-5 h-5"
                ? "1.25rem"
                : "1.5rem",
          // Forçar sem animações ou transformações
          willChange: "auto",
          transform: "none",
          transition: "none",
          // Garantir que ícone fique atrás do label quando ambos estão visíveis
          zIndex: effectiveLabelMode !== "tooltip" ? 0 : "auto",
        }}
      >
        {icon}
      </span>

      {/* Label (for inline and below modes) - posicionada após o ícone */}
      {labelElement}

      {/* Badge */}
      {badge !== undefined && badge !== null && (
        <span
          className={cn(
            "absolute",
            "-top-1",
            "-right-1",
            "flex",
            "items-center",
            "justify-center",
            "px-1",
            "font-medium",
            "text-white",
            "rounded-full",
            sizeConfig.badge,
            BADGE_VARIANTS[badgeVariant],
          )}
        >
          {badge}
        </span>
      )}
    </>
  );

  // Render as link if href is provided
  // Adicionar style inline para garantir que não há transformações em hover
  const elementStyle = {
    willChange: "auto",
    transform: "none",
    transition: "none",
  };

  const element = href ? (
    <a
      href={href}
      target={target}
      rel={target === "_blank" ? "noopener noreferrer" : undefined}
      onClick={handleClick}
      className={cn(baseClasses, variantClasses[variant])}
      style={elementStyle}
      aria-label={label}
      aria-current={isActive ? "page" : undefined}
      aria-disabled={disabled}
    >
      {content}
    </a>
  ) : (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      className={cn(baseClasses, variantClasses[variant])}
      style={elementStyle}
      aria-label={label}
      aria-current={isActive ? "page" : undefined}
      {...props}
    >
      {content}
    </button>
  );

  // Wrap with tooltip only if mode is 'tooltip'
  if (effectiveLabelMode === "tooltip" && showTooltip && label && !disabled) {
    return (
      <Tooltip content={label} position="right">
        {element}
      </Tooltip>
    );
  }

  return element;
}
