import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { expect, userEvent, within, waitFor } from "storybook/test";
import { useState } from "react";
import { useForm } from "react-hook-form";
import Form from "./Form";
import { FormField } from "./FormField";
import {
  Input,
  Label,
  Button,
  Textarea,
  Select,
  ErrorMessage,
} from "../../primitives";

const meta: Meta<typeof Form> = {
  title: "Components/Form",
  component: Form,
  parameters: {
    docs: {
      description: {
        component: `
## Form

A wrapper component for forms with validation states, error/success messages, and layout.

### Events

| Event | Description | Parameters | When Fired |
|-------|-------------|------------|------------|
| \`onSubmit\` | Formulário submetido | \`(event: FormEvent<HTMLFormElement>) => void\` | Quando o formulário é submetido |

### States

| State | Description | How to Activate | Visual |
|-------|-------------|-----------------|--------|
| \`default\` | Estado padrão | Estado inicial | Formulário normal |
| \`loading\` | Carregando | \`loading={true}\` | Indicador de loading visível |
| \`error\` | Com erro | \`error\` prop definida | Mensagem de erro visível |
| \`success\` | Com sucesso | \`success\` prop definida | Mensagem de sucesso visível |
        `,
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
  render: () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setName("");
        setEmail("");
      }, 2000);
    };

    return (
      <div className="space-y-4">
        <Form
          onSubmit={handleSubmit}
          className="max-w-md"
          success={submitted ? "Form submitted successfully!" : null}
        >
          <div className="space-y-2">
            <Label htmlFor="name" variant="required">
              Name
            </Label>
            <Input
              id="name"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" variant="required">
              Email
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>
          <Button type="submit" variant="regular">
            Submit
          </Button>
        </Form>
        {submitted && (
          <div className="max-w-md text-sm text-gray-600">
            Form data: {JSON.stringify({ name, email })}
          </div>
        )}
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "Interactive form with real state management. Fill in the fields and submit to see the success message.",
      },
    },
  },
};

export const WithError: StoryObj<typeof Form> = {
  render: () => {
    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState("");
    const [formError, setFormError] = useState("");

    const validateEmail = (value: string) => {
      if (!value) {
        setEmailError("Email is required");
        return false;
      }
      if (!value.includes("@")) {
        setEmailError("Please enter a valid email address");
        return false;
      }
      setEmailError("");
      return true;
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!validateEmail(email)) {
        setFormError("Please fix the errors below and try again.");
        return;
      }
      setFormError("");
      alert("Form submitted successfully!");
    };

    return (
      <Form
        onSubmit={handleSubmit}
        className="max-w-md"
        error={formError || null}
      >
        <div className="space-y-2">
          <Label htmlFor="email" variant="required">
            Email
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (emailError) validateEmail(e.target.value);
            }}
            onBlur={() => validateEmail(email)}
            error={!!emailError}
            aria-invalid={!!emailError}
            aria-describedby={emailError ? "email-error" : undefined}
          />
          {emailError && <ErrorMessage message={emailError} id="email-error" />}
        </div>
        <Button type="submit" variant="regular">
          Submit
        </Button>
      </Form>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "Form with real-time validation. Try submitting with an invalid email to see validation errors.",
      },
    },
  },
};

export const WithSuccess: StoryObj<typeof Form> = {
  render: () => {
    const [name, setName] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [success, setSuccess] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setIsSubmitting(true);
      setSuccess(null);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setIsSubmitting(false);
      setSuccess("Form submitted successfully!");
      setName("");

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    };

    return (
      <Form
        onSubmit={handleSubmit}
        className="max-w-md"
        loading={isSubmitting}
        success={success}
      >
        <div className="space-y-2">
          <Label htmlFor="name" variant="required">
            Name
          </Label>
          <Input
            id="name"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isSubmitting}
          />
        </div>
        <Button type="submit" variant="regular" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit"}
        </Button>
      </Form>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "Form with loading state and success message. Submit the form to see the loading state and then the success message.",
      },
    },
  },
};

