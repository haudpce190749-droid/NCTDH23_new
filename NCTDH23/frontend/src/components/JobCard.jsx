import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapPin, DollarSign, Clock, Bookmark, Building2, CheckCircle2 } from 'lucide-react';
import { JobTypeBadge, WorkLocationBadge } from './StatusBadge';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const JobCard = ({ job, isSavedInitial = false, onSaveToggle }) => {
  const { user, showToast } = useAuth();
  const navigate = useNavigate();
  const [isSaved, setIsSaved] = useState(isSavedInitial);
  const [saving, setSaving] = useState(false);

  const formatSalary = (min, max, negotiable) => {
    if (negotiable) return 'Thỏa thuận';
    if (!min && !max) return 'Thỏa thuận';
    const formatNumber = (num) => (num >= 1000000 ? `${(num / 1000000).toFixed(0)} tr` : `${num / 1000}k`);
    if (min && max) return `${formatNumber(min)} - ${formatNumber(max)} VNĐ`;
    if (min) return `Từ ${formatNumber(min)} VNĐ`;
    if (max) return `Đến ${formatNumber(max)} VNĐ`;
    return 'Thỏa thuận';
  };

  const handleSave = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      showToast('Vui lòng đăng nhập tài khoản sinh viên để lưu công việc', 'info');
      navigate('/login');
      return;
    }

    if (user.role !== 'student') {
      showToast('Chỉ tài khoản sinh viên mới có thể lưu việc làm', 'error');
      return;
    }

    try {
      setSaving(true);
      const res = await api.post('/saved-jobs/toggle', { jobId: job.id });
      setIsSaved(res.data.saved);
      showToast(res.data.message, res.data.saved ? 'success' : 'info');
      if (onSaveToggle) onSaveToggle(job.id, res.data.saved);
    } catch (err) {
      showToast('Lỗi khi thao tác lưu việc làm', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-xs hover:shadow-md hover:border-sky-200 transition-all group relative flex flex-col justify-between">
      <div>
        {/* Header: Logo, Title & Save */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center p-1.5 flex-shrink-0 group-hover:scale-105 transition-transform">
              {job.company_logo ? (
                <img src={job.company_logo} alt={job.company_name} className="w-full h-full object-contain rounded-lg" />
              ) : (
                <Building2 className="w-6 h-6 text-gray-400" />
              )}
            </div>
            <div>
              <Link to={`/jobs/${job.id}`} className="text-base font-bold text-gray-900 group-hover:text-sky-600 transition-colors line-clamp-1">
                {job.title}
              </Link>
              <Link to={`/companies/${job.company_id || 1}`} className="text-xs font-semibold text-gray-600 hover:text-sky-600 flex items-center gap-1 mt-0.5">
                {job.company_name}
              </Link>
            </div>
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className={`p-2 rounded-xl border transition-all ${
              isSaved
                ? 'bg-sky-50 border-sky-200 text-sky-600'
                : 'bg-white border-gray-200 text-gray-400 hover:text-sky-600 hover:border-sky-200'
            }`}
            title={isSaved ? 'Đã lưu' : 'Lưu công việc'}
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Badges row */}
        <div className="flex flex-wrap items-center gap-2 mt-4">
          <JobTypeBadge type={job.job_type} />
          <WorkLocationBadge type={job.work_location_type || 'Tại văn phòng'} />
          <span className="text-xs px-2.5 py-0.5 rounded-md bg-gray-100 text-gray-600 font-medium">
            {job.experience_level || 'Thực tập sinh'}
          </span>
        </div>

        {/* Skills list */}
        {job.skills && job.skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {job.skills.slice(0, 4).map((sk, idx) => (
              <span key={idx} className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-sky-50/70 text-sky-700">
                {sk}
              </span>
            ))}
            {job.skills.length > 4 && (
              <span className="text-[11px] text-gray-400">+{job.skills.length - 4}</span>
            )}
          </div>
        )}
      </div>

      {/* Footer Info: Salary, Location, Deadline */}
      <div className="pt-4 mt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center gap-1 font-semibold text-emerald-700">
          <DollarSign className="w-3.5 h-3.5" />
          <span>{formatSalary(job.salary_min, job.salary_max, job.salary_negotiable)}</span>
        </div>

        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 truncate max-w-[120px]">
            <MapPin className="w-3.5 h-3.5 text-gray-400" />
            {job.location}
          </span>
          <Link
            to={`/jobs/${job.id}`}
            className="px-3 py-1 rounded-lg bg-sky-50 text-sky-700 hover:bg-sky-600 hover:text-white font-semibold transition-colors"
          >
            Chi tiết
          </Link>
        </div>
      </div>
    </div>
  );
};

export default JobCard;
