import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null
        };
    }

    static getDerivedStateFromError(error: Error): State {
        return {
            hasError: true,
            error,
            errorInfo: null
        };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Error Boundary caught an error:', error, errorInfo);

        this.setState({
            error,
            errorInfo
        });

        // Log to error tracking service (e.g., Sentry)
        if (import.meta.env.PROD) {
            // window.Sentry?.captureException(error, { extra: errorInfo });
        }
    }

    handleReset = () => {
        this.setState({
            hasError: false,
            error: null,
            errorInfo: null
        });
    };

    handleGoHome = () => {
        window.location.href = '/';
    };

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className="min-h-screen bg-background flex items-center justify-center p-4">
                    <div className="max-w-2xl w-full">
                        <div className="bg-gradient-to-br from-red-500/10 to-orange-500/10 border border-red-500/20 rounded-2xl p-8 sm:p-12">
                            <div className="text-center">
                                {/* Icon */}
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-500/20 mb-6">
                                    <AlertTriangle className="w-8 h-8 text-red-400" />
                                </div>

                                {/* Title */}
                                <h1 className="text-2xl sm:text-3xl font-bold text-white mb-3">
                                    Oops! Something went wrong
                                </h1>

                                {/* Description */}
                                <p className="text-gray-400 mb-8">
                                    We're sorry for the inconvenience. The application encountered an unexpected error.
                                </p>

                                {/* Error Details (Development only) */}
                                {import.meta.env.DEV && this.state.error && (
                                    <div className="mb-8 p-4 rounded-lg bg-black/50 text-left overflow-auto max-h-64">
                                        <p className="text-xs text-red-400 font-mono mb-2">
                                            <strong>Error:</strong> {this.state.error.message}
                                        </p>
                                        {this.state.errorInfo && (
                                            <pre className="text-xs text-gray-500 whitespace-pre-wrap font-mono">
                                                {this.state.errorInfo.componentStack}
                                            </pre>
                                        )}
                                    </div>
                                )}

                                {/* Action Buttons */}
                                <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                                    <Button
                                        onClick={this.handleReset}
                                        className="w-full sm:w-auto bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700"
                                    >
                                        <RefreshCw className="w-4 h-4 mr-2" />
                                        Try Again
                                    </Button>

                                    <Button
                                        onClick={this.handleGoHome}
                                        variant="outline"
                                        className="w-full sm:w-auto border-white/10 hover:bg-white/5"
                                    >
                                        <Home className="w-4 h-4 mr-2" />
                                        Go to Homepage
                                    </Button>
                                </div>

                                {/* Support Info */}
                                <div className="mt-8 pt-6 border-t border-white/10">
                                    <p className="text-sm text-gray-500">
                                        If this problem persists, please{' '}
                                        <a
                                            href="mailto:support@menux.com"
                                            className="text-violet-400 hover:text-violet-300 underline"
                                        >
                                            contact support
                                        </a>
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Additional Help */}
                        <div className="mt-6 text-center">
                            <p className="text-xs text-gray-600">
                                Error ID: {Date.now().toString(36).toUpperCase()}
                            </p>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

// Functional wrapper for easier use
export const withErrorBoundary = <P extends object>(
    Component: React.ComponentType<P>,
    fallback?: ReactNode
) => {
    return (props: P) => (
        <ErrorBoundary fallback={fallback}>
            <Component {...props} />
        </ErrorBoundary>
    );
};
