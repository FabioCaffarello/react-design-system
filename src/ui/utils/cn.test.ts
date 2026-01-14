import { describe, it, expect } from 'vitest';
import { cn } from './cn';

describe('cn', () => {
  it('merges simple strings', () => {
    expect(cn('class1', 'class2')).toBe('class1 class2');
  });

  it('handles conditional classes', () => {
    expect(cn('base', true && 'active')).toBe('base active');
    expect(cn('base', false && 'inactive')).toBe('base');
  });

  it('handles arrays', () => {
    expect(cn(['class1', 'class2'], 'class3')).toBe('class1 class2 class3');
  });

  it('handles objects', () => {
    expect(cn({ 'class1': true, 'class2': false })).toBe('class1');
  });

  it('resolves Tailwind conflicts', () => {
    expect(cn('p-2', 'p-4')).toBe('p-4');
    expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500');
    expect(cn('bg-gray-100', 'bg-gray-200')).toBe('bg-gray-200');
  });

  it('handles mixed inputs', () => {
    expect(cn('base', ['array1', 'array2'], { 'obj1': true }, 'string')).toBe('base array1 array2 obj1 string');
  });

  it('handles undefined and null', () => {
    expect(cn('base', undefined, null, 'class')).toBe('base class');
  });

  it('handles empty inputs', () => {
    expect(cn()).toBe('');
    expect(cn('', null, undefined)).toBe('');
  });

  it('preserves non-conflicting Tailwind classes', () => {
    expect(cn('p-2', 'm-4', 'text-red-500')).toBe('p-2 m-4 text-red-500');
  });

  it('handles responsive and state variants', () => {
    expect(cn('md:p-2', 'md:p-4')).toBe('md:p-4');
    expect(cn('hover:bg-red-500', 'hover:bg-blue-500')).toBe('hover:bg-blue-500');
  });
});
