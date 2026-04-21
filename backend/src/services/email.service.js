const nodemailer = require("nodemailer");

let transporter;

const getTransporter = () => {
  if (transporter) {
    return transporter;
  }

  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_SECURE } = process.env;

  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
    throw new Error(
      "SMTP configuration is incomplete. Set SMTP_HOST, SMTP_PORT, SMTP_USER, and SMTP_PASS."
    );
  }

  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: String(SMTP_SECURE || "false").toLowerCase() === "true",
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });

  return transporter;
};

const sendVerificationEmail = async ({ to, name, verificationLink }) => {
  const mailer = getTransporter();
  const from = process.env.EMAIL_FROM || process.env.SMTP_USER;

  const subject = "Verify your Secure Task Space account";
  const text = [
    `Hi ${name},`,
    "",
    "Please confirm your email to activate your account.",
    `Verification link: ${verificationLink}`,
    "",
    "If you did not create this account, you can ignore this email.",
  ].join("\n");

  const html = `
    <p>Hi ${name},</p>
    <p>Please confirm your email to activate your account.</p>
    <p><a href="${verificationLink}">Verify email</a></p>
    <p>If you did not create this account, you can ignore this email.</p>
  `;

  await mailer.sendMail({
    from,
    to,
    subject,
    text,
    html,
  });
};

module.exports = {
  sendVerificationEmail,
};
