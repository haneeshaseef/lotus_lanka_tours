import * as React from "react";

interface Props {
  name: string;
  destinations: string[];
  duration?: number;
}

export function CustomTourConfirmationEmail({ name, destinations, duration }: Props) {
  return (
    <div style={{ fontFamily: "Arial, sans-serif", maxWidth: 600, margin: "0 auto" }}>
      <div style={{ background: "#1a6b3c", padding: "24px 32px" }}>
        <h1 style={{ color: "#fff", margin: 0, fontSize: 24 }}>Lotus Lanka Tours</h1>
      </div>
      <div style={{ padding: "32px", background: "#fdfaf5" }}>
        <h2 style={{ color: "#1c1c1e", marginTop: 0 }}>
          Your custom tour request is confirmed, {name}!
        </h2>
        <p style={{ color: "#374151", lineHeight: 1.6 }}>
          We have received your custom tour request and our experts are already
          working on crafting your perfect Sri Lanka itinerary.
        </p>
        <div
          style={{
            background: "#fff",
            border: "1px solid #e5e7eb",
            borderRadius: 8,
            padding: "20px 24px",
            marginTop: 24,
          }}
        >
          <h3 style={{ margin: "0 0 12px", color: "#1a6b3c" }}>Your Request Summary</h3>
          <p style={{ margin: "0 0 8px", color: "#374151" }}>
            <strong>Destinations:</strong> {destinations.join(", ")}
          </p>
          {duration && (
            <p style={{ margin: 0, color: "#374151" }}>
              <strong>Duration:</strong> {duration} days
            </p>
          )}
        </div>
        <p style={{ color: "#374151", lineHeight: 1.6, marginTop: 24 }}>
          We will send you a personalised itinerary within <strong>48 hours</strong>.
        </p>
        <p style={{ color: "#374151", marginTop: 32 }}>
          Warm regards,
          <br />
          <strong>The Lotus Lanka Tours Team</strong>
        </p>
      </div>
      <div
        style={{
          background: "#1c1c1e",
          padding: "16px 32px",
          textAlign: "center" as const,
        }}
      >
        <p style={{ color: "#9ca3af", fontSize: 12, margin: 0 }}>
          © {new Date().getFullYear()} Lotus Lanka Tours · Colombo, Sri Lanka
        </p>
      </div>
    </div>
  );
}
