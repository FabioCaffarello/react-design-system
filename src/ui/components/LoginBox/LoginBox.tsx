import type { HTMLAttributes } from "react";
import { Button, Input, Label } from "../../primitives";
import { cn } from "../../utils";
import { getSpacingClass } from "../../tokens/spacing";
import { getRadiusClass } from "../../tokens/radius";

interface Props extends HTMLAttributes<HTMLFormElement> {
  onForgotPasswordClick: () => void;
}

export default function LoginBox({
  onForgotPasswordClick,
  className,
  ...props
}: Props) {
  return (
    <div
      className={cn(
        getSpacingClass("base", "p"),
        "bg-surface-muted",
        getRadiusClass("md"),
        className,
      )}
    >
      <form
        {...props}
        onSubmit={(e) => {
          e.preventDefault();
          if (props.onSubmit) props.onSubmit(e);
        }}
        className={getSpacingClass("base", "space-y")}
      >
        <div className={getSpacingClass("sm", "space-y")}>
          <Label htmlFor="login-email" variant="required">
            Your email
          </Label>
          <Input id="login-email" placeholder="myname@email.com" type="email" />
        </div>
        <div className={getSpacingClass("sm", "space-y")}>
          <Label htmlFor="login-password" variant="required">
            Your password
          </Label>
          <Input id="login-password" placeholder="••••••••" type="password" />
        </div>
        <div className="flex justify-between">
          <Button
            variant="secondary"
            type="button"
            onClick={onForgotPasswordClick}
          >
            Forgot password?
          </Button>
          <Button variant="primary" type="submit">
            Sign in
          </Button>
        </div>
      </form>
    </div>
  );
}
