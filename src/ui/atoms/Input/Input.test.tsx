import type { ChangeEvent } from "react";

import { fireEvent, render } from "@testing-library/react";

import Input from "./Input";

describe("UI / atom / Input", () => {
  const PLACEHOLDER = "Hello from Input";

  it("should properly render", () => {
    const { getByPlaceholderText } = render(
      <Input placeholder={PLACEHOLDER} />,
    );

    expect(getByPlaceholderText(PLACEHOLDER)).toBeInTheDocument();
  });

  it("should display a default value", () => {
    const VALUE = "Hello from Input";
    const { getByDisplayValue } = render(<Input defaultValue={VALUE} />);
    expect(getByDisplayValue(VALUE)).toBeInTheDocument();
  });

  it("should emit an event when the value is changed", () => {
    const changeFn: (input: string) => void = vitest.fn();
    const CHANGE_TEXT = "Hello";

    const { getByPlaceholderText } = render(
      <Input
        placeholder={PLACEHOLDER}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          changeFn(e.target.value)
        }
      />,
    );

    fireEvent.change(getByPlaceholderText(PLACEHOLDER), {
      target: { value: CHANGE_TEXT },
    });

    expect(changeFn).toHaveBeenCalledWith(CHANGE_TEXT);
  });

  it("should allow for change of the type", () => {
    const { getByPlaceholderText } = render(
      <Input placeholder={PLACEHOLDER} type="password" />,
    );

    expect(getByPlaceholderText(PLACEHOLDER)).toHaveAttribute(
      "type",
      "password",
    );
  });
});
