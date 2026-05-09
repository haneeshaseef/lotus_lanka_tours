import * as React from "react";

interface Props {
  name: string;
  tourName: string;
}

export function InquiryConfirmationEmail({ name, tourName }: Props) {
  return (
    <div style={{ fontFamily: "Arial, sans-serif", maxWidth: 600, margin: "0 auto" }}>
      <div style={{ background: "#1a6b3c", padding: "24px 32px" }}>
        <h1 style={{ color: "#fff", margin: 0, fontSize: 24 }}>Lotus Lanka Tours</h1>
      </div>
      <div style={{ padding: "32px", background: "#fdfaf5" }}>
        <h2 style={{ color: "#1c1c1e", marginTop: 0 }}>Thank you, {name}!</h2>
        <p style={{ color: "#374151", lineHeight: 1.6 }}>
          We have received your inquiry about{" "}
          <strong style={{ color: "#1a6b3c" }}>{tourName}</strong> and we are
          thrilled to help you plan your Sri Lanka adventure.
        </p>
        <p style={{ color: "#374151", lineHeight: 1.6 }}>
          Our travel experts will review your request and get back to you within{" "}
          <strong>24 hours</strong>.
        </p>
        <div
          style={{
            background: "#e8f5ee",
            borderLeft: "4px solid #1a6b3c",
            padding: "16px 20px",
            marginTop: 24,
            borderRadius: "0 8px 8px 0",
          }}
        >
          <p style={{ margin: 0, color: "#1a6b3c", fontWeight: 600 }}>
            In the meantime, feel free to reach us on WhatsApp for immediate
            assistance.
          </p>
        </div>
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
