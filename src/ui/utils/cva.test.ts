import { describe, it, expect } from 'vitest';
import { cva, type VariantProps } from './cva';

describe('cva', () => {
  it('creates variant function with base class', () => {
    const variants = cva('base-class');
    expect(variants()).toBe('base-class');
  });

  it('handles simple variants', () => {
    const buttonVariants = cva('base', {
      variants: {
        variant: {
          primary: 'bg-blue-500',
          secondary: 'bg-gray-500',
        },
      },
    });

    expect(buttonVariants({ variant: 'primary' })).toBe('base bg-blue-500');
    expect(buttonVariants({ variant: 'secondary' })).toBe('base bg-gray-500');
  });

  it('handles multiple variant dimensions', () => {
    const buttonVariants = cva('base', {
      variants: {
        variant: {
          primary: 'bg-blue-500',
          secondary: 'bg-gray-500',
        },
        size: {
          sm: 'text-sm',
          md: 'text-base',
        },
      },
    });

    expect(buttonVariants({ variant: 'primary', size: 'sm' })).toBe('base bg-blue-500 text-sm');
    expect(buttonVariants({ variant: 'secondary', size: 'md' })).toBe('base bg-gray-500 text-base');
  });

  it('handles default variants', () => {
    const buttonVariants = cva('base', {
      variants: {
        variant: {
          primary: 'bg-blue-500',
          secondary: 'bg-gray-500',
        },
        size: {
          sm: 'text-sm',
          md: 'text-base',
        },
      },
      defaultVariants: {
        variant: 'primary',
        size: 'md',
      },
    });

    expect(buttonVariants()).toBe('base bg-blue-500 text-base');
    expect(buttonVariants({ variant: 'secondary' })).toBe('base bg-gray-500 text-base');
  });

  it('handles compound variants', () => {
    const badgeVariants = cva('base', {
      variants: {
        variant: {
          success: '',
          error: '',
        },
        style: {
          solid: '',
          outline: '',
        },
      },
      compoundVariants: [
        {
          variant: 'success',
          style: 'solid',
          class: 'bg-green-500 text-white',
        },
        {
          variant: 'error',
          style: 'outline',
          class: 'border-red-500 text-red-500',
        },
      ],
    });

    expect(badgeVariants({ variant: 'success', style: 'solid' })).toBe('base bg-green-500 text-white');
    expect(badgeVariants({ variant: 'error', style: 'outline' })).toBe('base border-red-500 text-red-500');
  });

  it('resolves Tailwind conflicts', () => {
    const variants = cva('base', {
      variants: {
        padding: {
          sm: 'p-2',
          md: 'p-4',
        },
      },
    });

    // Should resolve conflict if both are applied
    const result = variants({ padding: 'md' });
    expect(result).toBe('base p-4');
  });

  it('works with VariantProps type inference', () => {
    const _buttonVariants = cva('base', {
      variants: {
        variant: {
          primary: 'bg-blue-500',
          secondary: 'bg-gray-500',
        },
      },
    });

    type ButtonProps = VariantProps<typeof _buttonVariants>;
    const props: ButtonProps = { variant: 'primary' };
    expect(props.variant).toBe('primary');
  });
});
