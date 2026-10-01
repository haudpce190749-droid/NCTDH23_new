import React from 'react';

export const ApplicationStatusBadge = ({ status }) => {
  const configs = {
    submitted: { label: 'Đã nộp hồ sơ', color: 'bg-blue-50 text-blue-700 border-blue-200' },
    reviewing: { label: 'Đang xem xét', color: 'bg-purple-50 text-purple-700 border-purple-200' },
    shortlisted: { label: 'Phù hợp / Tiềm năng', color: 'bg-amber-50 text-amber-700 border-amber-200' },
    interview: { label: 'Mời phỏng vấn', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
    accepted: { label: 'Trúng tuyển / Đã nhận', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    rejected: { label: 'Từ chối', color: 'bg-rose-50 text-rose-700 border-rose-200' }
  };

  const config = configs[status] || { label: status, color: 'bg-gray-100 text-gray-700 border-gray-200' };

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${config.color}`}>
      <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-current"></span>
      {config.label}
    </span>
  );
};

export const JobTypeBadge = ({ type }) => {
  const colors = {
    'Full-time': 'bg-sky-50 text-sky-700 border-sky-200',
    'Part-time': 'bg-amber-50 text-amber-700 border-amber-200',
    'Internship': 'bg-emerald-50 text-emerald-700 border-emerald-200',
    'Freelance': 'bg-purple-50 text-purple-700 border-purple-200'
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium border ${colors[type] || 'bg-gray-100 text-gray-700'}`}>
      {type}
    </span>
  );
};

export const WorkLocationBadge = ({ type }) => {
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
      {type}
    </span>
  );
};
