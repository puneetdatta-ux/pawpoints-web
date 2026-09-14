import nodemailer from "nodemailer";

// Founder alerts go out through the same Gmail SMTP account that Supabase
// Auth uses (see the dashboard's SMTP settings) — one sending identity,
// configured here via env vars so no credential lives in the repo.
export const FOUNDER_EMAIL = "puneet.datta@pawpoints.co.nz";

export async function sendFounderEmail(subject: string, html: string) {
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!user || !pass) throw new Error("SMTP_USER / SMTP_PASS not set");

  const transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT || 465),
    secure: true,
    auth: { user, pass },
  });

  await transport.sendMail({
    from: `"PawPoints" <${process.env.SMTP_FROM || user}>`,
    to: FOUNDER_EMAIL,
    subject,
    html,
  });
}
