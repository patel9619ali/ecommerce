import { Resend } from "resend";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL;
const resend = new Resend(process.env.RESEND_API_KEY);
const supportEmail = process.env.SUPPORT_EMAIL || "support@blendras.in";

const rupee = (amount: number) => `Rs ${Number(amount || 0).toLocaleString("en-IN")}`;

const escapeHtml = (value?: string | null) =>
  (value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");

const formatRefundDestination = (destination?: string | null) => {
  if (!destination) return null;
  if (destination === "WALLET") return "Wallet";
  if (destination === "ORIGINAL_SOURCE") return "Original payment method (UPI/Card/Bank)";
  return destination;
};

type OrderMailAddress = {
  firstName?: string | null;
  lastName?: string | null;
  phone?: string | null;
  address?: string | null;
  building?: string | null;
  apartment?: string | null;
  landmark?: string | null;
  city?: string | null;
  state?: string | null;
  pincode?: string | null;
};

type OrderMailItem = {
  title: string;
  quantity: number;
  price: number;
  variantId?: string | null;
};

const renderAddressHtml = (address?: OrderMailAddress | null) => {
  if (!address) {
    return "<p style=\"margin:0;color:#666\">Address not available.</p>";
  }

  const lines = [
    [address.firstName, address.lastName].filter(Boolean).join(" "),
    address.phone || "",
    address.address || "",
    [address.building, address.apartment].filter(Boolean).join(", "),
    address.landmark || "",
    [address.city, address.state, address.pincode].filter(Boolean).join(" - "),
  ].filter((line) => !!line && line.trim().length > 0);

  return `<div>${lines
    .map(
      (line) => `<div style="margin:0 0 4px 0;color:#111;font-size:14px;">${escapeHtml(line)}</div>`
    )
    .join("")}</div>`;
};

const renderItemsTableHtml = (items: OrderMailItem[]) => {
  const rows = items
    .map((item) => {
      const lineTotal = item.price * item.quantity;
      return `
        <tr>
          <td style="padding:10px;border-bottom:1px solid #eee;font-size:14px;color:#111;">
            ${escapeHtml(item.title)}
            ${item.variantId ? `<div style="font-size:12px;color:#666;margin-top:2px;">Variant: ${escapeHtml(item.variantId)}</div>` : ""}
          </td>
          <td style="padding:10px;border-bottom:1px solid #eee;text-align:center;font-size:14px;color:#111;">${item.quantity}</td>
          <td style="padding:10px;border-bottom:1px solid #eee;text-align:right;font-size:14px;color:#111;">${rupee(item.price)}</td>
          <td style="padding:10px;border-bottom:1px solid #eee;text-align:right;font-size:14px;color:#111;">${rupee(lineTotal)}</td>
        </tr>
      `;
    })
    .join("");

  return `
    <table style="width:100%;border-collapse:collapse;background:#fff;border:1px solid #eee;border-radius:8px;overflow:hidden;">
      <thead>
        <tr style="background:#fafafa;">
          <th style="padding:10px;text-align:left;font-size:12px;color:#666;font-weight:600;">Item</th>
          <th style="padding:10px;text-align:center;font-size:12px;color:#666;font-weight:600;">Qty</th>
          <th style="padding:10px;text-align:right;font-size:12px;color:#666;font-weight:600;">Price</th>
          <th style="padding:10px;text-align:right;font-size:12px;color:#666;font-weight:600;">Total</th>
        </tr>
      </thead>
      <tbody>
        ${rows}
      </tbody>
    </table>
  `;
};

const renderImageProofHtml = (imageUrls?: string[]) => {
  if (!imageUrls?.length) {
    return `<p style="margin:0;color:#666;font-size:13px;">No images uploaded.</p>`;
  }

  const fullUrls = imageUrls.map((url) =>
    url.startsWith("http") ? url : `${baseUrl || ""}${url}`
  );

  return `
    <div style="display:flex;flex-wrap:wrap;gap:8px;">
      ${fullUrls
        .map(
          (src) => `
            <a href="${escapeHtml(src)}" target="_blank" rel="noreferrer" style="display:block;width:120px;height:120px;border:1px solid #eee;border-radius:8px;overflow:hidden;">
              <img src="${escapeHtml(src)}" alt="Refund proof" style="width:100%;height:100%;object-fit:cover;display:block;" />
            </a>
          `
        )
        .join("")}
    </div>
  `;
};

export const sendTwoFactorTokenEmail = async (email: string, token: string) => {
  await resend.emails.send({
    from: "BlendRas <support@blendras.in>",
    to: email,
    subject: "Your (2FA) two-factor authentication code",
    html: `<p>Your 2FA code is: ${token}</p>`,
  });
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const confirmLink = `${baseUrl}/new-password?token=${token}`;
  await resend.emails.send({
    from: "BlendRas <support@blendras.in>",
    to: email,
    subject: "Reset your password",
    html: `<p>You requested to reset your password for <b>BlendRas</b>.</p>

<p>
  Click the button below to reset your password.
  This link is valid for 1 hour.
</p>

<p>
  <a href="${confirmLink}"
     style="padding:10px 16px;background:#000;color:#fff;text-decoration:none;border-radius:6px;">
     Reset Password
  </a>
</p>

<p>If you didn't request this, you can safely ignore this email.</p>

<hr/>
<p style="font-size:12px;color:#666">
  © BlendRas · ${supportEmail}
</p>
`,
  });
};

export const sendEmailVerificationOtp = async (email: string, token: string) => {
  await resend.emails.send({
    from: "BlendRas <support@blendras.in>",
    to: email,
    subject: "Verify your email",
    html: `
      <p>Your email verification code is:</p>
      <h2 style="letter-spacing:4px">${token}</h2>
      <p>This code expires in 1 hour.</p>
    `,
  });
};

export const sendOrderPlacedEmailToCustomer = async (params: {
  email: string;
  customerName?: string | null;
  orderId: string;
  amount: number;
  paymentMethod: string;
  items: OrderMailItem[];
  address?: OrderMailAddress | null;
}) => {
  const { email, customerName, orderId, amount, paymentMethod, items, address } = params;

  await resend.emails.send({
    from: "BlendRas <support@blendras.in>",
    to: email,
    subject: `Order Confirmed: ${orderId}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:680px;margin:0 auto;padding:16px;">
        <h2 style="margin:0 0 8px;">Order Confirmed</h2>
        <p style="margin:0 0 16px;color:#333;">Hi ${escapeHtml(customerName || "Customer")}, your order has been placed successfully.</p>

        <div style="background:#f6f8fa;border:1px solid #eaeef2;border-radius:8px;padding:12px;margin-bottom:16px;">
          <p style="margin:0 0 6px;"><b>Order ID:</b> ${escapeHtml(orderId)}</p>
          <p style="margin:0 0 6px;"><b>Payment Method:</b> ${escapeHtml(paymentMethod)}</p>
          <p style="margin:0;"><b>Total:</b> ${rupee(amount)}</p>
        </div>

        <h3 style="margin:0 0 8px;">Items</h3>
        ${renderItemsTableHtml(items)}

        <h3 style="margin:18px 0 8px;">Delivery Address</h3>
        <div style="background:#f6f8fa;border:1px solid #eaeef2;border-radius:8px;padding:12px;">
          ${renderAddressHtml(address)}
        </div>

        <p style="margin:18px 0 0;color:#666;font-size:12px;">If you need help, contact us at ${escapeHtml(supportEmail)}.</p>
      </div>
    `,
  });
};

export const sendOrderPlacedEmailToSeller = async (params: {
  orderId: string;
  customerEmail?: string | null;
  customerName?: string | null;
  customerPhone?: string | null;
  amount: number;
  paymentMethod: string;
  items: OrderMailItem[];
  address?: OrderMailAddress | null;
}) => {
  const sellerEmail = process.env.SELLER_EMAIL || supportEmail;
  const {
    orderId,
    customerEmail,
    customerName,
    customerPhone,
    amount,
    paymentMethod,
    items,
    address,
  } = params;

  await resend.emails.send({
    from: "BlendRas <support@blendras.in>",
    to: sellerEmail,
    subject: `New Order Received: ${orderId}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:680px;margin:0 auto;padding:16px;">
        <h2 style="margin:0 0 8px;">New Order Received</h2>

        <div style="background:#f6f8fa;border:1px solid #eaeef2;border-radius:8px;padding:12px;margin-bottom:16px;">
          <p style="margin:0 0 6px;"><b>Order ID:</b> ${escapeHtml(orderId)}</p>
          <p style="margin:0 0 6px;"><b>Total:</b> ${rupee(amount)}</p>
          <p style="margin:0 0 6px;"><b>Payment Method:</b> ${escapeHtml(paymentMethod)}</p>
          <p style="margin:0 0 6px;"><b>Customer:</b> ${escapeHtml(customerName || "N/A")}</p>
          <p style="margin:0 0 6px;"><b>Customer Email:</b> ${escapeHtml(customerEmail || "N/A")}</p>
          <p style="margin:0;"><b>Customer Phone:</b> ${escapeHtml(customerPhone || "N/A")}</p>
        </div>

        <h3 style="margin:0 0 8px;">Items</h3>
        ${renderItemsTableHtml(items)}

        <h3 style="margin:18px 0 8px;">Delivery Address</h3>
        <div style="background:#f6f8fa;border:1px solid #eaeef2;border-radius:8px;padding:12px;">
          ${renderAddressHtml(address)}
        </div>
      </div>
    `,
  });
};

export const sendOrderCancelledEmailToCustomer = async (params: {
  email: string;
  customerName?: string | null;
  orderId: string;
  amount: number;
  paymentMethod: string;
  refundDestination?: string | null;
  items: OrderMailItem[];
  address?: OrderMailAddress | null;
}) => {
  const {
    email,
    customerName,
    orderId,
    amount,
    paymentMethod,
    refundDestination,
    items,
    address,
  } = params;

  await resend.emails.send({
    from: "BlendRas <support@blendras.in>",
    to: email,
    subject: `Order Cancelled: ${orderId}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:680px;margin:0 auto;padding:16px;">
        <h2 style="margin:0 0 8px;">Order Cancelled</h2>
        <p style="margin:0 0 16px;color:#333;">Hi ${escapeHtml(customerName || "Customer")}, your order has been cancelled.</p>

        <div style="background:#fff4f4;border:1px solid #ffd8d8;border-radius:8px;padding:12px;margin-bottom:16px;">
          <p style="margin:0 0 6px;"><b>Order ID:</b> ${escapeHtml(orderId)}</p>
          <p style="margin:0 0 6px;"><b>Total:</b> ${rupee(amount)}</p>
          <p style="margin:0 0 6px;"><b>Payment Method:</b> ${escapeHtml(paymentMethod)}</p>
          ${formatRefundDestination(refundDestination) ? `<p style="margin:0;"><b>Refund:</b> ${escapeHtml(formatRefundDestination(refundDestination))}</p>` : ""}
        </div>

        <h3 style="margin:0 0 8px;">Cancelled Items</h3>
        ${renderItemsTableHtml(items)}

        <h3 style="margin:18px 0 8px;">Delivery Address</h3>
        <div style="background:#f6f8fa;border:1px solid #eaeef2;border-radius:8px;padding:12px;">
          ${renderAddressHtml(address)}
        </div>
      </div>
    `,
  });
};

export const sendOrderCancelledEmailToSeller = async (params: {
  orderId: string;
  amount: number;
  paymentMethod: string;
  reason: string;
  comment?: string | null;
  customerEmail?: string | null;
  customerName?: string | null;
  customerPhone?: string | null;
  refundDestination?: string | null;
  items: OrderMailItem[];
  address?: OrderMailAddress | null;
}) => {
  const sellerEmail = process.env.SELLER_EMAIL || supportEmail;
  const {
    orderId,
    amount,
    paymentMethod,
    reason,
    comment,
    customerEmail,
    customerName,
    customerPhone,
    refundDestination,
    items,
    address,
  } = params;

  await resend.emails.send({
    from: "BlendRas <support@blendras.in>",
    to: sellerEmail,
    subject: `Order Cancelled by Customer: ${orderId}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:680px;margin:0 auto;padding:16px;">
        <h2 style="margin:0 0 8px;">Order Cancellation Alert</h2>

        <div style="background:#fff4f4;border:1px solid #ffd8d8;border-radius:8px;padding:12px;margin-bottom:16px;">
          <p style="margin:0 0 6px;"><b>Order ID:</b> ${escapeHtml(orderId)}</p>
          <p style="margin:0 0 6px;"><b>Total:</b> ${rupee(amount)}</p>
          <p style="margin:0 0 6px;"><b>Payment Method:</b> ${escapeHtml(paymentMethod)}</p>
          <p style="margin:0 0 6px;"><b>Reason:</b> ${escapeHtml(reason)}</p>
          ${comment ? `<p style="margin:0 0 6px;"><b>Comment:</b> ${escapeHtml(comment)}</p>` : ""}
          ${formatRefundDestination(refundDestination) ? `<p style="margin:0 0 6px;"><b>Refund:</b> ${escapeHtml(formatRefundDestination(refundDestination))}</p>` : ""}
          <p style="margin:0 0 6px;"><b>Customer:</b> ${escapeHtml(customerName || "N/A")}</p>
          <p style="margin:0 0 6px;"><b>Email:</b> ${escapeHtml(customerEmail || "N/A")}</p>
          <p style="margin:0;"><b>Phone:</b> ${escapeHtml(customerPhone || "N/A")}</p>
        </div>

        <h3 style="margin:0 0 8px;">Cancelled Items</h3>
        ${renderItemsTableHtml(items)}

        <h3 style="margin:18px 0 8px;">Delivery Address</h3>
        <div style="background:#f6f8fa;border:1px solid #eaeef2;border-radius:8px;padding:12px;">
          ${renderAddressHtml(address)}
        </div>
      </div>
    `,
  });
};

export const sendRefundRequestedEmailToSeller = async (params: {
  orderId: string;
  amount: number;
  paymentMethod: string;
  refundDestination?: string | null;
  refundReason?: string | null;
  customerEmail?: string | null;
  customerName?: string | null;
  customerPhone?: string | null;
  proofImages?: string[];
}) => {
  const sellerEmail = process.env.SELLER_EMAIL || supportEmail;
  const {
    orderId,
    amount,
    paymentMethod,
    refundDestination,
    refundReason,
    customerEmail,
    customerName,
    customerPhone,
    proofImages,
  } = params;

  await resend.emails.send({
    from: "BlendRas <support@blendras.in>",
    to: sellerEmail,
    subject: `Refund Request: ${orderId}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:680px;margin:0 auto;padding:16px;">
        <h2 style="margin:0 0 8px;">Customer Requested Refund</h2>
        <div style="background:#fff4f4;border:1px solid #ffd8d8;border-radius:8px;padding:12px;margin-bottom:16px;">
          <p style="margin:0 0 6px;"><b>Order ID:</b> ${escapeHtml(orderId)}</p>
          <p style="margin:0 0 6px;"><b>Total:</b> ${rupee(amount)}</p>
          <p style="margin:0 0 6px;"><b>Payment Method:</b> ${escapeHtml(paymentMethod)}</p>
          <p style="margin:0 0 6px;"><b>Refund To:</b> ${escapeHtml(formatRefundDestination(refundDestination) || "Not set")}</p>
          <p style="margin:0 0 6px;"><b>Reason:</b> ${escapeHtml(refundReason || "Not provided")}</p>
          <p style="margin:0 0 6px;"><b>Customer:</b> ${escapeHtml(customerName || "N/A")}</p>
          <p style="margin:0 0 6px;"><b>Email:</b> ${escapeHtml(customerEmail || "N/A")}</p>
          <p style="margin:0;"><b>Phone:</b> ${escapeHtml(customerPhone || "N/A")}</p>
        </div>
        <h3 style="margin:0 0 8px;">Refund Proof Images</h3>
        ${renderImageProofHtml(proofImages)}
      </div>
    `,
  });
};

