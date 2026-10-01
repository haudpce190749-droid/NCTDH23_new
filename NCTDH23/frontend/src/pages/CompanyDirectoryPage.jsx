import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Building2, Search, MapPin, Globe, Users, ExternalLink, Briefcase } from 'lucide-react';
import api from '../services/api';

const CompanyDirectoryPage = () => {
  const [companies, setCompanies] = useState([]);
  const [q, setQ] = useState('');
  const [industry, setIndustry] = useState('');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchCompanies = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (q) params.set('q', q);
      if (industry) params.set('industry', industry);
      if (location) params.set('location', location);

      const res = await api.get(`/companies?${params.toString()}`);
      setCompanies(res.data.companies);
    } catch (err) {
      console.error('Lỗi lấy danh sách công ty:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, [industry, location]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchCompanies();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-sky-800 to-blue-900 rounded-3xl p-8 sm:p-10 text-white shadow-xl space-y-4">
        <h1 className="text-3xl font-extrabold">Danh Bạ Doanh Nghiệp & Đối Tác</h1>
        <p className="text-sky-200 text-sm max-w-2xl leading-relaxed">
          Khám phá môi trường làm việc, thông tin tuyển dụng và văn hóa doanh nghiệp của hàng trăm tập đoàn công nghệ hàng đầu tại Việt Nam.
        </p>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="pt-4 flex flex-col sm:flex-row gap-3 max-w-2xl">
          <div className="flex-1 flex items-center gap-2.5 px-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl">
            <Search className="w-5 h-5 text-sky-200" />
            <input
              type="text"
              placeholder="Nhập tên doanh nghiệp..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="w-full text-sm bg-transparent placeholder-sky-200/70 focus:outline-hidden text-white"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3 bg-sky-500 hover:bg-sky-400 text-slate-900 font-bold text-sm rounded-xl transition-colors shadow-md"
          >
            Tìm Kiếm
          </button>
        </form>
      </div>

      {/* Companies Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="bg-white rounded-3xl p-6 border border-gray-100 animate-pulse h-48"></div>
          ))}
        </div>
      ) : companies.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 space-y-3">
          <Building2 className="w-12 h-12 text-gray-300 mx-auto" />
          <h3 className="text-lg font-bold text-gray-800">Không tìm thấy doanh nghiệp nào</h3>
          <p className="text-sm text-gray-500">Thử tìm kiếm với từ khóa khác</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {companies.map((comp) => (
            <div key={comp.id} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs hover:shadow-md hover:border-sky-200 transition-all flex flex-col justify-between group">
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gray-50 border border-gray-100 p-2 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                    {comp.logo ? (
                      <img src={comp.logo} alt={comp.company_name} className="w-full h-full object-contain rounded-lg" />
                    ) : (
                      <Building2 className="w-7 h-7 text-gray-400" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-base group-hover:text-sky-600 transition-colors">
                      {comp.company_name}
                    </h3>
                    <span className="text-xs text-sky-700 font-medium bg-sky-50 px-2 py-0.5 rounded-md inline-block mt-1">
                      {comp.industry || 'CNTT / Phần mềm'}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed">{comp.description}</p>
              </div>

              <div className="pt-4 mt-6 border-t border-gray-100 flex items-center justify-between text-xs">
                <span className="font-semibold text-emerald-700 flex items-center gap-1">
                  <Briefcase className="w-3.5 h-3.5 text-emerald-600" />
                  {comp.open_jobs_count || 0} Vị trí đang tuyển
                </span>

                <Link
                  to={`/companies/${comp.id}`}
                  className="px-4 py-1.5 rounded-xl bg-sky-50 hover:bg-sky-600 hover:text-white font-semibold text-sky-700 transition-colors flex items-center gap-1"
                >
                  Xem chi tiết <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CompanyDirectoryPage;
