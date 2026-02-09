import { useState } from "react";
import { createRoot } from "react-dom/client";
import "../index.css";

const openai = () => (window as any).openai;

function StateTest() {
  const displayMode: string = openai()?.displayMode ?? "inline";
  const isFullscreen = displayMode === "fullscreen";

  // Test A: plain React useState — lost on mobile remount
  const [reactValue, setReactValue] = useState<string | null>(null);

  // Test B: read widgetState directly from host
  const widgetStateValue = (openai()?.widgetState?.selectedId as string) ?? null;

  return (
    <div className="container">
      <h2 className="title">
        {isFullscreen ? "FULLSCREEN MODE" : "INLINE MODE"}
      </h2>

      <div className="section">
        <h3>Test A: useState</h3>
        <p className="value">Value: <strong>{reactValue ?? "null"}</strong></p>
        {!isFullscreen && (
          <button
            className="btn-primary"
            onClick={() => {
              setReactValue("REACT_STATE_SET");
              openai()?.requestDisplayMode?.({ mode: "fullscreen" });
            }}
          >
            Set useState + go fullscreen
          </button>
        )}
      </div>

      <div className="section">
        <h3>Test B: window.openai.setWidgetState</h3>
        <p className="value">Value: <strong>{widgetStateValue ?? "null"}</strong></p>
        {!isFullscreen && (
          <button
            className="btn-primary"
            onClick={() => {
              openai()?.setWidgetState?.({ selectedId: "WIDGET_STATE_SET" });
              openai()?.requestDisplayMode?.({ mode: "fullscreen" });
            }}
          >
            Set widgetState + go fullscreen
          </button>
        )}
      </div>

      <div className="section">
        <h3>Test C: Both at once</h3>
        {!isFullscreen && (
          <button
            className="btn-primary"
            onClick={() => {
              setReactValue("REACT_BOTH");
              openai()?.setWidgetState?.({ selectedId: "WIDGET_BOTH" });
              openai()?.requestDisplayMode?.({ mode: "fullscreen" });
            }}
          >
            Set both + go fullscreen
          </button>
        )}
      </div>

      {isFullscreen && (
        <button
          className="btn-primary back-btn"
          onClick={() => openai()?.requestDisplayMode?.({ mode: "inline" })}
        >
          Back to inline
        </button>
      )}

      <div className="debug">
        <p>displayMode: {displayMode}</p>
        <p>reactValue (useState): {reactValue ?? "null"}</p>
        <p>widgetState.selectedId: {widgetStateValue ?? "null"}</p>
        <p>raw widgetState: {JSON.stringify(openai()?.widgetState)}</p>
      </div>
    </div>
  );
}

const root = document.getElementById("root");
if (root) {
  createRoot(root).render(<StateTest />);
}
