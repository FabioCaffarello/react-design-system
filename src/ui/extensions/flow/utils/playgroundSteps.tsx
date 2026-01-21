/**
 * Playground Tab Content Configuration
 * 
 * Defines the content for each tab in the playground.
 * Each tab maps to a component that will be rendered.
 */

/* eslint-disable react-refresh/only-export-components */
import React, { lazy, Suspense } from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';
import { usePlaygroundContext } from '../context/PlaygroundContext';
import { Card } from '../../../molecules';
import { Button, Label, Spinner } from '../../../atoms';
import { validateFlow } from './playgroundHelpers';
import { NodesEdgesTabContent } from '../components/NodesEdgesTabContent';
import { 
  getSpacingClass, 
  getColorClass, 
  getTypographyClasses,
  getRadiusClass 
} from '../../../tokens';

// Lazy load heavy panels for code splitting
const ReactFlowPropsPanel = lazy(() => import('../components/ReactFlowPropsPanel').then(m => ({ default: m.ReactFlowPropsPanel })));
const BackgroundConfigPanel = lazy(() => import('../components/BackgroundConfigPanel').then(m => ({ default: m.BackgroundConfigPanel })));
const LayoutConfigPanel = lazy(() => import('../components/LayoutConfigPanel').then(m => ({ default: m.LayoutConfigPanel })));
const SettingsPanel = lazy(() => import('../components/SettingsPanel').then(m => ({ default: m.SettingsPanel })));
const CodePreview = lazy(() => import('../components/CodePreview').then(m => ({ default: m.CodePreview })));


/**
 * Interaction Panel Component
 */
function InteractionPanel() {
  const { reactFlowConfig, setReactFlowConfig } = usePlaygroundContext();

  return (
    <Card padding="md">
      <h3
        className={`
          ${getTypographyClasses('h4')}
          ${getColorClass('neutral', 'dark', 'text')}
          m-0
          ${getSpacingClass('md', 'mb')}
        `}
      >
        Interaction Settings
      </h3>
      <div className={`flex flex-col ${getSpacingClass('md', 'gap')}`}>
        <Label>
          <input
            type="checkbox"
            checked={reactFlowConfig.selectNodesOnDrag || false}
            onChange={(e) =>
              setReactFlowConfig({ ...reactFlowConfig, selectNodesOnDrag: e.target.checked })
            }
            className={getSpacingClass('sm', 'mr')}
          />
          Select Nodes on Drag
        </Label>
        <Label>
          <input
            type="checkbox"
            checked={reactFlowConfig.nodesDraggable !== false}
            onChange={(e) =>
              setReactFlowConfig({ ...reactFlowConfig, nodesDraggable: e.target.checked })
            }
            className={getSpacingClass('sm', 'mr')}
          />
          Nodes Draggable
        </Label>
        <Label>
          <input
            type="checkbox"
            checked={reactFlowConfig.nodesConnectable !== false}
            onChange={(e) =>
              setReactFlowConfig({ ...reactFlowConfig, nodesConnectable: e.target.checked })
            }
            className={getSpacingClass('sm', 'mr')}
          />
          Nodes Connectable
        </Label>
        <Label>
          <input
            type="checkbox"
            checked={reactFlowConfig.edgesUpdatable !== false}
            onChange={(e) =>
              setReactFlowConfig({ ...reactFlowConfig, edgesUpdatable: e.target.checked })
            }
            className={getSpacingClass('sm', 'mr')}
          />
          Edges Updatable
        </Label>
      </div>
    </Card>
  );
}

/**
 * Viewport Panel Component
 */
function ViewportPanel() {
  const { reactFlowConfig, setReactFlowConfig } = usePlaygroundContext();

  return (
    <Card padding="md">
      <h3
        className={`
          ${getTypographyClasses('h4')}
          ${getColorClass('neutral', 'dark', 'text')}
          m-0
          ${getSpacingClass('md', 'mb')}
        `}
      >
        Viewport Settings
      </h3>
      <div className={`flex flex-col ${getSpacingClass('md', 'gap')}`}>
        <Label>
          <input
            type="checkbox"
            checked={reactFlowConfig.fitView || false}
            onChange={(e) =>
              setReactFlowConfig({ ...reactFlowConfig, fitView: e.target.checked })
            }
            className={getSpacingClass('sm', 'mr')}
          />
          Fit View on Init
        </Label>
        {reactFlowConfig.fitView && (
          <div
            className={`
              ${getSpacingClass('base', 'pl')}
              ${getTypographyClasses('body')}
              ${getColorClass('neutral', 'DEFAULT', 'text')}
            `}
          >
            Padding: {reactFlowConfig.fitViewOptions?.padding || 0.2}
          </div>
        )}
      </div>
    </Card>
  );
}

/**
 * Validation Panel Component
 */
