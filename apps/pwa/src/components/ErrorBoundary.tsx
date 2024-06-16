import { Component, ErrorInfo, createContext, PropsWithChildren } from 'react';

export interface ErrorBoundaryProps extends PropsWithChildren<{}> {
  fallback?: React.ReactNode;
}

export interface ErrorBoundaryState {
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export const ErrorContext = createContext({
  error: null,
  errorInfo: null,
  reset: () => {},
});

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state = {
    error: null,
    errorInfo: null,
  };

  constructor(props: ErrorBoundaryProps) {
    super(props);
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    });
  }

  getFallback() {
    const { fallback } = this.props;

    return fallback ?? 'Something went wrong!';
  }

  reset = () => {
    this.setState({
      error: null,
      errorInfo: null,
    });
  };

  render() {
    const { children } = this.props;
    const { error, errorInfo } = this.state;
    const shouldDisplayFallback = error !== null && errorInfo !== null;

    return (
      <ErrorContext.Provider
        value={{
          error,
          errorInfo,
          reset: this.reset,
        }}
      >
        {shouldDisplayFallback ? this.getFallback() : children}
      </ErrorContext.Provider>
    );
  }
}
