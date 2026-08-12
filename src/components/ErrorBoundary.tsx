import { Component, ReactNode } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  error: Error | null;
}

// Wraps the 3D viewport. If WebGL is unavailable (common in embedded
// webviews like VS Code's "Simple Browser") or anything else in the R3F
// tree throws, this shows a message instead of unmounting the entire app.
export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: { componentStack: string }) {
    console.error("3D viewport crashed:", error, info.componentStack);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="viewport-empty">
          <strong>3D viewport couldn't start</strong>
          <span>
            {this.state.error.message.toLowerCase().includes("webgl")
              ? "This browser tab doesn't have WebGL available — open the app in a full browser window (Chrome, Edge, or Firefox) rather than an embedded preview pane."
              : this.state.error.message}
          </span>
        </div>
      );
    }
    return this.props.children;
  }
}
