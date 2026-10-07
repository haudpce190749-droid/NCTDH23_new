import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Building2, Mail, Lock, KeyRound, ArrowRight, ArrowLeft, RotateCcw, Loader2, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
  const { sendOtp, registerWithOtp } = useAuth();
  const navigate = useNavigate();

  // Step 1: Form Data, Step 2: OTP Verification
  const [step, setStep] = useState(1);

  const [role, setRole] = useState('student'); // 'student' or 'company'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [companyName, setCompanyName] = useState('');

  // OTP State
  const [otp, setOtp] = useState('');
  const [resendCountdown, setResendCountdown] = useState(0);

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [infoMsg, setInfoMsg] = useState('');

  // Countdown timer for resend OTP
  useEffect(() => {
    let timer;
    if (resendCountdown > 0) {
      timer = setInterval(() => {
        setResendCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendCountdown]);

  // Step 1: Request OTP
  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setInfoMsg('');

    if (password !== confirmPassword) {
      setErrorMsg('Mật khẩu xác nhận không khớp.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Mật khẩu phải có tối thiểu 6 ký tự.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await sendOtp(email.trim().toLowerCase(), 'register');
      setStep(2);
      setResendCountdown(60);
      setInfoMsg(res.message || 'Mã xác thực OTP đã được gửi đến email của bạn.');
    } catch (err) {
      console.error('Send OTP Error:', err);
      const msg =
        err.response?.data?.error ||
        err.userFriendlyMessage ||
        'Không thể gửi mã OTP. Vui lòng kiểm tra lại email hoặc kết nối máy chủ.';
      setErrorMsg(msg);
    } finally {
      setSubmitting(false);
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    if (resendCountdown > 0 || submitting) return;
    setErrorMsg('');
    setInfoMsg('');
    setSubmitting(true);

    try {
      const res = await sendOtp(email.trim().toLowerCase(), 'register');
      setResendCountdown(60);
      setInfoMsg('Đã gửi lại mã OTP mới vào hòm thư của bạn.');
    } catch (err) {
      const msg = err.response?.data?.error || 'Không thể gửi lại mã OTP. Vui lòng thử lại sau.';
      setErrorMsg(msg);
    } finally {
      setSubmitting(false);
    }
  };

  // Step 2: Verify OTP and Finish Registration
  const handleVerifyAndRegister = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!otp || otp.trim().length < 6) {
      setErrorMsg('Vui lòng nhập đủ 6 chữ số mã OTP.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        role,
        email: email.trim().toLowerCase(),
        password,
        otp: otp.trim(),
        fullName: role === 'student' ? fullName.trim() : undefined,
        companyName: role === 'company' ? companyName.trim() : undefined,
      };

      const newUser = await registerWithOtp(payload);
      if (newUser.role === 'student') {
        navigate('/student/dashboard');
      } else {
        navigate('/company/dashboard');
      }
    } catch (err) {
      console.error('Verify OTP Register Error:', err);
      const msg =
        err.response?.data?.error ||
        err.userFriendlyMessage ||
        'Xác thực OTP thất bại. Vui lòng kiểm tra lại mã hoặc gửi lại mã mới.';
      setErrorMsg(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-gray-100 shadow-xl space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <img src="/logo.png" alt="EduJob Logo" className="w-14 h-14 object-contain mx-auto shadow-xs rounded-xl" />
          <h2 className="text-2xl font-extrabold text-slate-900">
            {step === 1 ? 'Tạo Tài Khoản Mới' : 'Xác Thực Mã Email OTP'}
          </h2>
          <p className="text-xs text-gray-500">
            {step === 1 
              ? 'Tham gia hệ thống tuyển dụng việc làm sinh viên EduJob' 
              : 'Kiểm tra hộp thư để lấy mã xác thực 6 số bảo mật'
            }
          </p>
        </div>

        {/* Step Indicator Progress */}
        <div className="flex items-center justify-center gap-2">
          <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
            step === 1 ? 'bg-sky-100 text-sky-700' : 'bg-green-100 text-green-700'
          }`}>
            {step === 2 ? <CheckCircle2 className="w-3.5 h-3.5" /> : <span>1</span>}
            <span>Thông tin</span>
          </div>
          <div className="w-6 h-0.5 bg-gray-200" />
          <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
            step === 2 ? 'bg-sky-600 text-white' : 'bg-gray-100 text-gray-400'
          }`}>
            <span>2</span>
            <span>Xác thực OTP</span>
          </div>
        </div>

        {/* Notifications */}
        {errorMsg && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-medium leading-relaxed">
            {errorMsg}
          </div>
        )}

        {infoMsg && (
          <div className="p-3.5 bg-sky-50 border border-sky-200 text-sky-800 text-xs rounded-xl font-medium leading-relaxed">
            {infoMsg}
          </div>
        )}

        {/* STEP 1: FORM INPUT */}
        {step === 1 && (
          <>
            {/* Role Switcher Tabs */}
            <div className="flex bg-gray-100 p-1 rounded-2xl">
              <button
                type="button"
                onClick={() => setRole('student')}
                className={`flex-1 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  role === 'student' ? 'bg-white text-sky-700 shadow-xs' : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                <User className="w-4 h-4" /> Sinh Viên / Ứng Viên
              </button>
              <button
                type="button"
                onClick={() => setRole('company')}
                className={`flex-1 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  role === 'company' ? 'bg-white text-purple-700 shadow-xs' : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                <Building2 className="w-4 h-4" /> Nhà Tuyển Dụng
              </button>
            </div>

            <form onSubmit={handleRequestOtp} className="space-y-4">
              {role === 'student' ? (
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Họ Và Tên</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                      <User className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Nguyễn Văn A"
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-hidden focus:border-sky-500"
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Tên Công Ty / Doanh Nghiệp</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      required
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="Công ty TNHH Công Nghệ ABC"
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-hidden focus:border-purple-500"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Địa Chỉ Email Nhận OTP</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-hidden focus:border-sky-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Mật Khẩu</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Tối thiểu 6 ký tự"
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-hidden focus:border-sky-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Xác Nhận Mật Khẩu</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Nhập lại mật khẩu"
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-hidden focus:border-sky-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className={`w-full py-3.5 text-white font-bold text-sm rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer ${
                  role === 'student'
                    ? 'bg-sky-600 hover:bg-sky-700 shadow-sky-100'
                    : 'bg-purple-600 hover:bg-purple-700 shadow-purple-100'
                }`}
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Đang gửi mã OTP qua Email...</span>
                  </>
                ) : (
                  <>
                    <span>Tiếp Tục & Nhận Mã OTP</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </>
        )}

        {/* STEP 2: OTP VERIFICATION */}
        {step === 2 && (
          <form onSubmit={handleVerifyAndRegister} className="space-y-5">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
              <div>
                <div className="text-[11px] text-gray-500 font-semibold uppercase">Email xác nhận</div>
                <div className="text-xs font-bold text-slate-800">{email}</div>
              </div>
              <button
                type="button"
                onClick={() => { setStep(1); setErrorMsg(''); setInfoMsg(''); }}
                className="text-xs font-bold text-sky-600 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Đổi Email
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-2 text-center">
                Nhập 6 Chữ Số Mã OTP
              </label>
              <div className="relative max-w-[240px] mx-auto">
                <input
                  type="text"
                  maxLength={6}
                  required
                  autoFocus
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  placeholder="••••••"
                  className="w-full text-center text-2xl font-mono tracking-[12px] font-bold py-3 bg-gray-50 border-2 border-sky-400 rounded-2xl focus:outline-hidden focus:border-sky-600 focus:bg-white text-slate-800"
                />
              </div>
            </div>

            <div className="text-center">
              {resendCountdown > 0 ? (
                <span className="text-xs text-gray-400">
                  Gửi lại mã sau <strong>{resendCountdown}s</strong>
                </span>
              ) : (
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={submitting}
                  className="text-xs font-bold text-sky-600 hover:underline inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Gửi lại mã OTP
                </button>
              )}
            </div>

            <button
              type="submit"
              disabled={submitting || otp.length < 6}
              className={`w-full py-3.5 text-white font-bold text-sm rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer ${
                role === 'student'
                  ? 'bg-sky-600 hover:bg-sky-700 shadow-sky-100'
                  : 'bg-purple-600 hover:bg-purple-700 shadow-purple-100'
              }`}
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Đang xác thực OTP & khởi tạo tài khoản...</span>
                </>
              ) : (
                <>
                  <KeyRound className="w-4 h-4" />
                  <span>Xác Nhận & Hoàn Tất Đăng Ký</span>
                </>
              )}
            </button>
          </form>
        )}

        <div className="text-center pt-2 border-t border-gray-100 text-xs text-gray-600">
          Đã có tài khoản?{' '}
          <Link to="/login" className="font-bold text-sky-600 hover:underline">
            Đăng nhập ngay
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
