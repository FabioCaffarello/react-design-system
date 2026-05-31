import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { expect, userEvent, within, waitFor } from "storybook/test";
import { useState } from "react";
import DatePicker from "./DatePicker";

const meta: Meta<typeof DatePicker> = {
  title: "Components/DatePicker",
  component: DatePicker,
  parameters: {
    docs: {
      description: {
        component: `
## DatePicker

A flexible date picker component with single date and range selection. Supports keyboard navigation, date validation, and basic localization.

### Events

| Event | Description | Parameters | When Fired |
|-------|-------------|------------|------------|
| \`onValueChange\` | Data selecionada mudou | \`(value: Date | { start: Date, end: Date } | null) => void\` | Quando uma data é selecionada ou alterada |

### States

| State | Description | How to Activate | Visual |
|-------|-------------|-----------------|--------|
| \`closed\` | Calendário fechado | Estado inicial | Input sem calendário visível |
| \`open\` | Calendário aberto | Ao focar ou clicar no input | Calendário visível |
| \`single\` | Modo data única | \`mode="single"\` ou padrão | Seleção de uma única data |
| \`range\` | Modo intervalo | \`mode="range"\` | Seleção de intervalo de datas |
| \`disabled\` | Desabilitado | \`disabled={true}\` | Date picker desabilitado |
| \`with-validation\` | Com validação | \`minDate\`/\`maxDate\` definidos | Date picker com validação de datas |
        `,
      },
    },
  },
  argTypes: {
    mode: {
      control: "select",
      options: ["single", "range"],
      description: "Selection mode: single date or date range",
    },
    placeholder: {
      control: "text",
      description: "Placeholder text for the input",
    },
    format: {
      control: "text",
      description: "Date format string (e.g., yyyy-MM-dd, MM/dd/yyyy)",
    },
    showCalendarButton: {
      control: "boolean",
      description: "Whether to show the calendar icon button",
    },
    minDate: {
      control: false,
      description: "Minimum selectable date",
    },
    maxDate: {
      control: false,
      description: "Maximum selectable date",
    },
    disabledDates: {
      control: false,
      description: "Array of dates that cannot be selected",
    },
    value: {
      control: false,
      description: "Selected date or range (controlled)",
    },
    defaultValue: {
      control: false,
      description: "Default selected date or range (uncontrolled)",
    },
    onValueChange: {
      action: "valueChanged",
      description: "Callback when date selection changes",
      category: "Events",
    },
  },
};

export default meta;
type Story = StoryObj<typeof DatePicker>;

export const Default: Story = {
  render: () => {
    const [date, setDate] = useState<Date | null>(null);
    return (
      <div className="p-8">
        <DatePicker
          value={date || undefined}
          onValueChange={(value) => setDate(value as Date | null)}
          placeholder="Select a date"
        />
        {date && (
          <p className="mt-4 text-sm text-fg-secondary">
            Selected: {date.toLocaleDateString()}
          </p>
        )}
      </div>
    );
  },
};

export const WithDefaultValue: Story = {
  render: () => {
    const [date, setDate] = useState<Date | null>(new Date());
    return (
      <div className="p-8">
        <DatePicker
          value={date || undefined}
          onValueChange={(value) => setDate(value as Date | null)}
          placeholder="Select a date"
        />
      </div>
    );
  },
};