export const Loading: StoryObj<typeof Form> = {
  render: () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [name, setName] = useState("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setIsSubmitting(true);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setIsSubmitting(false);
      alert("Form submitted!");
    };

    return (
      <Form onSubmit={handleSubmit} className="max-w-md" loading={isSubmitting}>
        <div className="space-y-2">
          <Label htmlFor="name" variant="required">
            Name
          </Label>
          <Input
            id="name"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isSubmitting}
          />
        </div>
        <Button type="submit" variant="regular" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit"}
        </Button>
      </Form>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "Form with real loading state. Submit the form to see the loading state in action.",
      },
    },
  },
};

export const CompleteForm: StoryObj<typeof Form> = {
  render: () => {
    const [formData, setFormData] = useState({
      title: "",
      description: "",
      status: "",
      priority: "",
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [success, setSuccess] = useState<string | null>(null);

    const validate = () => {
      const newErrors: Record<string, string> = {};
      if (!formData.title) newErrors.title = "Title is required";
      if (!formData.description)
        newErrors.description = "Description is required";
      if (!formData.status) newErrors.status = "Status is required";
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!validate()) return;

      setIsSubmitting(true);
      setSuccess(null);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setIsSubmitting(false);
      setSuccess("Task created successfully!");

      // Reset form after 2 seconds
      setTimeout(() => {
        setFormData({ title: "", description: "", status: "", priority: "" });
        setSuccess(null);
      }, 2000);
    };

    return (
      <div className="space-y-4">
        <Form
          onSubmit={handleSubmit}
          className="max-w-md space-y-4"
          loading={isSubmitting}
          success={success}
          error={
            Object.keys(errors).length > 0
              ? "Please fix the errors below"
              : null
          }
        >
          <div className="space-y-2">
            <Label htmlFor="title" variant="required">
              Title
            </Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={(e) => {
                setFormData({ ...formData, title: e.target.value });
                if (errors.title) setErrors({ ...errors, title: "" });
              }}
              placeholder="Enter title"
              error={!!errors.title}
              disabled={isSubmitting}
            />
            {errors.title && <ErrorMessage message={errors.title} />}
          </div>
          <div className="space-y-2">
            <Label htmlFor="description" variant="required">
              Description
            </Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={(e) => {
                setFormData({ ...formData, description: e.target.value });
                if (errors.description)
                  setErrors({ ...errors, description: "" });
              }}
              rows={4}
              placeholder="Enter description"
              error={!!errors.description}
              disabled={isSubmitting}
            />
            {errors.description && (
              <ErrorMessage message={errors.description} />
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="status" variant="required">
              Status
            </Label>
            <Select
              id="status"
              name="status"
              value={formData.status}
              onChange={(e) => {
                setFormData({ ...formData, status: e.target.value });
                if (errors.status) setErrors({ ...errors, status: "" });
              }}
              options={[
                { value: "DRAFT", label: "Draft" },
                { value: "ACTIVE", label: "Active" },
                { value: "COMPLETED", label: "Completed" },
              ]}
              placeholder="Select status"
              error={!!errors.status}
              disabled={isSubmitting}
            />
            {errors.status && <ErrorMessage message={errors.status} />}
          </div>
          <div className="space-y-2">
            <Label htmlFor="priority" variant="optional">
              Priority
            </Label>
            <Select
              id="priority"
              name="priority"
              value={formData.priority}
              onChange={(e) =>
                setFormData({ ...formData, priority: e.target.value })
              }
              options={[
                { value: "LOW", label: "Low" },
                { value: "MEDIUM", label: "Medium" },
                { value: "HIGH", label: "High" },
              ]}
              placeholder="Select priority"
              disabled={isSubmitting}
            />
          </div>
          <div className="flex gap-2">
            <Button type="submit" variant="regular" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Task"}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setFormData({
                  title: "",
                  description: "",
                  status: "",
                  priority: "",
                });
                setErrors({});
              }}
              disabled={isSubmitting}
            >
              Reset
            </Button>
          </div>
        </Form>
        {Object.keys(formData).some(
          (key) => formData[key as keyof typeof formData],
        ) && (
          <div className="max-w-md text-sm text-gray-600 p-4 bg-gray-50 rounded">
            <strong>Form Data:</strong>
            <pre className="mt-2 text-xs">
              {JSON.stringify(formData, null, 2)}
            </pre>
          </div>
        )}
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "Complete form with real validation, loading state, and success message. Try submitting with empty fields to see validation errors.",
      },
    },
  },
};