function ValidationPanel() {
  const { nodes, edges } = usePlaygroundContext();
  const [validationResult, setValidationResult] = React.useState<unknown>(null);

  const handleValidate = React.useCallback(() => {
    const result = validateFlow(nodes, edges);
    setValidationResult(result);
  }, [nodes, edges]);

  React.useEffect(() => {
    handleValidate();
  }, [handleValidate]);

  return (
    <div className={`flex flex-col ${getSpacingClass('base', 'gap')}`}>
      <Card padding="md">
        <div className={`flex justify-between items-center ${getSpacingClass('md', 'mb')}`}>
          <h3
            className={`
              ${getTypographyClasses('h4')}
              ${getColorClass('neutral', 'dark', 'text')}
              m-0
            `}
          >
            Flow Validation
          </h3>
          <Button size="sm" onClick={handleValidate}>
            Validate
          </Button>
        </div>
        {validationResult && (
          <div
            className={`
              ${getSpacingClass('md', 'p')}
              ${getRadiusClass('md')}
              ${getTypographyClasses('body')}
              ${validationResult.valid 
                ? `${getColorClass('success', 'light', 'bg')} ${getColorClass('success', 'dark', 'text')}`
                : `${getColorClass('error', 'light', 'bg')} ${getColorClass('error', 'dark', 'text')}`
              }
            `}
          >
            <span className="flex items-center gap-1.5">
              {validationResult.valid ? (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  Flow is valid
                </>
              ) : (
                <>
                  <XCircle className="h-4 w-4" />
                  {validationResult.errors?.length || 0} error(s) found
                </>
              )}
            </span>
          </div>
        )}
        {validationResult?.errors && validationResult.errors.length > 0 && (
          <div className={getSpacingClass('md', 'mt')}>
            <Label className={`${getTypographyClasses('label')} ${getSpacingClass('sm', 'mb')} block`}>
              Errors:
            </Label>
            <ul
              className={`
                m-0 pl-5
                ${getTypographyClasses('caption')}
                ${getColorClass('error', 'dark', 'text')}
              `}
            >
              {validationResult.errors.map((error: string, idx: number) => (
                <li key={idx}>{error}</li>
              ))}
            </ul>
          </div>
        )}
      </Card>
      <Card padding="md">
        <h3
          className={`
            ${getTypographyClasses('h4')}
            ${getColorClass('neutral', 'dark', 'text')}
            m-0
            ${getSpacingClass('sm', 'mb')}
          `}
        >
          Validation Rules
        </h3>
        <ul
          className={`
            m-0 pl-5
            ${getTypographyClasses('body')}
            ${getColorClass('neutral', 'DEFAULT', 'text')}
          `}
        >
          <li>All nodes must have unique IDs</li>
          <li>All edges must connect existing nodes</li>
          <li>Edges must have valid source and target</li>
          <li>Flow should have at least one edge</li>
        </ul>
      </Card>
    </div>
  );
}

/**
 * Canvas Basic Step Component
 */
function CanvasBasicStep() {
  const { reactFlowConfig, setReactFlowConfig } = usePlaygroundContext();
  return (
    <Suspense fallback={<Card padding="md"><Spinner /></Card>}>
      <ReactFlowPropsPanel config={reactFlowConfig} onChange={setReactFlowConfig} />
    </Suspense>
  );
}

/**
 * Background Step Component
 */
function BackgroundStep() {
  const { backgroundConfig, setBackgroundConfig, theme } = usePlaygroundContext();
  return <BackgroundConfigPanel config={backgroundConfig} onChange={setBackgroundConfig} theme={theme} />;
}

/**
 * Layout Step Component
 */
function LayoutStep() {
  const { layoutConfig, setLayoutConfig, setHasPendingChanges } = usePlaygroundContext();
  return (
    <Suspense fallback={<Card padding="md"><Spinner /></Card>}>
      <LayoutConfigPanel
        config={layoutConfig}
        onChange={setLayoutConfig}
        onApply={() => setHasPendingChanges(true)}
      />
    </Suspense>
  );
}

/**
 * Code Preview Step Component
 */
function CodePreviewStep() {
  const { nodes, edges, reactFlowConfig, backgroundConfig, theme } = usePlaygroundContext();
  return (
    <CodePreview
      nodes={nodes}
      edges={edges}
      reactFlowConfig={reactFlowConfig}
      backgroundConfig={backgroundConfig}
      theme={theme}
    />
  );
}

/**
 * Settings Step Component
 */
function SettingsStep() {
  const { theme, setTheme } = usePlaygroundContext();
  return (
    <Suspense fallback={<Card padding="md"><Spinner /></Card>}>
      <SettingsPanel theme={theme} onThemeChange={setTheme} />
    </Suspense>
  );
}

/**
 * Get tab content component for a specific tab
 */
export function getPlaygroundTabContent(tabId: string): React.ReactElement {
  const content: Record<string, React.ReactElement> = {
    'nodes-edges': <NodesEdgesTabContent />,
    canvas: (
      <div className={`flex flex-col ${getSpacingClass('base', 'gap')}`}>
        <CanvasBasicStep />
        <InteractionPanel />
        <ViewportPanel />
      </div>
    ),
    background: <BackgroundStep />,
    layout: <LayoutStep />,
    validation: <ValidationPanel />,
    code: <CodePreviewStep />,
    settings: <SettingsStep />,
  };

  return content[tabId] || (
    <Card padding="md">
      <p
        className={`
          ${getTypographyClasses('body')}
          ${getColorClass('neutral', 'DEFAULT', 'text')}
          m-0
        `}
      >
        No content available for this tab.
      </p>
    </Card>
  );
}