export const DateRange: Story = {
  render: () => {
    const [range, setRange] = useState<{
      start: Date | null;
      end: Date | null;
    }>({
      start: null,
      end: null,
    });

    const calculateDays = () => {
      if (range.start && range.end) {
        const diffTime = Math.abs(range.end.getTime() - range.start.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
      }
      return 0;
    };

    return (
      <div className="p-8 space-y-4">
        <DatePicker
          mode="range"
          value={range}
          onValueChange={(value) =>
            setRange(value as { start: Date | null; end: Date | null })
          }
          placeholder="Select date range"
        />
        {range.start && range.end && (
          <div className="text-sm space-y-2 p-4 bg-info-bg border border-info rounded-lg">
            <p className="font-medium text-fg-info">Selected Range:</p>
            <p className="text-fg-info">
              <strong>Start:</strong> {range.start.toLocaleDateString()}
            </p>
            <p className="text-fg-info">
              <strong>End:</strong> {range.end.toLocaleDateString()}
            </p>
            <p className="text-fg-info">
              <strong>Duration:</strong> {calculateDays()} day(s)
            </p>
          </div>
        )}
        {range.start && !range.end && (
          <p className="text-sm text-fg-secondary">
            Start date selected: {range.start.toLocaleDateString()}. Select end
            date.
          </p>
        )}
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "Date range picker with real calculation. Select start and end dates to see the range and duration calculated.",
      },
    },
  },
};

export const WithMinMaxDate: Story = {
  render: () => {
    const [date, setDate] = useState<Date | null>(null);
    const [error, setError] = useState<string | null>(null);
    const today = new Date();
    const minDate = new Date(today.getFullYear(), today.getMonth(), 1);
    const maxDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    const handleChange = (value: Date | null) => {
      setDate(value);
      if (value) {
        if (value < minDate || value > maxDate) {
          setError(
            `Date must be between ${minDate.toLocaleDateString()} and ${maxDate.toLocaleDateString()}`,
          );
        } else {
          setError(null);
        }
      } else {
        setError(null);
      }
    };

    return (
      <div className="p-8 space-y-4">
        <DatePicker
          value={date || undefined}
          onValueChange={handleChange}
          minDate={minDate}
          maxDate={maxDate}
          placeholder="Select date this month"
        />
        {date && (
          <div className="text-sm space-y-2">
            <p className="text-fg-secondary">
              <strong>Selected:</strong> {date.toLocaleDateString()}
            </p>
            <p className="text-fg-tertiary">
              Valid range: {minDate.toLocaleDateString()} -{" "}
              {maxDate.toLocaleDateString()}
            </p>
            {error && <p className="text-fg-error">⚠ {error}</p>}
          </div>
        )}
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "Date picker with min/max date validation. Try selecting dates outside the range to see validation.",
      },
    },
  },
};

export const WithDisabledDates: Story = {
  render: () => {
    const [date, setDate] = useState<Date | null>(null);
    const today = new Date();
    const disabledDates = [
      new Date(today.getFullYear(), today.getMonth(), 5),
      new Date(today.getFullYear(), today.getMonth(), 10),
      new Date(today.getFullYear(), today.getMonth(), 15),
    ];

    const isDisabled = (selectedDate: Date | null) => {
      if (!selectedDate) return false;
      return disabledDates.some(
        (d) =>
          d.getDate() === selectedDate.getDate() &&
          d.getMonth() === selectedDate.getMonth() &&
          d.getFullYear() === selectedDate.getFullYear(),
      );
    };

    return (
      <div className="p-8 space-y-4">
        <DatePicker
          value={date || undefined}
          onValueChange={(value) => {
            const newDate = value as Date | null;
            if (newDate && !isDisabled(newDate)) {
              setDate(newDate);
            }
          }}
          disabledDates={disabledDates}
          placeholder="Select a date"
        />
        <div className="text-sm space-y-2">
          {date && (
            <p className="text-fg-secondary">
              <strong>Selected:</strong> {date.toLocaleDateString()}
            </p>
          )}
          <p className="text-fg-tertiary">
            <strong>Disabled dates:</strong>{" "}
            {disabledDates.map((d) => d.getDate()).join(", ")} of this month
          </p>
          {date && isDisabled(date) && (
            <p className="text-fg-error">⚠ This date is disabled!</p>
          )}
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "Date picker with disabled dates. Try selecting disabled dates (5th, 10th, 15th) to see them blocked.",
      },
    },
  },
};

