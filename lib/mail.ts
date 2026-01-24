import { Resend } from "resend";
const baseUrl = process.env.NEXT_PUBLIC_APP_URL;
const resend = new Resend(process.env.RESEND_API_KEY);

export const sendTwoFactorTokenEmail = async (
  email: string,
  token: string
) => {
  await resend.emails.send({
    from: "BlendRas <support@blendras.in>",
    to: email,
    subject: "Your (2FA) two-factor authentication code",
    html: `<p>Your 2FA code is: ${token}</p>`,
  });
};

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
export const sendEmailVerificationOtp = async (
  email: string,
  token: string
) => {
  await resend.emails.send({
    from: "BlendRas <support@blendras.in>",
    to: email,
    subject: "Verify your email",
    html: `
      <p>Your email verification code is:</p>
      <h2 style="letter-spacing:4px">${token}</h2>
      <p>This code expires in 10 minutes.</p>
    `,
  });
};