export const RegistrationForm: StoryObj<typeof Form> = {
  render: () => {
    const [formData, setFormData] = useState({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      country: "",
      bio: "",
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [success, setSuccess] = useState<string | null>(null);

    const validate = () => {
      const newErrors: Record<string, string> = {};
      if (!formData.firstName) newErrors.firstName = "First name is required";
      if (!formData.lastName) newErrors.lastName = "Last name is required";
      if (!formData.email) {
        newErrors.email = "Email is required";
      } else if (!formData.email.includes("@")) {
        newErrors.email = "Please enter a valid email";
      }
      if (!formData.password) {
        newErrors.password = "Password is required";
      } else if (formData.password.length < 8) {
        newErrors.password = "Password must be at least 8 characters";
      }
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!validate()) return;

      setIsSubmitting(true);
      setSuccess(null);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setIsSubmitting(false);
      setSuccess("Registration successful! Welcome!");

      // Reset form after 3 seconds
      setTimeout(() => {
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          password: "",
          country: "",
          bio: "",
        });
        setSuccess(null);
      }, 3000);
    };

    return (
      <Form
        onSubmit={handleSubmit}
        className="max-w-lg space-y-4"
        loading={isSubmitting}
        success={success}
        error={
          Object.keys(errors).length > 0 ? "Please fix the errors below" : null
        }
      >
        <div className="space-y-2">
          <Label htmlFor="firstName" variant="required">
            First Name
          </Label>
          <Input
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={(e) => {
              setFormData({ ...formData, firstName: e.target.value });
              if (errors.firstName) setErrors({ ...errors, firstName: "" });
            }}
            placeholder="John"
            error={!!errors.firstName}
            disabled={isSubmitting}
          />
          {errors.firstName && <ErrorMessage message={errors.firstName} />}
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName" variant="required">
            Last Name
          </Label>
          <Input
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={(e) => {
              setFormData({ ...formData, lastName: e.target.value });
              if (errors.lastName) setErrors({ ...errors, lastName: "" });
            }}
            placeholder="Doe"
            error={!!errors.lastName}
            disabled={isSubmitting}
          />
          {errors.lastName && <ErrorMessage message={errors.lastName} />}
        </div>
        <div className="space-y-2">
          <Label htmlFor="email" variant="required">
            Email
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={(e) => {
              setFormData({ ...formData, email: e.target.value });
              if (errors.email) setErrors({ ...errors, email: "" });
            }}
            placeholder="john.doe@example.com"
            error={!!errors.email}
            disabled={isSubmitting}
          />
          {errors.email && <ErrorMessage message={errors.email} />}
        </div>
        <div className="space-y-2">
          <Label htmlFor="password" variant="required">
            Password
          </Label>
          <Input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={(e) => {
              setFormData({ ...formData, password: e.target.value });
              if (errors.password) setErrors({ ...errors, password: "" });
            }}
            placeholder="Enter password (min 8 characters)"
            error={!!errors.password}
            disabled={isSubmitting}
          />
          {errors.password && <ErrorMessage message={errors.password} />}
        </div>
        <div className="space-y-2">
          <Label htmlFor="country" variant="optional">
            Country
          </Label>
          <Select
            id="country"
            name="country"
            value={formData.country}
            onChange={(e) =>
              setFormData({ ...formData, country: e.target.value })
            }
            options={[
              { value: "US", label: "United States" },
              { value: "BR", label: "Brazil" },
              { value: "UK", label: "United Kingdom" },
            ]}
            placeholder="Select country"
            disabled={isSubmitting}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="bio" variant="optional">
            Bio
          </Label>
          <Textarea
            id="bio"
            name="bio"
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            rows={4}
            placeholder="Tell us about yourself"
            disabled={isSubmitting}
          />
        </div>
        <div className="flex gap-2">
          <Button type="submit" variant="regular" disabled={isSubmitting}>
            {isSubmitting ? "Registering..." : "Register"}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => {
              setFormData({
                firstName: "",
                lastName: "",
                email: "",
                password: "",
                country: "",
                bio: "",
              });
              setErrors({});
            }}
            disabled={isSubmitting}
          >
            Clear
          </Button>
        </div>
      </Form>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "Complete registration form with real validation. Try submitting with invalid data to see validation errors, or fill all required fields to see success.",
      },
    },
  },
};