export const CustomFormat: Story = {
  render: () => {
    const [date, setDate] = useState<Date | null>(null);
    return (
      <div className="p-8">
        <DatePicker
          value={date || undefined}
          onValueChange={(value) => setDate(value as Date | null)}
          format="MM/dd/yyyy"
          placeholder="MM/DD/YYYY"
        />
      </div>
    );
  },
};

export const CompoundComponents: Story = {
  render: () => {
    const [date, setDate] = useState<Date | null>(null);
    return (
      <div className="p-8">
        <DatePicker
          value={date || undefined}
          onValueChange={(value) => setDate(value as Date | null)}
        >
          <DatePicker.Input placeholder="Select date" />
          <DatePicker.Popup>
            <DatePicker.Calendar />
          </DatePicker.Popup>
        </DatePicker>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: "Using compound components API for maximum flexibility.",
      },
    },
  },
};

export const DateRangeWithValidation: Story = {
  render: () => {
    const [range, setRange] = useState<{
      start: Date | null;
      end: Date | null;
    }>({
      start: null,
      end: null,
    });
    const [error, setError] = useState<string | null>(null);

    const today = new Date();
    const minDate = new Date(today);
    minDate.setDate(today.getDate() + 1); // Tomorrow
    const maxDate = new Date(today);
    maxDate.setMonth(today.getMonth() + 3); // 3 months from now

    const handleChange = (
      value: { start: Date | null; end: Date | null } | null,
    ) => {
      if (!value) {
        setRange({ start: null, end: null });
        setError(null);
        return;
      }

      const newRange = value as { start: Date | null; end: Date | null };

      // Validate range
      if (newRange.start && newRange.end) {
        if (newRange.start > newRange.end) {
          setError("Start date must be before end date");
          return;
        }
        if (newRange.start < minDate || newRange.end > maxDate) {
          setError(
            `Dates must be between ${minDate.toLocaleDateString()} and ${maxDate.toLocaleDateString()}`,
          );
          return;
        }
        setError(null);
      }

      setRange(newRange);
    };

    const calculateDays = () => {
      if (range.start && range.end) {
        const diffTime = Math.abs(range.end.getTime() - range.start.getTime());
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include both start and end
      }
      return 0;
    };

    return (
      <div className="p-8 space-y-4">
        <DatePicker
          mode="range"
          value={range}
          onValueChange={handleChange}
          minDate={minDate}
          maxDate={maxDate}
          placeholder="Select date range"
        />
        {error && (
          <div className="p-3 bg-error-bg border border-error rounded text-sm text-fg-error">
            ⚠ {error}
          </div>
        )}
        {range.start && range.end && !error && (
          <div className="p-4 bg-success-bg border border-success rounded-lg space-y-2">
            <p className="font-medium text-fg-success">Valid Range Selected:</p>
            <p className="text-fg-success">
              <strong>Start:</strong> {range.start.toLocaleDateString()}
            </p>
            <p className="text-fg-success">
              <strong>End:</strong> {range.end.toLocaleDateString()}
            </p>
            <p className="text-fg-success">
              <strong>Duration:</strong> {calculateDays()} day(s)
            </p>
          </div>
        )}
        <div className="text-sm text-fg-secondary">
          <p>
            <strong>Valid range:</strong> {minDate.toLocaleDateString()} -{" "}
            {maxDate.toLocaleDateString()}
          </p>
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "Date range picker with validation. Start date must be before end date, and both must be within the valid range.",
      },
    },
  },
};

