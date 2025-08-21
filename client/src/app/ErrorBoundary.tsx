import { Component, type ErrorInfo, type ReactNode } from "react";

export type ErrorBoundaryProps = {
  children: (hasError: boolean, error: unknown, resolve: () => void) => ReactNode;
};

type ErrorBoundaryState = {
  hasError: boolean;
  error: unknown | null;
  errorInfo?: ErrorInfo;
};

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  public static getDerivedStateFromError(error: unknown) {
    return { hasError: true, error };
  }

  public override render() {
    const { children } = this.props;
    const { error, hasError } = this.state;

    return children(hasError, error, () => this.setState({ error: null, hasError: false }));
  }
}
