/**
 * Playground Error Boundary
 * 
 * Catches errors in the playground and displays a friendly error message.
 */

import React, { Component, type ReactNode } from 'react';
import { Card } from '../../../molecules';
import { Button } from '../../../atoms';
import { 
  getSpacingClass, 
  getColorClass, 
  getTypographyClasses,
  getRadiusClass
} from '../../../tokens';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class PlaygroundErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

         componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
           console.error('Playground Error:', error, errorInfo);
           // Log to console for debugging
           console.error('Error Stack:', error.stack);
           console.error('Component Stack:', errorInfo.componentStack);
         }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Card padding="lg" className="m-4">
          <div className={`flex flex-col ${getSpacingClass('md', 'gap')}`}>
            <h2
              className={`
                ${getTypographyClasses('h3')}
                ${getColorClass('error', 'dark', 'text')}
                m-0
              `}
            >
              Something went wrong
            </h2>
            <p
              className={`
                ${getTypographyClasses('body')}
                ${getColorClass('neutral', 'DEFAULT', 'text')}
                m-0
              `}
            >
              An error occurred in the playground. You can try resetting or refreshing the page.
            </p>
            {this.state.error && (
              <details
                className={`
                  ${getSpacingClass('sm', 'mt')}
                  ${getTypographyClasses('caption')}
                  ${getColorClass('neutral', 'DEFAULT', 'text')}
                `}
              >
                <summary style={{ cursor: 'pointer' }}>Error details</summary>
                <pre
                  className={`
                    ${getSpacingClass('sm', 'mt')}
                    p-2
                    ${getColorClass('neutral', 'light', 'bg')}
                    ${getRadiusClass('md')}
                    overflow-auto
                    text-xs
                  `}
                >
                  {this.state.error.toString()}
                  {this.state.error.stack && (
                    <div className={getSpacingClass('xs', 'mt')}>
                      {this.state.error.stack}
                    </div>
                  )}
                </pre>
              </details>
            )}
            <div className={`flex gap-2 ${getSpacingClass('md', 'mt')}`}>
              <Button variant="primary" onClick={this.handleReset}>
                Try Again
              </Button>
              <Button
                variant="outline"
                onClick={() => window.location.reload()}
              >
                Refresh Page
              </Button>
            </div>
          </div>
        </Card>
      );
    }

    return this.props.children;
  }
}
