import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Building2, MapPin, Globe, Users, Phone, Mail, Briefcase, ChevronRight } from 'lucide-react';
import JobCard from '../components/JobCard';
import api from '../services/api';

const CompanyDetailPage = () => {
  const { id } = useParams();
  const [company, setCompany] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompanyDetail = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/companies/${id}`);
        setCompany(res.data.company);
        setJobs(res.data.jobs);
      } catch (err) {
        console.error('Lỗi lấy chi tiết công ty:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCompanyDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-3xl p-8 border border-gray-100 animate-pulse h-96"></div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-800">Không Tìm Thấy Công Ty</h2>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row items-start gap-6">
          <div className="w-24 h-24 rounded-2xl bg-gray-50 border border-gray-100 p-3 flex items-center justify-center flex-shrink-0 shadow-xs">
            {company.logo ? (
              <img src={company.logo} alt={company.company_name} className="w-full h-full object-contain rounded-xl" />
            ) : (
              <Building2 className="w-12 h-12 text-gray-400" />
            )}
          </div>

          <div className="space-y-2 flex-1">
            <div className="inline-block px-3 py-1 bg-sky-50 text-sky-700 font-semibold text-xs rounded-md">
              {company.industry || 'Công nghệ thông tin'}
            </div>
            <h1 className="text-3xl font-extrabold text-gray-900">{company.company_name}</h1>

            <div className="flex flex-wrap gap-4 text-xs font-medium text-gray-600 pt-1">
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4 text-gray-400" />
                {company.location || 'Hà Nội / TP.HCM'}
              </span>
              <span className="flex items-center gap-1">
                <Users className="w-4 h-4 text-gray-400" />
                {company.company_size || '100+ nhân viên'}
              </span>
              {company.website && (
                <a href={company.website} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-sky-600 hover:underline">
                  <Globe className="w-4 h-4" />
                  {company.website}
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Description & Job Openings */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-xs space-y-4">
            <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3">Giới Thiệu Doanh Nghiệp</h2>
            <div className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">{company.description}</div>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900 flex items-center justify-between">
              <span>Vị Trí Việc Làm Đang Tuyển ({jobs.length})</span>
            </h2>

            {jobs.length === 0 ? (
              <div className="bg-white p-8 text-center rounded-2xl border border-gray-100 text-gray-500 text-sm">
                Hiện tại doanh nghiệp chưa có vị trí đang đăng tuyển.
              </div>
            ) : (
              <div className="space-y-4">
                {jobs.map((job) => (
                  <JobCard key={job.id} job={{ ...job, company_name: company.company_name, company_logo: company.logo }} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs space-y-4">
            <h3 className="font-bold text-gray-900 text-base border-b border-gray-100 pb-3">Liên Hệ Nhà Tuyển Dụng</h3>
            <div className="space-y-3 text-xs text-gray-600">
              {company.contact_email && (
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-sky-600" />
                  <span>{company.contact_email}</span>
                </div>
              )}
              {company.contact_phone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-sky-600" />
                  <span>{company.contact_phone}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyDetailPage;
