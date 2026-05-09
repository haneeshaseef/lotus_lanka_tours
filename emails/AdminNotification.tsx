import * as React from "react";

interface InquiryProps {
  type: "inquiry";
  name: string;
  email: string;
  phone?: string;
  tourName: string;
  travelDate?: string;
  guests: number;
  message?: string;
}

interface CustomTourProps {
  type: "custom_tour";
  name: string;
  email: string;
  phone?: string;
  destinations: string[];
  duration?: number;
  travelDate?: string;
  guests: number;
  interests?: string[];
  specialRequests?: string;
}

type Props = InquiryProps | CustomTourProps;

export function AdminNotificationEmail(props: Props) {
  const isInquiry = props.type === "inquiry";

  return (
    <div style={{ fontFamily: "Arial, sans-serif", maxWidth: 600, margin: "0 auto" }}>
      <div style={{ background: "#c9a84c", padding: "24px 32px" }}>
        <h1 style={{ color: "#fff", margin: 0, fontSize: 20 }}>
          {isInquiry ? "New Tour Inquiry" : "New Custom Tour Request"}
        </h1>
      </div>
      <div style={{ padding: "32px", background: "#fdfaf5" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <tbody>
            <Row label="Name" value={props.name} />
            <Row label="Email" value={props.email} />
            {props.phone && <Row label="Phone" value={props.phone} />}
            <Row label="Guests" value={String(props.guests)} />
            {props.travelDate && <Row label="Travel Date" value={props.travelDate} />}
            {isInquiry ? (
              <>
                <Row label="Tour" value={(props as InquiryProps).tourName} />
                {(props as InquiryProps).message && (
                  <Row label="Message" value={(props as InquiryProps).message!} />
                )}
              </>
            ) : (
              <>
                <Row
                  label="Destinations"
                  value={(props as CustomTourProps).destinations.join(", ")}
                />
                {(props as CustomTourProps).duration && (
                  <Row
                    label="Duration"
                    value={`${(props as CustomTourProps).duration} days`}
                  />
                )}
                {(props as CustomTourProps).interests?.length && (
                  <Row
                    label="Interests"
                    value={(props as CustomTourProps).interests!.join(", ")}
                  />
                )}
                {(props as CustomTourProps).specialRequests && (
                  <Row
                    label="Special Requests"
                    value={(props as CustomTourProps).specialRequests!}
                  />
                )}
              </>
            )}
          </tbody>
        </table>
        <div style={{ marginTop: 24 }}>
          <a
            href={`${process.env.NEXT_PUBLIC_SITE_URL}/admin/${isInquiry ? "inquiries" : "custom-requests"}`}
            style={{
              background: "#1a6b3c",
              color: "#fff",
              padding: "12px 24px",
              borderRadius: 6,
              textDecoration: "none",
              display: "inline-block",
            }}
          >
            View in Admin Dashboard →
          </a>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <tr>
      <td
        style={{
          padding: "8px 12px 8px 0",
          color: "#6b7280",
          fontWeight: 600,
          whiteSpace: "nowrap" as const,
          verticalAlign: "top" as const,
        }}
      >
        {label}
      </td>
      <td style={{ padding: "8px 0", color: "#1c1c1e", verticalAlign: "top" as const }}>
        {value}
      </td>
    </tr>
  );
}
