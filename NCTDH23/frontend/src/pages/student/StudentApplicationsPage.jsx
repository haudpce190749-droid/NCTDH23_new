import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Building2, MapPin, DollarSign, Calendar, Eye, Filter } from 'lucide-react';
import { ApplicationStatusBadge } from '../../components/StatusBadge';
import api from '../../services/api';

const StudentApplicationsPage = () => {
  const [applications, setApplications] = useState([]);
  const [filterStatus, setFilterStatus] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await api.get('/applications/my-applications');
        setApplications(res.data.applications);
      } catch (err) {
        console.error('Lỗi danh sách việc làm đã nộp:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  const filteredApps = filterStatus
    ? applications.filter((app) => app.status === filterStatus)
    : applications;

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-10 space-y-4">
        <div className="bg-white rounded-3xl p-8 border border-gray-100 animate-pulse h-64"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Quản Lý Hồ Sơ Ứng Tuyển ({applications.length})</h1>
          <p className="text-xs text-gray-500 mt-1">Theo dõi phản hồi và trạng thái xử lý hồ sơ từ phía doanh nghiệp.</p>
        </div>

        {/* Filter dropdown */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="p-2.5 bg-white border border-gray-200 rounded-xl text-xs font-semibold text-gray-800"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="submitted">Đã nộp hồ sơ</option>
            <option value="reviewing">Đang xem xét</option>
            <option value="shortlisted">Phù hợp / Tiềm năng</option>
            <option value="interview">Mời phỏng vấn</option>
            <option value="accepted">Trúng tuyển</option>
            <option value="rejected">Từ chối</option>
          </select>
        </div>
      </div>

      {filteredApps.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 space-y-3">
          <FileText className="w-12 h-12 text-gray-300 mx-auto" />
          <h3 className="text-lg font-bold text-gray-800">Không tìm thấy hồ sơ ứng tuyển</h3>
          <p className="text-xs text-gray-500">Bạn chưa nộp hồ sơ hoặc không có kết quả phù hợp với bộ lọc.</p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-xs overflow-hidden divide-y divide-gray-100">
          {filteredApps.map((app) => (
            <div key={app.id} className="p-6 space-y-4 hover:bg-gray-50/50 transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-gray-50 border border-gray-100 p-1 flex items-center justify-center flex-shrink-0">
                    {app.company_logo ? (
                      <img src={app.company_logo} alt={app.company_name} className="w-full h-full object-contain rounded-lg" />
                    ) : (
                      <Building2 className="w-6 h-6 text-gray-400" />
                    )}
                  </div>

                  <div>
                    <Link to={`/jobs/${app.job_id}`} className="font-bold text-gray-900 text-base hover:text-sky-600 block">
                      {app.job_title}
                    </Link>
                    <span className="text-xs font-semibold text-gray-600 block mt-0.5">{app.company_name}</span>
                    <div className="flex flex-wrap gap-3 text-xs text-gray-500 mt-2">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-gray-400" /> {app.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-gray-400" /> Nộp ngày: {new Date(app.applied_at).toLocaleDateString('vi-VN')}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:items-end gap-2">
                  <ApplicationStatusBadge status={app.status} />
                  {app.notes && (
                    <span className="text-xs bg-amber-50 text-amber-800 p-2 rounded-xl font-medium max-w-xs">
                      Ghi chú từ NTD: {app.notes}
                    </span>
                  )}
                </div>
              </div>

              {/* Cover Letter preview */}
              {app.cover_letter && (
                <div className="bg-gray-50 p-3 rounded-xl text-xs text-gray-600 border border-gray-100">
                  <span className="font-bold text-gray-800 block mb-1">Thư giới thiệu:</span>
                  <p className="line-clamp-2 leading-relaxed">{app.cover_letter}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentApplicationsPage;
