/**
 * useFlowValidation Hook
 * 
 * Hook for validating flow using validation rules.
 */

import { useMemo } from 'react';
import { useReactFlow } from '@xyflow/react';
import { useFlowContext } from '../organisms/FlowContext';
import type { ValidationResult } from '../organisms/FlowTypes';

/**
 * Hook for flow validation
 * 
 * Validates the flow using rules from context.
 */
export function useFlowValidation() {
  const { getNodes, getEdges } = useReactFlow();
  const { validationRules } = useFlowContext();
  
  const validate = useMemo(() => {
    return (): ValidationResult[] => {
      const nodes = getNodes();
      const edges = getEdges();
      const results: ValidationResult[] = [];
      
      validationRules.forEach((rule) => {
        const result = rule.validate(nodes, edges);
        if (result) {
          results.push(result);
        }
      });
      
      return results;
    };
  }, [getNodes, getEdges, validationRules]);
  
  const errors = useMemo(() => {
    return validate().filter((r) => r.type === 'error');
  }, [validate]);
  
  const warnings = useMemo(() => {
    return validate().filter((r) => r.type === 'warning');
  }, [validate]);
  
  const isValid = useMemo(() => {
    return errors.length === 0;
  }, [errors]);
  
  return {
    validate,
    errors,
    warnings,
    isValid,
    hasErrors: errors.length > 0,
    hasWarnings: warnings.length > 0,
  };
}
