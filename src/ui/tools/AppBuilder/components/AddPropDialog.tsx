'use client';

import { useState, useCallback } from 'react';
import Dialog from '../../../organisms/Dialog/Dialog';
import { DialogContent } from '../../../organisms/Dialog/DialogContent';
import { DialogHeader } from '../../../organisms/Dialog/DialogHeader';
import { DialogFooter } from '../../../organisms/Dialog/DialogFooter';
import { Button, Input, Label, Select } from '../../../atoms';

export interface AddPropDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (key: string, value: unknown) => void;
  existingKeys?: string[];
}

type PropType = 'string' | 'number' | 'boolean' | 'object' | 'array';

/**
 * AddPropDialog
 *
 * Dialog for adding new properties to a component.
 * Replaces the prompt() approach with a proper modal.
 */
export function AddPropDialog({
  open,
  onOpenChange,
  onAdd,
  existingKeys = [],
}: AddPropDialogProps) {
  const [propName, setPropName] = useState('');
  const [propType, setPropType] = useState<PropType>('string');
  const [propValue, setPropValue] = useState('');
  const [error, setError] = useState<string | null>(null);

  const resetForm = useCallback(() => {
    setPropName('');
    setPropType('string');
    setPropValue('');
    setError(null);
  }, []);

  const handleClose = useCallback(() => {
    resetForm();
    onOpenChange(false);
  }, [resetForm, onOpenChange]);

  const parseValue = (value: string, type: PropType): unknown => {
    switch (type) {
      case 'string':
        return value;
      case 'number':
        const num = Number(value);
        if (isNaN(num)) throw new Error('Invalid number');
        return num;
      case 'boolean':
        return value === 'true';
      case 'object':
      case 'array':
        return JSON.parse(value);
      default:
        return value;
    }
  };

  const handleAdd = useCallback(() => {
    // Validate prop name
    const trimmedName = propName.trim();
    if (!trimmedName) {
      setError('Property name is required');
      return;
    }

    if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(trimmedName)) {
      setError('Property name must start with a letter or underscore');
      return;
    }

    if (existingKeys.includes(trimmedName)) {
      setError('A property with this name already exists');
      return;
    }

    // Parse value based on type
    try {
      const parsedValue = parseValue(propValue, propType);
      onAdd(trimmedName, parsedValue);
      handleClose();
    } catch (err) {
      if (propType === 'object') {
        setError('Invalid JSON object. Example: {"key": "value"}');
      } else if (propType === 'array') {
        setError('Invalid JSON array. Example: [1, 2, 3]');
      } else if (propType === 'number') {
        setError('Please enter a valid number');
      } else {
        setError('Invalid value format');
      }
    }
  }, [propName, propType, propValue, existingKeys, onAdd, handleClose]);

  const getPlaceholder = (): string => {
    switch (propType) {
      case 'string':
        return 'Enter text value';
      case 'number':
        return '0';
      case 'boolean':
        return 'Select true or false';
      case 'object':
        return '{"key": "value"}';
      case 'array':
        return '[1, 2, 3]';
      default:
        return '';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="sm">
        <DialogHeader>
          <Dialog.Title>Add Property</Dialog.Title>
          <Dialog.Description>
            Add a new property to the component.
          </Dialog.Description>
        </DialogHeader>

        <div className="p-6 space-y-4">
          {/* Property Name */}
          <div>
            <Label htmlFor="prop-name">Property Name</Label>
            <Input
              id="prop-name"
              type="text"
              value={propName}
              onChange={(e) => {
                setPropName(e.target.value);
                setError(null);
              }}
              placeholder="e.g., variant, size, disabled"
              autoFocus
            />
          </div>

          {/* Property Type */}
          <div>
            <Label htmlFor="prop-type">Type</Label>
            <Select
              id="prop-type"
              value={propType}
              onChange={(e) => {
                setPropType(e.target.value as PropType);
                setPropValue('');
                setError(null);
              }}
            >
              <option value="string">String</option>
              <option value="number">Number</option>
              <option value="boolean">Boolean</option>
              <option value="object">Object (JSON)</option>
              <option value="array">Array (JSON)</option>
            </Select>
          </div>

          {/* Property Value */}
          <div>
            <Label htmlFor="prop-value">Value</Label>
            {propType === 'boolean' ? (
              <Select
                id="prop-value"
                value={propValue || 'false'}
                onChange={(e) => {
                  setPropValue(e.target.value);
                  setError(null);
                }}
              >
                <option value="true">true</option>
                <option value="false">false</option>
              </Select>
            ) : (
              <Input
                id="prop-value"
                type={propType === 'number' ? 'number' : 'text'}
                value={propValue}
                onChange={(e) => {
                  setPropValue(e.target.value);
                  setError(null);
                }}
                placeholder={getPlaceholder()}
              />
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-2 rounded">
              {error}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleAdd}>
            Add Property
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
