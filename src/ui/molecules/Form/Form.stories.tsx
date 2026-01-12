import type { Meta, StoryObj } from "@storybook/react";
import Form from "./Form";
import { Input, Label, Button, Textarea, Select, ErrorMessage } from "../../atoms";

const meta: Meta<typeof Form> = {
  title: "Molecules/Form",
  component: Form,
  parameters: {
    docs: {
      description: {
        component: "A wrapper component for forms with validation states, error/success messages, and layout.",
      },
    },
  },
  argTypes: {
    loading: {
      control: "boolean",
      description: "Whether the form is in a loading state",
    },
    error: {
      control: "text",
      description: "Global error message to display",
    },
    success: {
      control: "text",
      description: "Success message to display",
    },
  },
};

export const Default: StoryObj<typeof Form> = {
  args: {
    onSubmit: (e) => {
      e.preventDefault();
      alert("Form submitted!");
    },
  },
  render: (args) => (
    <Form {...args} className="max-w-md">
      <div className="space-y-2">
        <Label htmlFor="name" variant="required">
          Name
        </Label>
        <Input id="name" name="name" placeholder="Enter your name" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email" variant="required">
          Email
        </Label>
        <Input id="email" name="email" type="email" placeholder="Enter your email" required />
      </div>
      <Button type="submit" variant="regular">
        Submit
      </Button>
    </Form>
  ),
};

export const WithError: StoryObj<typeof Form> = {
  args: {
    error: "Please fix the errors below and try again.",
    onSubmit: (e) => {
      e.preventDefault();
    },
  },
  render: (args) => (
    <Form {...args} className="max-w-md">
      <div className="space-y-2">
        <Label htmlFor="email" variant="required">
          Email
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          aria-invalid="true"
          aria-describedby="email-error"
        />
        <ErrorMessage message="Please enter a valid email address" id="email-error" />
      </div>
      <Button type="submit" variant="regular">
        Submit
      </Button>
    </Form>
  ),
};

export const WithSuccess: StoryObj<typeof Form> = {
  args: {
    success: "Form submitted successfully!",
    onSubmit: (e) => {
      e.preventDefault();
    },
  },
  render: (args) => (
    <Form {...args} className="max-w-md">
      <div className="space-y-2">
        <Label htmlFor="name" variant="required">
          Name
        </Label>
        <Input id="name" name="name" />
      </div>
      <Button type="submit" variant="regular">
        Submit
      </Button>
    </Form>
  ),
};

export const Loading: StoryObj<typeof Form> = {
  args: {
    loading: true,
    onSubmit: (e) => {
      e.preventDefault();
    },
  },
  render: (args) => (
    <Form {...args} className="max-w-md">
      <div className="space-y-2">
        <Label htmlFor="name" variant="required">
          Name
        </Label>
        <Input id="name" name="name" disabled />
      </div>
      <Button type="submit" variant="regular" disabled>
        Submitting...
      </Button>
    </Form>
  ),
};

export const CompleteForm: StoryObj<typeof Form> = {
  args: {
    onSubmit: (e) => {
      e.preventDefault();
      alert("Form submitted!");
    },
  },
  render: (args) => (
    <Form {...args} className="max-w-md space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title" variant="required">
          Title
        </Label>
        <Input id="title" name="title" placeholder="Enter title" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description" variant="required">
          Description
        </Label>
        <Textarea id="description" name="description" rows={4} placeholder="Enter description" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="status" variant="required">
          Status
        </Label>
        <Select
          id="status"
          name="status"
          options={[
            { value: "DRAFT", label: "Draft" },
            { value: "ACTIVE", label: "Active" },
            { value: "COMPLETED", label: "Completed" },
          ]}
          placeholder="Select status"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="priority" variant="optional">
          Priority
        </Label>
        <Select
          id="priority"
          name="priority"
          options={[
            { value: "LOW", label: "Low" },
            { value: "MEDIUM", label: "Medium" },
            { value: "HIGH", label: "High" },
          ]}
          placeholder="Select priority"
        />
      </div>
      <div className="flex gap-2">
        <Button type="submit" variant="regular">
          Submit
        </Button>
        <Button type="button" variant="secondary">
          Cancel
        </Button>
      </div>
    </Form>
  ),
};

export const RegistrationForm: StoryObj<typeof Form> = {
  args: {
    onSubmit: (e) => {
      e.preventDefault();
      alert("Registration submitted!");
    },
  },
  render: (args) => (
    <Form {...args} className="max-w-lg space-y-4">
      <div className="space-y-2">
        <Label htmlFor="firstName" variant="required">
          First Name
        </Label>
        <Input id="firstName" name="firstName" placeholder="John" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="lastName" variant="required">
          Last Name
        </Label>
        <Input id="lastName" name="lastName" placeholder="Doe" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email" variant="required">
          Email
        </Label>
        <Input id="email" name="email" type="email" placeholder="john.doe@example.com" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password" variant="required">
          Password
        </Label>
        <Input id="password" name="password" type="password" placeholder="Enter password" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="country" variant="optional">
          Country
        </Label>
        <Select
          id="country"
          name="country"
          options={[
            { value: "US", label: "United States" },
            { value: "BR", label: "Brazil" },
            { value: "UK", label: "United Kingdom" },
          ]}
          placeholder="Select country"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="bio" variant="optional">
          Bio
        </Label>
        <Textarea id="bio" name="bio" rows={4} placeholder="Tell us about yourself" />
      </div>
      <div className="flex gap-2">
        <Button type="submit" variant="regular">
          Register
        </Button>
        <Button type="button" variant="secondary">
          Cancel
        </Button>
      </div>
    </Form>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Complete registration form showing multiple form fields working together.',
      },
    },
  },
};

export const ContactForm: StoryObj<typeof Form> = {
  args: {
    onSubmit: (e) => {
      e.preventDefault();
      alert("Message sent!");
    },
  },
  render: (args) => (
    <Form {...args} className="max-w-md space-y-4">
      <div className="space-y-2">
        <Label htmlFor="contactName" variant="required">
          Name
        </Label>
        <Input id="contactName" name="name" placeholder="Your name" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="contactEmail" variant="required">
          Email
        </Label>
        <Input id="contactEmail" name="email" type="email" placeholder="your.email@example.com" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="subject" variant="required">
          Subject
        </Label>
        <Input id="subject" name="subject" placeholder="Message subject" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="message" variant="required">
          Message
        </Label>
        <Textarea id="message" name="message" rows={6} placeholder="Your message" required />
      </div>
      <Button type="submit" variant="regular" fullWidth>
        Send Message
      </Button>
    </Form>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Contact form example showing a real-world use case.',
      },
    },
  },
};

export default meta;
