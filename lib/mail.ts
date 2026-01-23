import { Resend } from "resend";
const baseUrl = process.env.NEXT_PUBLIC_APP_URL;
const resend = new Resend(process.env.RESEND_API_KEY);

export const sendPasswordResetEmail = async (
  email: string,
  token: string
) => {
  const confirmLink = `${baseUrl}/new-password?token=${token}`;
  await resend.emails.send({
    from: "BlendRas <support@blendras.in>",
    to: email,
    subject: "Reset your password",
    html: `<p>Click <a href="${confirmLink}">here</a> to reset your password.</p>`,
  });
};
export const sendVerificationEmail = async (
  email: string,
  token: string
) => {
  const confirmLink = `${baseUrl}/new-verification?token=${token}`;

  await resend.emails.send({
    from: "BlendRas <support@blendras.in>",
    to: email,
    subject: "Confirm your email",
    html: `<p>Click <a href="${confirmLink}">here</a> to confirm email.</p>`,
  });
};