export const ContactForm: StoryObj<typeof Form> = {
  render: () => {
    const [formData, setFormData] = useState({
      name: "",
      email: "",
      subject: "",
      message: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [success, setSuccess] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setIsSubmitting(true);
      setSuccess(null);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setIsSubmitting(false);
      setSuccess("Message sent successfully! We'll get back to you soon.");

      // Reset form after 3 seconds
      setTimeout(() => {
        setFormData({ name: "", email: "", subject: "", message: "" });
        setSuccess(null);
      }, 3000);
    };

    return (
      <Form
        onSubmit={handleSubmit}
        className="max-w-md space-y-4"
        loading={isSubmitting}
        success={success}
      >
        <div className="space-y-2">
          <Label htmlFor="contactName" variant="required">
            Name
          </Label>
          <Input
            id="contactName"
            name="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Your name"
            disabled={isSubmitting}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="contactEmail" variant="required">
            Email
          </Label>
          <Input
            id="contactEmail"
            name="email"
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            placeholder="your.email@example.com"
            disabled={isSubmitting}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="subject" variant="required">
            Subject
          </Label>
          <Input
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={(e) =>
              setFormData({ ...formData, subject: e.target.value })
            }
            placeholder="Message subject"
            disabled={isSubmitting}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="message" variant="required">
            Message
          </Label>
          <Textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={(e) =>
              setFormData({ ...formData, message: e.target.value })
            }
            rows={6}
            placeholder="Your message"
            disabled={isSubmitting}
            required
          />
        </div>
        <Button
          type="submit"
          variant="regular"
          fullWidth
          disabled={isSubmitting}
        >
          {isSubmitting ? "Sending..." : "Send Message"}
        </Button>
      </Form>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "Contact form with real submission flow. Fill in the form and submit to see the loading state and success message.",
      },
    },
  },
};

