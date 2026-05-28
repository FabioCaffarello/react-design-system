import type { HTMLAttributes } from "react";
import { Button, Input, Label } from "../../primitives";
import { cn } from "../../utils";
import { getSpacingClass } from "../../tokens/spacing";
import { getRadiusClass } from "../../tokens/radius";
import { getColorClass } from "../../tokens/colors";

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
        getColorClass("neutral", "light", "bg"),
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
        className={cn("space-y-4", props.className)}
      >
        <div className="space-y-2">
          <Label htmlFor="login-email" variant="required">
            Your email
          </Label>
          <Input id="login-email" placeholder="myname@email.com" type="email" />
        </div>
        <div className="space-y-2">
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
          <Button variant="regular" type="submit">
            Sign in
          </Button>
        </div>
      </form>
    </div>
  );
}
