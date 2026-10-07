const dns = require('dns');
const nodemailer = require('nodemailer');
require('dotenv').config();

// Force Node.js DNS to prioritize IPv4 to prevent ENETUNREACH on Cloud (Render, Heroku, etc.)
if (dns.setDefaultResultOrder) {
  dns.setDefaultResultOrder('ipv4first');
}

const EMAIL_USER = (process.env.EMAIL_USER || 'jobnexa.vn@gmail.com').trim();
const EMAIL_PASS = (process.env.EMAIL_APP_PASSWORD || 'ispxgzujbwtkuyjo').replace(/\s+/g, '');
const FROM_NAME = process.env.EMAIL_FROM_NAME || 'EduJob - Cổng Tuyển Dụng Sinh Viên';

// Create nodemailer transporter with explicit IPv4 family and SSL
const createTransporter = () => {
  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // SSL
    family: 4, // Force IPv4 (Prevents ENETUNREACH error on Cloud)
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
    connectionTimeout: 15000,
    greetingTimeout: 15000,
  });
};

/**
 * Send OTP Verification Email
 * @param {string} toEmail 
 * @param {string} otpCode 
 * @param {string} purpose 
 */
const sendOtpEmail = async (toEmail, otpCode, purpose = 'register') => {
  const transporter = createTransporter();

  const title = purpose === 'register' ? 'Mã Xác Thực Đăng Ký Tài Khoản' : 'Mã Xác Thực Đặt Lại Mật Khẩu';
  const subtitle = purpose === 'register' 
    ? 'Cảm ơn bạn đã đăng ký tài khoản tại nền tảng Tuyển Dụng Sinh Viên EduJob.' 
    : 'Yêu cầu đặt lại mật khẩu cho tài khoản của bạn tại EduJob.';

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc; margin: 0; padding: 20px; }
        .container { max-width: 560px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); }
        .header { background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%); padding: 32px 24px; text-align: center; color: #ffffff; }
        .header h1 { margin: 0; font-size: 22px; font-weight: 800; letter-spacing: -0.5px; }
        .header p { margin: 8px 0 0 0; font-size: 13px; opacity: 0.9; }
        .body { padding: 32px 28px; color: #334155; line-height: 1.6; }
        .otp-box { background: #f0f9ff; border: 2px dashed #0284c7; border-radius: 12px; padding: 20px; text-align: center; margin: 24px 0; }
        .otp-code { font-size: 32px; font-weight: 800; letter-spacing: 8px; color: #0284c7; margin: 0; font-family: 'Courier New', Courier, monospace; }
        .otp-note { font-size: 12px; color: #64748b; margin-top: 8px; }
        .footer { background: #f8fafc; border-top: 1px solid #e2e8f0; padding: 20px; text-align: center; font-size: 12px; color: #94a3b8; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>${FROM_NAME}</h1>
          <p>${title}</p>
        </div>
        <div class="body">
          <p>Xin chào <strong>${toEmail}</strong>,</p>
          <p>${subtitle}</p>
          <p>Vui lòng sử dụng mã xác thực OTP bảo mật bên dưới để tiếp tục:</p>
          
          <div class="otp-box">
            <div class="otp-code">${otpCode}</div>
            <div class="otp-note">⏱ Mã xác thực này có hiệu lực trong vòng <strong>5 phút</strong>.</div>
          </div>

          <p style="font-size: 13px; color: #64748b;">
            ⚠️ <em>Tuyệt đối không chia sẻ mã OTP này cho bất kỳ ai để bảo vệ tài khoản của bạn. Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email.</em>
          </p>
        </div>
        <div class="footer">
          <p>Email được gửi tự động từ <strong>${EMAIL_USER}</strong></p>
          <p>© 2026 EduJob Marketplace. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const mailOptions = {
    from: `"${FROM_NAME}" <${EMAIL_USER}>`,
    to: toEmail,
    subject: `[${otpCode}] ${title} - ${FROM_NAME}`,
    html: htmlContent,
  };

  const info = await transporter.sendMail(mailOptions);
  console.log(`[Email Sent] Đã gửi mã OTP ${otpCode} tới ${toEmail}: ${info.messageId}`);
  return { success: true, messageId: info.messageId };
};

module.exports = {
  sendOtpEmail,
};
