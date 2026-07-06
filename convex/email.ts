import { internalAction } from "./_generated/server";
import { v } from "convex/values";

// ─── Email Service via Resend ───────────────────────────────
// 
// SETUP: Add RESEND_API_KEY to your Convex environment variables.
// Run: npx convex env set RESEND_API_KEY re_xxxxxxxxxxxxx
//
// For local dev without Resend, emails will be logged to console.
// ─────────────────────────────────────────────────────────────

const FROM_EMAIL = "ACM Amrita <support@myamrita.me>";

const FOOTER_HTML = `
  <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 32px 0;" />
  <p style="font-size: 12px; color: #86868b; line-height: 1.5;">
    This email was sent by Amrita ACM Student Chapter, Nagercoil Campus.<br/>
    If you did not expect this email, you can safely ignore it.<br/><br/>
    <strong>Can't find this email?</strong> Please check your spam or junk folder and mark us as a safe sender.
  </p>
  <p style="font-size: 11px; color: #aeaeb2;">
    © 2026 Amrita ACM Student Chapter. All rights reserved.<br/>
    support@myamrita.me
  </p>
`;

async function sendEmail({ to, subject, html }: { to: string; subject: string; html: string }) {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.log(`[Email Service] No RESEND_API_KEY configured. Logging email:`);
    console.log(`  To: ${to}`);
    console.log(`  Subject: ${subject}`);
    console.log(`  Body: [HTML content]`);
    return { success: true, mode: "dry-run" };
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: FROM_EMAIL,
      to: [to],
      subject,
      html,
    }),
  });

  if (!response.ok) {
    const errorData = await response.text();
    console.error(`[Email Service] Failed to send email: ${errorData}`);
    throw new Error(`Email send failed: ${response.status}`);
  }

  return { success: true, mode: "sent" };
}

// ─── Welcome Email (after registration) ─────────────────────
export const sendWelcomeEmail = internalAction({
  args: {
    to: v.string(),
    name: v.string(),
  },
  handler: async (_ctx, args) => {
    const html = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <div style="text-align: center; margin-bottom: 32px;">
          <h1 style="font-size: 24px; font-weight: 600; color: #1d1d1f; margin: 0;">
            ACM<span style="color: #0071e3;">Amrita</span>
          </h1>
        </div>
        <h2 style="font-size: 28px; font-weight: 600; color: #1d1d1f; text-align: center; margin-bottom: 16px;">
          Welcome, ${args.name}!
        </h2>
        <p style="font-size: 17px; color: #1d1d1f; line-height: 1.6; text-align: center;">
          Your registration for the Amrita ACM Student Chapter has been received successfully. Our team will review your application and notify you once approved.
        </p>
        <div style="text-align: center; margin: 32px 0;">
          <a href="https://acm.myamrita.me" style="display: inline-block; background-color: #0071e3; color: #fff; text-decoration: none; padding: 14px 28px; border-radius: 12px; font-size: 16px; font-weight: 600;">
            Visit Chapter Website
          </a>
        </div>
        <div style="background-color: #f5f5f7; border-radius: 16px; padding: 24px; margin: 24px 0;">
          <h3 style="font-size: 16px; font-weight: 600; color: #1d1d1f; margin: 0 0 12px;">What happens next?</h3>
          <ul style="color: #86868b; font-size: 14px; line-height: 1.8; padding-left: 20px; margin: 0;">
            <li>Your application is under review by our team</li>
            <li>You'll receive an approval email within 48 hours</li>
            <li>Once approved, you'll get access to events and SIG resources</li>
          </ul>
        </div>
        ${FOOTER_HTML}
      </div>
    `;

    return await sendEmail({
      to: args.to,
      subject: "Welcome to ACM Amrita — Registration Received",
      html,
    });
  },
});

// ─── Support Inquiry Acknowledgement ────────────────────────
export const sendSupportAck = internalAction({
  args: {
    to: v.string(),
    name: v.string(),
    subject: v.string(),
  },
  handler: async (_ctx, args) => {
    const html = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <div style="text-align: center; margin-bottom: 32px;">
          <h1 style="font-size: 24px; font-weight: 600; color: #1d1d1f; margin: 0;">
            ACM<span style="color: #0071e3;">Amrita</span> Support
          </h1>
        </div>
        <h2 style="font-size: 24px; font-weight: 600; color: #1d1d1f; margin-bottom: 16px;">
          We received your message
        </h2>
        <p style="font-size: 16px; color: #1d1d1f; line-height: 1.6;">
          Hi ${args.name}, thank you for reaching out. We've logged your inquiry regarding "<strong>${args.subject}</strong>" and our support team will get back to you as soon as possible.
        </p>
        <div style="background-color: #f5f5f7; border-radius: 16px; padding: 20px; margin: 24px 0;">
          <p style="font-size: 14px; color: #86868b; margin: 0;">
            <strong>Typical response time:</strong> 24–48 hours<br/>
            <strong>Support email:</strong> support@myamrita.me
          </p>
        </div>
        ${FOOTER_HTML}
      </div>
    `;

    return await sendEmail({
      to: args.to,
      subject: `ACM Support — We received your inquiry: ${args.subject}`,
      html,
    });
  },
});