export const MultipleErrors: StoryObj<typeof Form> = {
  render: () => {
    const [formData, setFormData] = useState({
      name: "",
      email: "",
      phone: "",
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [touched, setTouched] = useState<Record<string, boolean>>({});

    const validate = () => {
      const newErrors: Record<string, string> = {};
      if (!formData.name) newErrors.name = "Name is required";
      if (!formData.email) {
        newErrors.email = "Email is required";
      } else if (!formData.email.includes("@")) {
        newErrors.email = "Please enter a valid email";
      }
      if (!formData.phone) {
        newErrors.phone = "Phone is required";
      } else if (!/^\d{10,}$/.test(formData.phone.replace(/\D/g, ""))) {
        newErrors.phone = "Please enter a valid phone number";
      }
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (validate()) {
        alert("Form is valid! Data: " + JSON.stringify(formData));
      }
    };

    const handleBlur = (field: string) => {
      setTouched({ ...touched, [field]: true });
      validate();
    };

    return (
      <Form
        onSubmit={handleSubmit}
        className="max-w-md"
        error={
          Object.keys(errors).length > 0 &&
          Object.values(touched).some((t) => t)
            ? "Please fix all errors below"
            : null
        }
      >
        <div className="space-y-2">
          <Label htmlFor="name" variant="required">
            Name
          </Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={(e) => {
              setFormData({ ...formData, name: e.target.value });
              if (errors.name && touched.name)
                setErrors({ ...errors, name: "" });
            }}
            onBlur={() => handleBlur("name")}
            error={!!errors.name && touched.name}
          />
          {errors.name && touched.name && (
            <ErrorMessage message={errors.name} />
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="email" variant="required">
            Email
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={(e) => {
              setFormData({ ...formData, email: e.target.value });
              if (errors.email && touched.email)
                setErrors({ ...errors, email: "" });
            }}
            onBlur={() => handleBlur("email")}
            error={!!errors.email && touched.email}
          />
          {errors.email && touched.email && (
            <ErrorMessage message={errors.email} />
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone" variant="required">
            Phone
          </Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => {
              setFormData({ ...formData, phone: e.target.value });
              if (errors.phone && touched.phone)
                setErrors({ ...errors, phone: "" });
            }}
            onBlur={() => handleBlur("phone")}
            error={!!errors.phone && touched.phone}
            placeholder="(123) 456-7890"
          />
          {errors.phone && touched.phone && (
            <ErrorMessage message={errors.phone} />
          )}
        </div>
        <Button type="submit" variant="regular">
          Submit
        </Button>
      </Form>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "Form with multiple validation errors. Try submitting with empty fields or invalid data to see all validation errors at once.",
      },
    },
  },
};

export const Accessibility: StoryObj<typeof Form> = {
  render: () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState("");

    const validateEmail = (value: string) => {
      if (!value) {
        setEmailError("Email is required");
        return false;
      }
      if (!value.includes("@")) {
        setEmailError("Please enter a valid email address");
        return false;
      }
      setEmailError("");
      return true;
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (validateEmail(email)) {
        alert(
          "Form submitted! Try using keyboard navigation: Tab to navigate, Enter to submit.",
        );
      }
    };

    return (
      <div className="space-y-4">
        <Form onSubmit={handleSubmit} className="max-w-md">
          <div className="space-y-2">
            <Label htmlFor="acc-name" variant="required">
              Name
            </Label>
            <Input
              id="acc-name"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="acc-email" variant="required">
              Email
            </Label>
            <Input
              id="acc-email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (emailError) validateEmail(e.target.value);
              }}
              onBlur={() => validateEmail(email)}
              error={!!emailError}
              aria-invalid={!!emailError}
              aria-describedby={emailError ? "acc-email-error" : undefined}
              placeholder="Enter your email"
              required
            />
            {emailError && (
              <ErrorMessage message={emailError} id="acc-email-error" />
            )}
          </div>
          <Button type="submit" variant="regular">
            Submit
          </Button>
        </Form>
        <div className="max-w-md text-sm text-gray-600 space-y-2 p-4 bg-gray-50 rounded">
          <p>
            <strong>Accessibility Features:</strong>
          </p>
          <ul className="list-disc list-inside space-y-1">
            <li>Tab navigation between fields</li>
            <li>Enter key to submit form</li>
            <li>ARIA attributes for error states</li>
            <li>Labels properly associated with inputs</li>
            <li>Error messages announced by screen readers</li>
          </ul>
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "Form demonstrating accessibility features. Try keyboard navigation (Tab to move, Enter to submit) and screen reader compatibility.",
      },
    },
  },
};

export const WithReactHookForm: StoryObj<typeof Form> = {
  render: () => {
    type FormData = {
      name: string;
      email: string;
      message: string;
    };

    const form = useForm<FormData>({
      defaultValues: {
        name: "",
        email: "",
        message: "",
      },
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [success, setSuccess] = useState<string | null>(null);

    const onSubmit = async (data: FormData) => {
      setIsSubmitting(true);
      setSuccess(null);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setIsSubmitting(false);
      setSuccess(`Form submitted! Data: ${JSON.stringify(data)}`);

      // Reset form after 3 seconds
      setTimeout(() => {
        form.reset();
        setSuccess(null);
      }, 3000);
    };

    return (
      <div className="space-y-4">
        <Form
          form={form}
          onSubmit={onSubmit}
          loading={isSubmitting}
          success={success}
          className="max-w-md"
        >
          <FormField<FormData>
            name="name"
            label="Name"
            rules={{ required: "Name is required" }}
          >
            {({ register, error }) => (
              <>
                <Input
                  id="name"
                  {...register("name")}
                  error={!!error}
                  helperText={error}
                  disabled={isSubmitting}
                />
              </>
            )}
          </FormField>

          <FormField<FormData>
            name="email"
            label="Email"
            rules={{
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address",
              },
            }}
          >
            {({ register, error }) => (
              <>
                <Input
                  id="email"
                  type="email"
                  {...register("email")}
                  error={!!error}
                  helperText={error}
                  disabled={isSubmitting}
                />
              </>
            )}
          </FormField>

          <FormField<FormData>
            name="message"
            label="Message"
            rules={{
              required: "Message is required",
              minLength: {
                value: 10,
                message: "Message must be at least 10 characters",
              },
            }}
          >
            {({ register, error }) => (
              <>
                <Textarea
                  id="message"
                  {...register("message")}
                  error={!!error}
                  rows={4}
                  disabled={isSubmitting}
                />
                {error && <ErrorMessage message={error} />}
              </>
            )}
          </FormField>

          <Button type="submit" variant="primary" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        </Form>
        <div className="max-w-md text-sm text-gray-600 p-4 bg-gray-50 rounded">
          <strong>Form Values:</strong>
          <pre className="mt-2 text-xs">
            {JSON.stringify(form.watch(), null, 2)}
          </pre>
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "Form with react-hook-form integration. Demonstrates validation rules, error handling, and form state management.",
      },
    },
  },
};

