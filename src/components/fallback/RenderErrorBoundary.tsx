import { Component, type ErrorInfo, type ReactNode } from 'react';
import reportError from '../../lib/reportError';

interface RenderErrorBoundaryProps {
  children: ReactNode;
  fallback: ReactNode;
  context: string;
}

interface RenderErrorBoundaryState {
  hasError: boolean;
}

export default class RenderErrorBoundary extends Component<
  RenderErrorBoundaryProps,
  RenderErrorBoundaryState
> {
  declare props: Readonly<RenderErrorBoundaryProps>;
  declare state: Readonly<RenderErrorBoundaryState>;

  constructor(props: RenderErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
    };
  }

  static getDerivedStateFromError(): RenderErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: unknown, errorInfo: ErrorInfo) {
    reportError(error, this.props.context, {
      componentStack: errorInfo.componentStack ?? undefined,
    });
  }
  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }

    return this.props.children;
  }
}
