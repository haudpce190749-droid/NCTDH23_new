import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Building2, Mail, Lock, UserPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [role, setRole] = useState('student');
  const [fullName, setFullName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (password !== confirmPassword) {
      setErrorMsg('Mật khẩu nhập lại không trùng khớp.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Mật khẩu phải có tối thiểu 6 ký tự.');
      return;
    }

    if (role === 'student' && !fullName.trim()) {
      setErrorMsg('Vui lòng nhập Họ và Tên của bạn.');
      return;
    }

    if (role === 'company' && !companyName.trim()) {
      setErrorMsg('Vui lòng nhập Tên Công Ty / Doanh Nghiệp.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        role,
        email: email.trim().toLowerCase(),
        password,
        fullName: role === 'student' ? fullName.trim() : undefined,
        companyName: role === 'company' ? companyName.trim() : undefined,
      };

      const newUser = await register(payload);
      if (newUser.role === 'student') {
        navigate('/student/dashboard');
      } else {
        navigate('/company/dashboard');
      }
    } catch (err) {
      setErrorMsg(
        err.response?.data?.error ||
        'Đăng ký thất bại. Vui lòng kiểm tra lại thông tin hoặc kiểm tra kết nối mạng.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-gray-100 shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <img src="/logo.png" alt="EduJob Logo" className="w-14 h-14 object-contain mx-auto shadow-xs rounded-xl" />
          <h2 className="text-2xl font-extrabold text-slate-900">Tạo Tài Khoản Mới</h2>
          <p className="text-xs text-gray-500">Tham gia hệ thống tuyển dụng việc làm EduJob</p>
        </div>

        {/* Role Switcher Tabs */}
        <div className="flex bg-gray-100 p-1 rounded-2xl">
          <button
            type="button"
            onClick={() => setRole('student')}
            className={`flex-1 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
              role === 'student' ? 'bg-white text-sky-700 shadow-xs' : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            <User className="w-4 h-4" /> Sinh Viên / Ứng Viên
          </button>
          <button
            type="button"
            onClick={() => setRole('company')}
            className={`flex-1 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
              role === 'company' ? 'bg-white text-purple-700 shadow-xs' : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            <Building2 className="w-4 h-4" /> Nhà Tuyển Dụng
          </button>
        </div>

        {errorMsg && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-medium">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
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
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Địa Chỉ Email</label>
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
            className={`w-full py-3.5 text-white font-bold text-sm rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 ${
              role === 'student'
                ? 'bg-sky-600 hover:bg-sky-700 shadow-sky-100'
                : 'bg-purple-600 hover:bg-purple-700 shadow-purple-100'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            {submitting ? 'Đang khởi tạo tài khoản...' : `Hoàn Tất Đăng Ký (${role === 'student' ? 'Sinh Viên' : 'Công Ty'})`}
          </button>
        </form>

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