export const ReactHookFormWithComplexValidation: StoryObj<typeof Form> = {
  render: () => {
    type RegistrationData = {
      firstName: string;
      lastName: string;
      email: string;
      password: string;
      confirmPassword: string;
      age: string;
    };

    const form = useForm<RegistrationData>({
      defaultValues: {
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
        age: "",
      },
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [success, setSuccess] = useState<string | null>(null);

    const password = form.watch("password");

    const onSubmit = async (_data: RegistrationData) => {
      setIsSubmitting(true);
      setSuccess(null);

      await new Promise((resolve) => setTimeout(resolve, 2000));

      setIsSubmitting(false);
      setSuccess("Registration successful!");

      setTimeout(() => {
        form.reset();
        setSuccess(null);
      }, 3000);
    };

    return (
      <div className="space-y-4">
        <Form
          form={form}
          onSubmit={onSubmit}
          loading={isSubmitting}
          success={success}
          className="max-w-md"
        >
          <FormField<RegistrationData>
            name="firstName"
            label="First Name"
            rules={{ required: "First name is required" }}
          >
            {({ register, error }) => (
              <Input
                id="firstName"
                {...register("firstName")}
                error={!!error}
                helperText={error}
                disabled={isSubmitting}
              />
            )}
          </FormField>

          <FormField<RegistrationData>
            name="lastName"
            label="Last Name"
            rules={{ required: "Last name is required" }}
          >
            {({ register, error }) => (
              <Input
                id="lastName"
                {...register("lastName")}
                error={!!error}
                helperText={error}
                disabled={isSubmitting}
              />
            )}
          </FormField>

          <FormField<RegistrationData>
            name="email"
            label="Email"
            rules={{
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address",
              },
            }}
          >
            {({ register, error }) => (
              <Input
                id="email"
                type="email"
                {...register("email")}
                error={!!error}
                helperText={error}
                disabled={isSubmitting}
              />
            )}
          </FormField>

          <FormField<RegistrationData>
            name="age"
            label="Age"
            rules={{
              required: "Age is required",
              min: { value: 18, message: "Must be at least 18 years old" },
              max: { value: 120, message: "Invalid age" },
              valueAsNumber: true,
            }}
          >
            {({ register, error }) => (
              <Input
                id="age"
                type="number"
                {...register("age", { valueAsNumber: true })}
                error={!!error}
                helperText={error}
                disabled={isSubmitting}
              />
            )}
          </FormField>

          <FormField<RegistrationData>
            name="password"
            label="Password"
            rules={{
              required: "Password is required",
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters",
              },
              pattern: {
                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                message:
                  "Password must contain uppercase, lowercase, and number",
              },
            }}
          >
            {({ register, error }) => (
              <Input
                id="password"
                type="password"
                {...register("password")}
                error={!!error}
                helperText={error}
                disabled={isSubmitting}
              />
            )}
          </FormField>

          <FormField<RegistrationData>
            name="confirmPassword"
            label="Confirm Password"
            rules={{
              required: "Please confirm your password",
              validate: (value) =>
                value === password || "Passwords do not match",
            }}
          >
            {({ register, error }) => (
              <Input
                id="confirmPassword"
                type="password"
                {...register("confirmPassword")}
                error={!!error}
                helperText={error}
                disabled={isSubmitting}
              />
            )}
          </FormField>

          <Button type="submit" variant="primary" disabled={isSubmitting}>
            {isSubmitting ? "Registering..." : "Register"}
          </Button>
        </Form>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "Complex form with react-hook-form showing advanced validation: password strength, password confirmation matching, and numeric validation.",
      },
    },
  },
};

