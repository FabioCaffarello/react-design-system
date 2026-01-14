'use client';

import { Component, type ReactNode } from 'react';
import { Card } from '../../molecules';
import { Button } from '../../atoms';

interface AppBuilderErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface AppBuilderErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

/**
 * Error Boundary for App Builder
 * 
 * Catches errors in the App Builder component tree and displays a fallback UI
 */
export class AppBuilderErrorBoundary extends Component<
  AppBuilderErrorBoundaryProps,
  AppBuilderErrorBoundaryState
> {
  constructor(props: AppBuilderErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): AppBuilderErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: unknown) {
    console.error('App Builder Error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex items-center justify-center min-h-screen p-4 bg-gray-50 dark:bg-gray-900">
          <Card className="max-w-md w-full">
            <div className="p-6">
              <h3 className="font-semibold text-red-600 dark:text-red-400 mb-2 text-lg">
                Something went wrong
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                {this.state.error?.message || 'An unexpected error occurred in the App Builder'}
              </p>
              <div className="flex gap-2">
                <Button variant="primary" onClick={this.handleReset}>
                  Try Again
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    window.location.reload();
                  }}
                >
                  Reload Page
                </Button>
              </div>
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="mt-4">
                  <summary className="text-xs text-gray-500 dark:text-gray-400 cursor-pointer">
                    Error Details
                  </summary>
                  <pre className="mt-2 text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded overflow-auto">
                    {this.state.error.stack}
                  </pre>
                </details>
              )}
            </div>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
