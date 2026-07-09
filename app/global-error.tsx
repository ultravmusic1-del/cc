"use client";

/**
 * Catches errors thrown in the root layout itself (which app/error.tsx
 * cannot). Must render its own <html>/<body>. Kept intentionally minimal
 * and dependency-free so it can render even if the app shell is broken.
 */
export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100dvh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#611224",
          color: "#f4e8dc",
          fontFamily: "system-ui, sans-serif",
          textAlign: "center",
          padding: "0 1.5rem",
        }}
      >
        <h1 style={{ fontSize: "1.4rem", fontWeight: 600 }}>
          A small hiccup on our end
        </h1>
        <p style={{ opacity: 0.75, marginTop: "0.5rem" }}>
          Please try again.
        </p>
        <button
          onClick={reset}
          style={{
            marginTop: "1.5rem",
            padding: "0.75rem 1.75rem",
            borderRadius: "999px",
            border: "none",
            background: "#ec5b45",
            color: "#f4e8dc",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Try again
        </button>
      </body>
    </html>
  );
}
