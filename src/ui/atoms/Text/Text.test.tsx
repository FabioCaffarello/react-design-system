import { render } from "@testing-library/react";

import Text from "./Text";

describe("UI / atom / Text", () => {
  const TEXT = "Test";

  it("should render properly", () => {
    const { getByText } = render(<Text>{TEXT}</Text>);

    expect(getByText(TEXT)).toBeInTheDocument();
  });

  it("should change the tag accordingly", () => {
    const heading = render(<Text variant="heading">{TEXT}</Text>);
    const regular = render(<Text>{TEXT}</Text>);
    const listItem = render(<Text variant="list">{TEXT}</Text>);

    expect(heading.container.querySelector("h2")).toBeInTheDocument();
    expect(regular.container.querySelector("p")).toBeInTheDocument();
    expect(listItem.container.querySelector("li")).toBeInTheDocument();
  });

  it("should force the tag accordingly", () => {
    const { container } = render(<Text as="h1">{TEXT}</Text>);

    expect(container.querySelector("h1")).toBeInTheDocument();
  });

  it("should make the text bold", () => {
    const { container } = render(<Text bold>{TEXT}</Text>);

    expect(container.querySelector(".font-bold")).toBeInTheDocument();
  });

  it("should make the text italic", () => {
    const { container } = render(<Text italic>{TEXT}</Text>);

    expect(container.querySelector(".italic")).toBeInTheDocument();
  });

  it("should change the color", () => {
    const { container } = render(<Text color="red-500">{TEXT}</Text>);

    expect(container.querySelector(".text-red-500")).toBeInTheDocument();
  });
});