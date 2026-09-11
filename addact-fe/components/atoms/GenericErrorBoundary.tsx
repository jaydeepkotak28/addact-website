"use client";

import React, { Component, type ErrorInfo, type ReactNode } from "react";

export interface GenericErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  componentName?: string;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * GenericErrorBoundary
 * 
 * Prevents a single faulty component or Dynamic Zone block from
 * taking down the entire page. In development, shows a debug warning.
 * In production, renders a clean fallback or nothing.
 */
export class GenericErrorBoundary extends Component<GenericErrorBoundaryProps, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(
      `⚠️ [ErrorBoundary] Error in component '${this.props.componentName || "Unknown"}':`,
      error,
      errorInfo
    );
    this.props.onError?.(error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      if (process.env.NODE_ENV === "development") {
        return (
          <div className="p-4 my-2 border border-red-300 bg-red-50 text-red-800 rounded-lg text-sm">
            <p className="font-bold">⚠️ Component Error: {this.props.componentName || "Component"}</p>
            <p className="font-mono text-xs mt-1 text-red-600">{this.state.error?.message}</p>
          </div>
        );
      }

      return null;
    }

    return this.props.children;
  }
}

export default GenericErrorBoundary;
