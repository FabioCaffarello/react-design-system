import { describe, it, expect } from "vitest";
import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useForm } from "react-hook-form";
import Form from "./Form";
import { FormField } from "./FormField";
import { Input } from "../../primitives";

type NestedValues = { user: { email: string } };

function NestedHarness() {
  const form = useForm<NestedValues>({
    defaultValues: { user: { email: "" } },
  });
  return (
    <Form form={form} onSubmit={() => {}}>
      <FormField<NestedValues>
        name="user.email"
        label="Email"
        rules={{ required: "Email is required" }}
      >
        {({ register, error, id }) => (
          <Input id={id} {...register("user.email")} error={!!error} />
        )}
      </FormField>
      <button type="submit">Submit</button>
    </Form>
  );
}

function FlatHarness() {
  const form = useForm<{ email: string }>({ defaultValues: { email: "" } });
  return (
    <Form form={form} onSubmit={() => {}}>
      <FormField<{ email: string }> name="email" label="Email">
        {({ register, id }) => <Input id={id} {...register("email")} />}
      </FormField>
    </Form>
  );
}

describe("FormField", () => {
  it("surfaces validation errors for nested/dotted field paths", async () => {
    const user = userEvent.setup();
    render(<NestedHarness />);

    await act(async () => {
      await user.click(screen.getByRole("button", { name: "Submit" }));
    });

    // Regression: a flat `errors[name]` lookup returned undefined for a
    // dotted path like "user.email", so the error was silently swallowed.
    // `get(errors, name)` resolves the nested path the way RHF does.
    expect(await screen.findByText("Email is required")).toBeInTheDocument();
  });

  it("associates the label with the input via the render-prop id", () => {
    render(<FlatHarness />);

    // getByLabelText only resolves when the label's htmlFor matches the
    // input's id — proving FormField now supplies a working association id
    // instead of leaving the consumer to hardcode a matching one.
    expect(screen.getByLabelText("Email")).toBeInstanceOf(HTMLInputElement);
  });
});
