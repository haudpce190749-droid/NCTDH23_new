import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  User,
  FileText,
  Bookmark,
  TrendingUp,
  Briefcase,
  CheckCircle2,
  Clock,
  ArrowRight,
  Upload,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { ApplicationStatusBadge } from '../../components/StatusBadge';
import JobCard from '../../components/JobCard';
import api from '../../services/api';

const StudentDashboard = () => {
  const [profile, setProfile] = useState(null);
  const [applications, setApplications] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [profRes, appRes, savedRes, jobsRes] = await Promise.all([
          api.get('/students/profile'),
          api.get('/applications/my-applications'),
          api.get('/saved-jobs/my-saved'),
          api.get('/jobs?limit=3')
        ]);

        setProfile(profRes.data.profile);
        setApplications(appRes.data.applications);
        setSavedJobs(savedRes.data.jobs);
        setRecommendedJobs(jobsRes.data.jobs);
      } catch (err) {
        console.error('Lỗi lấy dữ liệu dashboard sinh viên:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
        <div className="bg-white rounded-3xl p-8 border border-gray-100 animate-pulse h-40"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-3xl p-6 border border-gray-100 animate-pulse h-32"></div>
          <div className="bg-white rounded-3xl p-6 border border-gray-100 animate-pulse h-32"></div>
          <div className="bg-white rounded-3xl p-6 border border-gray-100 animate-pulse h-32"></div>
        </div>
      </div>
    );
  }

  const completionPct = profile?.completionPercentage || 50;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-sky-700 via-blue-700 to-indigo-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <span className="text-xs font-semibold px-3 py-1 bg-white/20 rounded-full inline-block">
            Bảng Điều Khiển Sinh Viên
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold">
            Xin chào, {profile?.full_name || 'Bạn sinh viên'}!
          </h1>
          <p className="text-sky-100 text-xs sm:text-sm max-w-xl">
            {profile?.university ? `${profile.university} - Chuyên ngành ${profile.major || ''}` : 'Chào mừng bạn quay trở lại. Hãy hoàn thiện hồ sơ để ứng tuyển ngay.'}
          </p>
        </div>

        <div className="flex gap-3">
          <Link
            to="/student/profile"
            className="px-5 py-2.5 bg-white text-sky-800 rounded-xl font-bold text-xs shadow-md hover:bg-sky-50 transition-colors"
          >
            Chỉnh Sửa Hồ Sơ
          </Link>
          <Link
            to="/student/cv"
            className="px-5 py-2.5 bg-sky-900/60 hover:bg-sky-900 text-white rounded-xl font-bold text-xs border border-sky-400/30 transition-colors flex items-center gap-1.5"
          >
            <Upload className="w-3.5 h-3.5" /> Quản Lý CV
          </Link>
        </div>
      </div>

      {/* Completion Indicator & Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Profile Completion Indicator */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs space-y-3 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase">Hoàn Thiện Hồ Sơ</span>
            <span className="text-xs font-extrabold text-sky-600">{completionPct}%</span>
          </div>

          <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-sky-500 to-blue-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${completionPct}%` }}
            ></div>
          </div>

          <p className="text-[11px] text-gray-500">
            {completionPct < 80 ? 'Thêm kỹ năng, dự án & CV để tăng cơ hội trúng tuyển' : 'Hồ sơ của bạn đã rất ấn tượng!'}
          </p>
        </div>

        {/* Stats 1: Applied */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center flex-shrink-0">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-extrabold text-gray-900 block">{applications.length}</span>
            <span className="text-xs text-gray-500 font-medium">Việc làm đã nộp</span>
          </div>
        </div>

        {/* Stats 2: Saved */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
            <Bookmark className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-extrabold text-gray-900 block">{savedJobs.length}</span>
            <span className="text-xs text-gray-500 font-medium">Việc làm đã lưu</span>
          </div>
        </div>

        {/* Stats 3: Interview / Status */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-extrabold text-gray-900 block">
              {applications.filter((a) => ['shortlisted', 'interview', 'accepted'].includes(a.status)).length}
            </span>
            <span className="text-xs text-gray-500 font-medium">Phản hồi tích cực</span>
          </div>
        </div>
      </div>

      {/* Main Row: Recent Applications & Recommended Jobs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Recent Applications */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">Hồ Sơ Nộp Mới Nhất</h2>
            <Link to="/student/applications" className="text-xs font-semibold text-sky-600 hover:underline flex items-center gap-1">
              Xem tất cả <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {applications.length === 0 ? (
            <div className="bg-white p-8 rounded-3xl border border-gray-100 text-center space-y-3">
              <Briefcase className="w-10 h-10 text-gray-300 mx-auto" />
              <p className="text-xs text-gray-500">Bạn chưa nộp hồ sơ cho công việc nào.</p>
              <Link to="/jobs" className="px-4 py-2 bg-sky-600 text-white rounded-xl text-xs font-semibold inline-block">
                Khám phá việc làm ngay
              </Link>
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-gray-100 shadow-xs overflow-hidden divide-y divide-gray-100">
              {applications.slice(0, 4).map((app) => (
                <div key={app.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-gray-50/50 transition-colors">
                  <div className="space-y-1">
                    <Link to={`/jobs/${app.job_id}`} className="font-bold text-gray-900 text-sm hover:text-sky-600 block">
                      {app.job_title}
                    </Link>
                    <span className="text-xs text-gray-500 font-medium block">{app.company_name}</span>
                    <span className="text-[11px] text-gray-400 block">
                      Nộp ngày: {new Date(app.applied_at).toLocaleDateString('vi-VN')}
                    </span>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3">
                    <ApplicationStatusBadge status={app.status} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right 1 Col: Recommended Jobs */}
        <div className="lg:col-span-1 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-sky-600" /> Gợi Ý Việc Làm
            </h2>
            <Link to="/jobs" className="text-xs font-semibold text-sky-600 hover:underline">
              Tất cả
            </Link>
          </div>

          <div className="space-y-4">
            {recommendedJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
