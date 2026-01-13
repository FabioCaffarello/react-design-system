/**
 * Flow Validation
 * 
 * Validation system for flows with connection rules and validation rules.
 */

import type { Connection, Node, Edge, IsValidConnection } from '@xyflow/react';
import type { ValidationRule, ConnectionRule, ValidationResult } from '../organisms/FlowTypes';

/**
 * Flow Validator
 * 
 * Manages validation rules and connection rules for flows.
 */
export class FlowValidator {
  private rules: ConnectionRule[] = [];
  private validationRules: ValidationRule[] = [];
  
  /**
   * Add a connection rule
   */
  addRule(rule: ConnectionRule): void {
    this.rules.push(rule);
  }
  
  /**
   * Remove a connection rule
   */
  removeRule(sourceType: string | string[], targetType: string | string[]): void {
    this.rules = this.rules.filter((rule) => {
      const sourceMatch = Array.isArray(rule.sourceType)
        ? rule.sourceType.join(',') === (Array.isArray(sourceType) ? sourceType.join(',') : sourceType)
        : rule.sourceType === (Array.isArray(sourceType) ? sourceType[0] : sourceType);
      const targetMatch = Array.isArray(rule.targetType)
        ? rule.targetType.join(',') === (Array.isArray(targetType) ? targetType.join(',') : targetType)
        : rule.targetType === (Array.isArray(targetType) ? targetType[0] : targetType);
      return !(sourceMatch && targetMatch);
    });
  }
  
  /**
   * Add a validation rule
   */
  addValidationRule(rule: ValidationRule): void {
    this.validationRules.push(rule);
  }
  
  /**
   * Remove a validation rule
   */
  removeValidationRule(id: string): void {
    this.validationRules = this.validationRules.filter((r) => r.id !== id);
  }
  
  /**
   * Get all connection rules
   */
  getRules(): ConnectionRule[] {
    return [...this.rules];
  }
  
  /**
   * Get all validation rules
   */
  getValidationRules(): ValidationRule[] {
    return [...this.validationRules];
  }
  
  /**
   * Create isValidConnection function for React Flow
   */
  createIsValidConnection(nodes: Node[], edges: Edge[]): IsValidConnection {
    return (connection: Connection) => {
      const sourceNode = nodes.find((n) => n.id === connection.source);
      const targetNode = nodes.find((n) => n.id === connection.target);
      
      if (!sourceNode || !targetNode) {
        return false;
      }
      
      const sourceType = sourceNode.type || 'default';
      const targetType = targetNode.type || 'default';
      
      // Check connection rules
      for (const rule of this.rules) {
        const sourceMatches = Array.isArray(rule.sourceType)
          ? rule.sourceType.includes(sourceType)
          : rule.sourceType === sourceType;
          
        const targetMatches = Array.isArray(rule.targetType)
          ? rule.targetType.includes(targetType)
          : rule.targetType === targetType;
        
        if (sourceMatches && targetMatches) {
          // Rule found - check if allowed
          if (!rule.allowed) {
            return false;
          }
          
          // Check maxConnections
          if (rule.maxConnections !== undefined) {
            const existingConnections = edges.filter(
              (e) => e.source === connection.source && e.target === connection.target
            ).length;
            if (existingConnections >= rule.maxConnections) {
              return false;
            }
          }
          
          // Custom validator
          if (rule.customValidator) {
            return rule.customValidator(connection, nodes, edges);
          }
          
          return true;
        }
      }
      
      // Default: allow if no rules or no matching rule
      return this.rules.length === 0;
    };
  }
  
  /**
   * Validate flow
   */
  validate(nodes: Node[], edges: Edge[]): ValidationResult[] {
    const results: ValidationResult[] = [];
    
    this.validationRules.forEach((rule) => {
      const result = rule.validate(nodes, edges);
      if (result) {
        results.push(result);
      }
    });
    
    return results;
  }
  
  /**
   * Clear all rules
   */
  clear(): void {
    this.rules = [];
    this.validationRules = [];
  }
}
