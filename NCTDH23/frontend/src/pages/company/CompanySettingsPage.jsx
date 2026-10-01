import React, { useState } from 'react';
import { Settings, KeyRound } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const CompanySettingsPage = () => {
  const { showToast } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      showToast('Mật khẩu mới nhập lại không trùng khớp', 'error');
      return;
    }
    if (newPassword.length < 6) {
      showToast('Mật khẩu mới tối thiểu 6 ký tự', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.post('/auth/change-password', {
        currentPassword,
        newPassword
      });
      showToast(res.data.message, 'success');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      showToast(err.response?.data?.error || 'Lỗi khi đổi mật khẩu', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900 flex items-center gap-2">
          <Settings className="w-6 h-6 text-purple-600" /> Cài Đặt Tài Khoản Doanh Nghiệp
        </h1>
        <p className="text-xs text-gray-500 mt-1">Quản lý bảo mật tài khoản nhà tuyển dụng.</p>
      </div>

      <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
        <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-2">
          <KeyRound className="w-5 h-5 text-purple-600" /> Đổi Mật Khẩu
        </h2>

        <form onSubmit={handleChangePassword} className="space-y-4 max-w-md text-xs">
          <div>
            <label className="block font-bold text-gray-700 uppercase mb-1">Mật Khẩu Hiện Tại</label>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl"
            />
          </div>

          <div>
            <label className="block font-bold text-gray-700 uppercase mb-1">Mật Khẩu Mới</label>
            <input
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Tối thiểu 6 ký tự"
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl"
            />
          </div>

          <div>
            <label className="block font-bold text-gray-700 uppercase mb-1">Xác Nhận Mật Khẩu Mới</label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-md disabled:opacity-50"
            >
              {submitting ? 'Đang lưu...' : 'Lưu Mật Khẩu Mới'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CompanySettingsPage;
