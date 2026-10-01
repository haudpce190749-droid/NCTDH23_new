import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, Edit, Trash2, Eye, Users, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import { JobTypeBadge } from '../../components/StatusBadge';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const CompanyJobsPage = () => {
  const { showToast } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchJobs = async () => {
    try {
      const res = await api.get('/companies/jobs/my-jobs');
      setJobs(res.data.jobs);
    } catch (err) {
      console.error('Lỗi lấy danh sách việc làm đã đăng:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleStatusChange = async (jobId, newStatus) => {
    try {
      await api.put(`/jobs/${jobId}`, { status: newStatus });
      showToast(`Đã chuyển trạng thái việc làm thành: ${newStatus}`, 'success');
      fetchJobs();
    } catch (err) {
      showToast('Lỗi cập nhật trạng thái', 'error');
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa tin tuyển dụng này?')) return;
    try {
      await api.delete(`/jobs/${jobId}`);
      showToast('Đã xóa tin tuyển dụng thành công', 'info');
      fetchJobs();
    } catch (err) {
      showToast('Lỗi khi xóa tin tuyển dụng', 'error');
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-10 space-y-4">
        <div className="bg-white rounded-3xl p-8 border border-gray-100 animate-pulse h-64"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Tin Tuyển Dụng Đã Đăng ({jobs.length})</h1>
          <p className="text-xs text-gray-500 mt-1">Quản lý nội dung, xuất bản hoặc đóng các tin tuyển dụng của công ty.</p>
        </div>

        <Link
          to="/company/jobs/create"
          className="px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2"
        >
          <PlusCircle className="w-4 h-4" /> Đăng Tin Mới
        </Link>
      </div>

      {jobs.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 space-y-3">
          <FileText className="w-12 h-12 text-gray-300 mx-auto" />
          <h3 className="text-lg font-bold text-gray-800">Chưa có tin tuyển dụng nào</h3>
          <p className="text-xs text-gray-500">Tạo tin tuyển dụng đầu tiên để tìm kiếm ứng viên tài năng.</p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-xs overflow-hidden divide-y divide-gray-100">
          {jobs.map((job) => (
            <div key={job.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-gray-50/50 transition-colors">
              <div className="space-y-1.5 max-w-xl">
                <div className="flex flex-wrap items-center gap-2">
                  <JobTypeBadge type={job.job_type} />
                  <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-md ${
                    job.status === 'published' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                    job.status === 'draft' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                    'bg-gray-100 text-gray-600 border border-gray-200'
                  }`}>
                    {job.status === 'published' ? 'Đang hiển thị' : job.status === 'draft' ? 'Bản nháp' : 'Đã đóng'}
                  </span>
                </div>

                <Link to={`/jobs/${job.id}`} className="text-base font-bold text-gray-900 hover:text-sky-600 block">
                  {job.title}
                </Link>

                <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 font-medium">
                  <span>Địa điểm: {job.location}</span>
                  <span>Ngành: {job.category}</span>
                  <span className="text-sky-700 font-bold flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" /> {job.applicants_count || 0} ứng viên nộp
                  </span>
                  <span>Lượt xem: {job.views_count || 0}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 flex-wrap">
                <Link
                  to={`/company/applicants?jobId=${job.id}`}
                  className="px-3.5 py-2 bg-sky-50 text-sky-700 hover:bg-sky-100 font-bold text-xs rounded-xl flex items-center gap-1"
                >
                  <Users className="w-3.5 h-3.5" /> Xem Ứng Viên ({job.applicants_count || 0})
                </Link>

                <Link
                  to={`/company/jobs/edit/${job.id}`}
                  className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl"
                  title="Chỉnh sửa tin"
                >
                  <Edit className="w-4 h-4" />
                </Link>

                {job.status === 'published' ? (
                  <button
                    onClick={() => handleStatusChange(job.id, 'closed')}
                    className="px-3 py-2 bg-amber-50 text-amber-700 hover:bg-amber-100 rounded-xl text-xs font-semibold"
                  >
                    Tạm Đóng
                  </button>
                ) : (
                  <button
                    onClick={() => handleStatusChange(job.id, 'published')}
                    className="px-3 py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-xl text-xs font-semibold"
                  >
                    Xuất Bản
                  </button>
                )}

                <button
                  onClick={() => handleDeleteJob(job.id)}
                  className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl"
                  title="Xóa tin"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CompanyJobsPage;