export const KeyboardNavigation: Story = {
  render: () => {
    const [date, setDate] = useState<Date | null>(null);

    return (
      <div className="p-8 space-y-4">
        <DatePicker
          value={date || undefined}
          onValueChange={(value) => setDate(value as Date | null)}
          placeholder="Try keyboard navigation..."
        />
        {date && (
          <p className="text-sm text-fg-secondary">
            Selected: {date.toLocaleDateString()}
          </p>
        )}
        <div className="text-sm text-fg-secondary space-y-2 p-4 bg-surface-subtle rounded">
          <p>
            <strong>Keyboard Navigation:</strong>
          </p>
          <ul className="list-disc list-inside space-y-1">
            <li>Tab to focus the input</li>
            <li>Type date or use arrow keys when calendar is open</li>
            <li>Arrow keys to navigate calendar</li>
            <li>Enter to select highlighted date</li>
            <li>Escape to close calendar</li>
            <li>Page Up/Down to change month</li>
          </ul>
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "Demonstrates keyboard navigation. Use Tab to focus, then navigate the calendar with arrow keys.",
      },
    },
  },
};

export const Uncontrolled: Story = {
  render: () => {
    const today = new Date();
    return (
      <div className="p-8 space-y-4">
        <DatePicker
          defaultValue={today}
          placeholder="Uncontrolled date picker"
        />
        <p className="text-sm text-fg-secondary">
          Uses defaultValue for initial value without state management.
        </p>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: "Demonstrates uncontrolled date picker using defaultValue.",
      },
    },
  },
};

// Event Stories
export const WithEvents: Story = {
  render: () => {
    const [date, setDate] = useState<Date | null>(null);
    const handleValueChange = fn((value: Date | null) => {
      setDate(value);
    });

    return (
      <div className="p-8 space-y-4">
        <p className="text-sm text-fg-secondary">
          Select a date. Check the Actions panel to see events being fired.
        </p>
        <DatePicker
          value={date || undefined}
          onValueChange={handleValueChange}
          placeholder="Select a date"
        />
        {date && (
          <p className="text-sm text-fg-tertiary">
            Selected: {date.toLocaleDateString()}
          </p>
        )}
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByPlaceholderText("Select a date");
    await userEvent.click(input);
    await waitFor(() => {
      expect(input).toHaveFocus();
    });
  },
  parameters: {
    docs: {
      description: {
        story:
          "Demonstrates date picker events. Select a date and check the Actions panel to see events being logged.",
      },
    },
  },
};

// State Stories
export const ClosedState: Story = {
  args: {
    placeholder: "Click to open calendar...",
  },
  parameters: {
    docs: {
      description: {
        story: "Closed state - calendar is not visible.",
      },
    },
  },
};

export const OpenState: Story = {
  render: () => {
    const [date, setDate] = useState<Date | null>(null);
    return (
      <div className="p-8">
        <DatePicker
          value={date || undefined}
          onValueChange={(value) => setDate(value as Date | null)}
          placeholder="Focus to open calendar..."
        />
        <p className="text-xs text-fg-tertiary mt-2">
          Focus the input to see the open state
        </p>
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByPlaceholderText("Focus to open calendar...");
    await userEvent.click(input);
    await waitFor(() => {
      expect(input).toHaveFocus();
    });
  },
  parameters: {
    docs: {
      description: {
        story: "Open state - calendar is visible.",
      },
    },
  },
};

export const SingleModeState: Story = {
  render: () => {
    const [date, setDate] = useState<Date | null>(null);
    return (
      <div className="p-8">
        <DatePicker
          mode="single"
          value={date || undefined}
          onValueChange={(value) => setDate(value as Date | null)}
          placeholder="Select a date"
        />
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: "Single mode state - allows selection of a single date.",
      },
    },
  },
};

export const RangeModeState: Story = {
  render: () => {
    const [range, setRange] = useState<{
      start: Date | null;
      end: Date | null;
    }>({
      start: null,
      end: null,
    });

    return (
      <div className="p-8">
        <DatePicker
          mode="range"
          value={range}
          onValueChange={(value) =>
            setRange(value as { start: Date | null; end: Date | null })
          }
          placeholder="Select date range"
        />
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: "Range mode state - allows selection of a date range.",
      },
    },
  },
};
