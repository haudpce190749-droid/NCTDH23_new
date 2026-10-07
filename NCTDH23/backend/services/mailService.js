require('dotenv').config();

const RESEND_API_KEY = process.env.RESEND_API_KEY || (process.env.RESEND_KEY_PART1 ? process.env.RESEND_KEY_PART1 + process.env.RESEND_KEY_PART2 : '');
const FROM_EMAIL = process.env.RESEND_FROM || 'EduJob <onboarding@resend.dev>';
const FROM_NAME = process.env.EMAIL_FROM_NAME || 'EduJob - Cổng Tuyển Dụng Sinh Viên';

/**
 * Send OTP Verification Email via Resend REST API (HTTPS Port 443)
 * @param {string} toEmail 
 * @param {string} otpCode 
 * @param {string} purpose 
 */
const sendOtpEmail = async (toEmail, otpCode, purpose = 'register') => {
  const apiKey = RESEND_API_KEY || process.env.RESEND_API_KEY;

  if (!apiKey) {
    throw new Error('Chưa cấu hình RESEND_API_KEY trong biến môi trường hoặc file .env.');
  }

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
          <p>Email được gửi tự động qua hệ thống bảo mật <strong>EduJob</strong></p>
          <p>© 2026 EduJob Marketplace. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  console.log(`[Resend HTTPS] Sending OTP ${otpCode} to ${toEmail}...`);

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: FROM_EMAIL,
      to: [toEmail],
      subject: `[${otpCode}] ${title} - ${FROM_NAME}`,
      html: htmlContent,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    console.error('[Resend Error]', response.status, data);
    if (data.message?.includes('only send testing emails')) {
      throw new Error(`Tài khoản Resend thử nghiệm chỉ cho phép gửi đến email đăng ký của bạn (${data.message.match(/\((.*?)\)/)?.[1] || 'email chủ'}). Để gửi tới mọi email, hãy thêm domain trên resend.com.`);
    }
    throw new Error(data.message || 'Lỗi khi gửi email qua Resend API.');
  }

  console.log(`[Resend Success] Email sent: ${data.id}`);
  return { success: true, messageId: data.id };
};

module.exports = {
  sendOtpEmail,
};
