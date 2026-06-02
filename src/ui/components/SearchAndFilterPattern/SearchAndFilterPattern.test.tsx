import { describe, it, expect } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { SearchAndFilterPattern } from "./SearchAndFilterPattern";

// SearchInput debounces onSearch by 300ms — fireEvent.change updates
// the input value synchronously but the parent's onSearch (and
// therefore the rendered filter result) only fires after the debounce
// window. Tests wait for the post-debounce DOM rather than asserting
// immediately after the change.

type Item = { id: number; name: string; category: string };

const items: Item[] = [
  { id: 1, name: "Apple", category: "fruit" },
  { id: 2, name: "Banana", category: "fruit" },
  { id: 3, name: "Carrot", category: "vegetable" },
];

const searchFn = (query: string, item: Item) =>
  item.name.toLowerCase().includes(query);
const filterFn = (filters: Record<string, unknown>, item: Item) => {
  const cat = filters.category;
  return !cat || item.category === cat;
};
const renderItem = (item: Item) => (
  <div data-testid={`row-${item.id}`}>{item.name}</div>
);

describe("SearchAndFilterPattern", () => {
  it("renders every item in the initial list and the total count", () => {
    render(
      <SearchAndFilterPattern
        items={items}
        searchFn={searchFn}
        renderItem={renderItem}
      />,
    );

    expect(screen.getByText("Apple")).toBeInTheDocument();
    expect(screen.getByText("Banana")).toBeInTheDocument();
    expect(screen.getByText("Carrot")).toBeInTheDocument();
    expect(screen.getByText(/showing 3 of 3 results/i)).toBeInTheDocument();
  });

  it("narrows the list and updates the result count when the search input changes", async () => {
    render(
      <SearchAndFilterPattern
        items={items}
        searchFn={searchFn}
        renderItem={renderItem}
      />,
    );

    const searchBox = screen.getByRole("searchbox");
    fireEvent.change(searchBox, { target: { value: "app" } });

    await waitFor(() => {
      expect(screen.queryByText("Banana")).not.toBeInTheDocument();
    });
    expect(screen.getByText("Apple")).toBeInTheDocument();
    expect(screen.queryByText("Carrot")).not.toBeInTheDocument();
    expect(screen.getByText(/showing 1 of 3 results/i)).toBeInTheDocument();
  });

  it("applies the configured filter select to the rendered set", () => {
    render(
      <SearchAndFilterPattern
        items={items}
        filterFn={filterFn}
        renderItem={renderItem}
        filters={[
          {
            id: "category",
            label: "Category",
            type: "select",
            options: [
              { id: "fruit", label: "Fruit", value: "fruit" },
              { id: "vegetable", label: "Vegetable", value: "vegetable" },
            ],
          },
        ]}
      />,
    );

    fireEvent.change(screen.getByLabelText("Category"), {
      target: { value: "vegetable" },
    });

    expect(screen.queryByText("Apple")).not.toBeInTheDocument();
    expect(screen.queryByText("Banana")).not.toBeInTheDocument();
    expect(screen.getByText("Carrot")).toBeInTheDocument();
  });

  it("surfaces a Clear Filters action only when a filter is active and resets state on click", async () => {
    render(
      <SearchAndFilterPattern
        items={items}
        searchFn={searchFn}
        renderItem={renderItem}
      />,
    );

    expect(
      screen.queryByRole("button", { name: /clear filters/i }),
    ).not.toBeInTheDocument();

    fireEvent.change(screen.getByRole("searchbox"), {
      target: { value: "carrot" },
    });

    const clear = await screen.findByRole("button", {
      name: /clear filters/i,
    });
    fireEvent.click(clear);

    await waitFor(() => {
      expect(screen.getByText("Apple")).toBeInTheDocument();
    });
    expect(screen.getByText("Banana")).toBeInTheDocument();
    expect(screen.getByText("Carrot")).toBeInTheDocument();
  });

  it("renders the empty-state message when no items match", async () => {
    render(
      <SearchAndFilterPattern
        items={items}
        searchFn={searchFn}
        renderItem={renderItem}
        emptyMessage="Nothing here"
      />,
    );

    fireEvent.change(screen.getByRole("searchbox"), {
      target: { value: "xyz" },
    });

    expect(await screen.findByText("Nothing here")).toBeInTheDocument();
  });

  it("hides the results count when showResultsCount is false", () => {
    render(
      <SearchAndFilterPattern
        items={items}
        searchFn={searchFn}
        renderItem={renderItem}
        showResultsCount={false}
      />,
    );

    expect(screen.queryByText(/showing/i)).not.toBeInTheDocument();
  });
});
