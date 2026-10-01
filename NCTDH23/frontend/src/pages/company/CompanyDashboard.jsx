import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  Briefcase,
  Users,
  PlusCircle,
  TrendingUp,
  FileText,
  Clock,
  ChevronRight,
  Eye,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { ApplicationStatusBadge } from '../../components/StatusBadge';
import api from '../../services/api';

const CompanyDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get('/companies/dashboard/me');
        setDashboardData(res.data);
      } catch (err) {
        console.error('Lỗi dashboard nhà tuyển dụng:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-10 space-y-6">
        <div className="bg-white rounded-3xl p-8 border border-gray-100 animate-pulse h-40"></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="bg-white rounded-3xl p-6 border border-gray-100 animate-pulse h-32"></div>
          ))}
        </div>
      </div>
    );
  }

  const company = dashboardData?.company;
  const stats = dashboardData?.stats;
  const recentApps = dashboardData?.recentApplications || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-white p-2 flex items-center justify-center flex-shrink-0 shadow-md">
            {company?.logo ? (
              <img src={company.logo} alt={company.company_name} className="w-full h-full object-contain rounded-xl" />
            ) : (
              <Building2 className="w-8 h-8 text-sky-800" />
            )}
          </div>
          <div>
            <span className="text-xs font-semibold px-3 py-1 bg-white/10 rounded-full inline-block mb-1 text-sky-200">
              Kênh Nhà Tuyển Dụng
            </span>
            <h1 className="text-2xl font-extrabold">{company?.company_name}</h1>
            <p className="text-xs text-slate-300 mt-0.5">{company?.industry || 'Doanh Nghiệp'} • {company?.location || 'Việt Nam'}</p>
          </div>
        </div>

        <div className="flex gap-3 w-full md:w-auto">
          <Link
            to="/company/jobs/create"
            className="flex-1 md:flex-none px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-900/40 transition-colors flex items-center justify-center gap-2"
          >
            <PlusCircle className="w-4 h-4" /> Đăng Tin Mới
          </Link>
          <Link
            to="/company/profile"
            className="flex-1 md:flex-none px-5 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl border border-slate-700 transition-colors text-center"
          >
            Sửa Trang Công Ty
          </Link>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-extrabold text-gray-900 block">{stats?.activeJobs || 0}</span>
            <span className="text-xs text-gray-500 font-medium">Tin đang tuyển</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center flex-shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-extrabold text-gray-900 block">{stats?.totalApplications || 0}</span>
            <span className="text-xs text-gray-500 font-medium">Tổng số hồ sơ nhận được</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-extrabold text-gray-900 block">{stats?.draftJobs || 0}</span>
            <span className="text-xs text-gray-500 font-medium">Tin nháp</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center flex-shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-extrabold text-gray-900 block">{stats?.closedJobs || 0}</span>
            <span className="text-xs text-gray-500 font-medium">Tin đã đóng</span>
          </div>
        </div>
      </div>

      {/* Recent Applications Table */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Ứng Viên Mới Nộp Hồ Sơ</h2>
            <p className="text-xs text-gray-500 mt-0.5">Danh sách các hồ sơ ứng tuyển cần xem xét xử lý</p>
          </div>
          <Link to="/company/applicants" className="text-xs font-semibold text-sky-600 hover:underline flex items-center gap-1">
            Xem tất cả hồ sơ <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentApps.length === 0 ? (
          <div className="p-8 text-center text-gray-500 text-xs">Chưa có ứng viên mới nộp hồ sơ.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-gray-100 text-gray-400 font-bold uppercase">
                  <th className="pb-3">Ứng Viên</th>
                  <th className="pb-3">Vị Trí Ứng Tuyển</th>
                  <th className="pb-3">Ngày Nộp</th>
                  <th className="pb-3">Trạng Thái</th>
                  <th className="pb-3 text-right">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium text-gray-700">
                {recentApps.map((app) => (
                  <tr key={app.id} className="hover:bg-gray-50/60">
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-sky-100 text-sky-700 font-bold flex items-center justify-center text-xs">
                          {(app.student_name || 'S')[0]}
                        </div>
                        <span className="font-bold text-gray-900">{app.student_name}</span>
                      </div>
                    </td>
                    <td className="py-4 font-semibold text-sky-700">{app.job_title}</td>
                    <td className="py-4 text-gray-500">{new Date(app.applied_at).toLocaleDateString('vi-VN')}</td>
                    <td className="py-4">
                      <ApplicationStatusBadge status={app.status} />
                    </td>
                    <td className="py-4 text-right">
                      <Link
                        to={`/company/applicants?jobId=${app.job_id}`}
                        className="px-3 py-1.5 bg-sky-50 text-sky-700 rounded-lg hover:bg-sky-100 font-semibold"
                      >
                        Chi tiết
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyDashboard;
