import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GraduationCap, Mail, Lock, LogIn, ArrowRight, UserCheck, Building2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const { login, showToast } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSubmitting(true);

    try {
      const loggedUser = await login(email, password);
      if (loggedUser.role === 'student') {
        navigate('/student/dashboard');
      } else if (loggedUser.role === 'company') {
        navigate('/company/dashboard');
      } else {
        navigate('/');
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.error || 'Đăng nhập không thành công. Vui lòng kiểm tra lại email và mật khẩu.');
    } finally {
      setSubmitting(false);
    }
  };

  const fillDemoAccount = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setErrorMsg('');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-gray-100 shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-600 to-blue-500 mx-auto flex items-center justify-center text-white shadow-md shadow-sky-100">
            <GraduationCap className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900">Đăng Nhập Tài Khoản</h2>
          <p className="text-xs text-gray-500">Chào mừng bạn quay trở lại với Cổng Việc Làm Sinh Viên EduJob</p>
        </div>

        {errorMsg && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-medium">
            {errorMsg}
          </div>
        )}

        {/* Demo Quick Fill Buttons */}
        <div className="bg-sky-50/60 p-3.5 rounded-2xl border border-sky-100 space-y-2">
          <span className="text-[11px] font-bold text-sky-800 block uppercase tracking-wider">Tài khoản thử nghiệm (Demo):</span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => fillDemoAccount('student@example.com', 'student123')}
              className="flex-1 py-1.5 px-2 bg-white hover:bg-sky-100 text-sky-800 text-xs font-semibold rounded-lg border border-sky-200 shadow-2xs flex items-center justify-center gap-1"
            >
              <UserCheck className="w-3.5 h-3.5" /> Demo Sinh Viên
            </button>
            <button
              type="button"
              onClick={() => fillDemoAccount('company@example.com', 'company123')}
              className="flex-1 py-1.5 px-2 bg-white hover:bg-purple-100 text-purple-800 text-xs font-semibold rounded-lg border border-purple-200 shadow-2xs flex items-center justify-center gap-1"
            >
              <Building2 className="w-3.5 h-3.5" /> Demo Công Ty
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
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
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-gray-700 uppercase">Mật Khẩu</label>
              <Link to="/forgot-password" className="text-xs font-semibold text-sky-600 hover:underline">
                Quên mật khẩu?
              </Link>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-hidden focus:border-sky-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 bg-sky-600 hover:bg-sky-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-sky-100 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <LogIn className="w-4 h-4" />
            {submitting ? 'Đang xác thực...' : 'Đăng Nhập'}
          </button>
        </form>

        <div className="text-center pt-2 border-t border-gray-100 text-xs text-gray-600">
          Chưa có tài khoản?{' '}
          <Link to="/register" className="font-bold text-sky-600 hover:underline">
            Đăng ký ngay tại đây
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
