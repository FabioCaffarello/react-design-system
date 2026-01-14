import { describe, it, expect } from 'vitest';
import {
  createDashboardTemplate,
  createAuthTemplate,
  createFormTemplate,
  createListTemplate,
  createDetailTemplate,
  createWizardTemplate,
  getFeatureTemplates,
} from './FeatureTemplates';

describe('FeatureTemplates', () => {
  describe('createDashboardTemplate', () => {
    it('should create valid dashboard feature', () => {
      const feature = createDashboardTemplate();

      expect(feature.name).toBe('Dashboard');
      expect(feature.category).toBe('page');
      expect(feature.components.length).toBeGreaterThan(0);
      expect(feature.layout.type).toBe('container');
    });
  });

  describe('createAuthTemplate', () => {
    it('should create valid auth feature', () => {
      const feature = createAuthTemplate();

      expect(feature.name).toBe('Authentication');
      expect(feature.category).toBe('page');
      expect(feature.components.length).toBeGreaterThan(0);
    });
  });

  describe('createFormTemplate', () => {
    it('should create valid form feature', () => {
      const feature = createFormTemplate();

      expect(feature.name).toBe('Form');
      expect(feature.category).toBe('module');
      expect(feature.components.length).toBeGreaterThan(0);
    });
  });

  describe('createListTemplate', () => {
    it('should create valid list feature', () => {
      const feature = createListTemplate();

      expect(feature.name).toBe('List');
      expect(feature.category).toBe('module');
      expect(feature.components.length).toBeGreaterThan(0);
    });
  });

  describe('createDetailTemplate', () => {
    it('should create valid detail feature', () => {
      const feature = createDetailTemplate();

      expect(feature.name).toBe('Detail');
      expect(feature.category).toBe('page');
      expect(feature.components.length).toBeGreaterThan(0);
    });
  });

  describe('createWizardTemplate', () => {
    it('should create valid wizard feature', () => {
      const feature = createWizardTemplate();

      expect(feature.name).toBe('Wizard');
      expect(feature.category).toBe('flow');
      expect(feature.components.length).toBeGreaterThan(0);
    });
  });

  describe('getFeatureTemplates', () => {
    it('should return all templates', () => {
      const templates = getFeatureTemplates();

      expect(templates.length).toBeGreaterThan(0);
      expect(templates.some((t) => t.name === 'Dashboard')).toBe(true);
      expect(templates.some((t) => t.name === 'Authentication')).toBe(true);
    });

    it('should have create function for each template', () => {
      const templates = getFeatureTemplates();

      templates.forEach((template) => {
        expect(typeof template.create).toBe('function');
        const feature = template.create();
        expect(feature.id).toBeDefined();
        expect(feature.name).toBeDefined();
        expect(feature.category).toBeDefined();
      });
    });
  });
});