// Event Stories
export const WithEvents: StoryObj<typeof Form> = {
  render: () => {
    const [name, setName] = useState("");
    const handleSubmit = fn((e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      console.log("Form submitted:", { name });
    });

    return (
      <div className="space-y-4">
        <p className="text-sm text-gray-600">
          Fill in the form and submit. Check the Actions panel to see events
          being fired.
        </p>
        <Form onSubmit={handleSubmit} className="max-w-md">
          <div className="space-y-2">
            <Label htmlFor="name" variant="required">
              Name
            </Label>
            <Input
              id="name"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              required
            />
          </div>
          <Button type="submit" variant="regular">
            Submit
          </Button>
        </Form>
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByPlaceholderText("Enter your name");
    const button = canvas.getByText("Submit");

    await userEvent.type(input, "Test User");
    await userEvent.click(button);
    await waitFor(() => {
      expect(input).toHaveValue("Test User");
    });
  },
  parameters: {
    docs: {
      description: {
        story:
          "Demonstrates form events. Fill in and submit the form, then check the Actions panel to see events being logged.",
      },
    },
  },
};

// State Stories
export const DefaultState: StoryObj<typeof Form> = {
  render: () => {
    const [name, setName] = useState("");
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
    };

    return (
      <Form onSubmit={handleSubmit} className="max-w-md">
        <div className="space-y-2">
          <Label htmlFor="name" variant="required">
            Name
          </Label>
          <Input
            id="name"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            required
          />
        </div>
        <Button type="submit" variant="regular">
          Submit
        </Button>
      </Form>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "Default state - form in normal state without loading, error, or success messages.",
      },
    },
  },
};

export const LoadingState: StoryObj<typeof Form> = {
  render: () => {
    const [name, setName] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setIsSubmitting(true);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setIsSubmitting(false);
    };

    return (
      <Form onSubmit={handleSubmit} className="max-w-md" loading={isSubmitting}>
        <div className="space-y-2">
          <Label htmlFor="name" variant="required">
            Name
          </Label>
          <Input
            id="name"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isSubmitting}
            required
          />
        </div>
        <Button type="submit" variant="regular" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit"}
        </Button>
      </Form>
    );
  },
  parameters: {
    docs: {
      description: {
        story: "Loading state - form shows loading indicator while submitting.",
      },
    },
  },
};

export const ErrorState: StoryObj<typeof Form> = {
  render: () => {
    const [name, setName] = useState("");
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
    };

    return (
      <Form
        onSubmit={handleSubmit}
        className="max-w-md"
        error="Please fix the errors below and try again."
      >
        <div className="space-y-2">
          <Label htmlFor="name" variant="required">
            Name
          </Label>
          <Input
            id="name"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error
            required
          />
        </div>
        <Button type="submit" variant="regular">
          Submit
        </Button>
      </Form>
    );
  },
  parameters: {
    docs: {
      description: {
        story: "Error state - form displays a global error message.",
      },
    },
  },
};

export const SuccessState: StoryObj<typeof Form> = {
  render: () => {
    const [name, setName] = useState("");
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
    };

    return (
      <Form
        onSubmit={handleSubmit}
        className="max-w-md"
        success="Form submitted successfully!"
      >
        <div className="space-y-2">
          <Label htmlFor="name" variant="required">
            Name
          </Label>
          <Input
            id="name"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <Button type="submit" variant="regular">
          Submit
        </Button>
      </Form>
    );
  },
  parameters: {
    docs: {
      description: {
        story: "Success state - form displays a success message.",
      },
    },
  },
};

export default meta;
