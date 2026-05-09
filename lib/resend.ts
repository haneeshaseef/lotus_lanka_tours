import { Resend } from "resend";
import { InquiryConfirmationEmail } from "@/emails/InquiryConfirmation";
import { CustomTourConfirmationEmail } from "@/emails/CustomTourConfirmation";
import { AdminNotificationEmail } from "@/emails/AdminNotification";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "admin@lotuslankatours.com";
const FROM_EMAIL = "Lotus Lanka Tours <noreply@lotuslankatours.com>";

function getResend() {
  if (!process.env.RESEND_API_KEY) throw new Error("RESEND_API_KEY is not set");
  return new Resend(process.env.RESEND_API_KEY);
}

export async function sendInquiryConfirmation(params: {
  name: string;
  email: string;
  tourName: string;
}) {
  return getResend().emails.send({
    from: FROM_EMAIL,
    to: params.email,
    subject: "We received your inquiry – Lotus Lanka Tours",
    react: InquiryConfirmationEmail({
      name: params.name,
      tourName: params.tourName,
    }),
  });
}

export async function sendAdminInquiryNotification(params: {
  name: string;
  email: string;
  phone?: string;
  tourName: string;
  travelDate?: string;
  guests: number;
  message?: string;
}) {
  return getResend().emails.send({
    from: FROM_EMAIL,
    to: ADMIN_EMAIL,
    subject: `New Inquiry from ${params.name} – ${params.tourName}`,
    react: AdminNotificationEmail({ type: "inquiry", ...params }),
  });
}

export async function sendCustomTourConfirmation(params: {
  name: string;
  email: string;
  destinations: string[];
  duration?: number;
}) {
  return getResend().emails.send({
    from: FROM_EMAIL,
    to: params.email,
    subject: "Your custom tour request – Lotus Lanka Tours",
    react: CustomTourConfirmationEmail({
      name: params.name,
      destinations: params.destinations,
      duration: params.duration,
    }),
  });
}

export async function sendAdminCustomTourNotification(params: {
  name: string;
  email: string;
  phone?: string;
  destinations: string[];
  duration?: number;
  travelDate?: string;
  guests: number;
  interests?: string[];
  specialRequests?: string;
}) {
  return getResend().emails.send({
    from: FROM_EMAIL,
    to: ADMIN_EMAIL,
    subject: `New Custom Tour Request from ${params.name}`,
    react: AdminNotificationEmail({ type: "custom_tour", ...params }),
  });
}
