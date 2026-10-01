import React, { useState, useEffect } from 'react';
import { Upload, FileText, Download, Trash2, CheckCircle2, AlertCircle, Eye, ExternalLink } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const StudentCvPage = () => {
  const { showToast, refreshUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const fetchProfile = async () => {
    try {
      const res = await api.get('/students/profile');
      setProfile(res.data.profile);
    } catch (err) {
      console.error('Lỗi lấy CV:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      showToast('Kích thước tệp quá lớn. Vui lòng chọn tệp dưới 5MB.', 'error');
      return;
    }

    const formData = new FormData();
    formData.append('cv', file);

    setUploading(true);
    try {
      const res = await api.post('/students/cv', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      showToast(res.data.message, 'success');
      fetchProfile();
      refreshUser();
    } catch (err) {
      showToast(err.response?.data?.error || 'Lỗi khi tải lên CV', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteCv = async () => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa CV này?')) return;

    try {
      const res = await api.delete('/students/cv');
      showToast(res.data.message, 'info');
      fetchProfile();
      refreshUser();
    } catch (err) {
      showToast('Lỗi khi xóa CV', 'error');
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="bg-white rounded-3xl p-8 border border-gray-100 animate-pulse h-64"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900">Quản Lý Hồ Sơ CV</h1>
        <p className="text-xs text-gray-500 mt-1">Tải lên hoặc thay thế CV định dạng PDF, DOC, DOCX để ứng tuyển nhanh chóng.</p>
      </div>

      {/* Main CV Card */}
      <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
        {profile?.cv_url ? (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 bg-sky-50/60 border border-sky-100 rounded-2xl">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-sky-600 text-white flex items-center justify-center font-bold flex-shrink-0">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-sm truncate max-w-xs">{profile.cv_filename}</h3>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    Cập nhật gần nhất: {profile.cv_updated_at ? new Date(profile.cv_updated_at).toLocaleDateString('vi-VN') : 'Mới đây'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={profile.cv_url}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 bg-white hover:bg-sky-100 text-sky-700 font-bold text-xs rounded-xl border border-sky-200 transition-colors flex items-center gap-1.5"
                >
                  <Eye className="w-4 h-4" /> Xem / Tải CV
                </a>
                <button
                  onClick={handleDeleteCv}
                  className="p-2 bg-white hover:bg-rose-50 text-rose-600 rounded-xl border border-rose-200 transition-colors"
                  title="Xóa CV"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Replace CV Dropzone */}
            <div className="border-2 border-dashed border-gray-200 hover:border-sky-300 rounded-2xl p-6 text-center space-y-2 transition-colors">
              <Upload className="w-8 h-8 text-gray-400 mx-auto" />
              <p className="text-xs font-bold text-gray-700">Thay thế bằng CV mới</p>
              <p className="text-[11px] text-gray-400">Hỗ trợ tệp PDF, DOC, DOCX (Dung lượng tối đa 5MB)</p>
              <label className="inline-block mt-2">
                <span className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl cursor-pointer shadow-md inline-block">
                  {uploading ? 'Đang tải tệp...' : 'Chọn Tệp Để Thay Thế'}
                </span>
                <input type="file" accept=".pdf,.doc,.docx" onChange={handleFileUpload} disabled={uploading} className="hidden" />
              </label>
            </div>
          </div>
        ) : (
          <div className="border-2 border-dashed border-sky-200 bg-sky-50/30 rounded-3xl p-10 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-sky-100 text-sky-600 mx-auto flex items-center justify-center">
              <Upload className="w-8 h-8" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-base">Bạn Chưa Tải CV Lên Hệ Thống</h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto mt-1">
                Tải tệp CV bản mềm của bạn để ứng tuyển nhanh các vị trí việc làm chỉ với 1 cú nhấp chuột.
              </p>
            </div>

            <label className="inline-block">
              <span className="px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl cursor-pointer shadow-lg shadow-sky-100 inline-block">
                {uploading ? 'Đang tải lên...' : 'Tải CV Lên Ngay'}
              </span>
              <input type="file" accept=".pdf,.doc,.docx" onChange={handleFileUpload} disabled={uploading} className="hidden" />
            </label>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentCvPage;
