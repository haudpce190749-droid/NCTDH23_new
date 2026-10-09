import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, MapPin, DollarSign, Briefcase, SlidersHorizontal, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';
import JobCard from '../components/JobCard';
import api from '../services/api';
import { VIETNAM_PROVINCES } from '../constants/provinces';

const JobSearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Filter state initialized from URL query params
  const [q, setQ] = useState(searchParams.get('q') || '');
  const [location, setLocation] = useState(searchParams.get('location') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [jobType, setJobType] = useState(searchParams.get('jobType') || '');
  const [experience, setExperience] = useState(searchParams.get('experience') || '');
  const [locationType, setLocationType] = useState(searchParams.get('locationType') || '');
  const [minSalary, setMinSalary] = useState(searchParams.get('minSalary') || '');
  const [sort, setSort] = useState(searchParams.get('sort') || 'newest');
  const [page, setPage] = useState(parseInt(searchParams.get('page') || '1'));

  const [jobs, setJobs] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 10, totalPages: 1 });
  const [options, setOptions] = useState({ categories: [], locations: [], jobTypes: [], experienceLevels: [], locationTypes: [] });
  const [loading, setLoading] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Fetch Filter Metadata options
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const res = await api.get('/jobs/meta/options');
        setOptions(res.data);
      } catch (err) {
        console.error('Lỗi lấy filter options:', err);
      }
    };
    fetchOptions();
  }, []);

  // Fetch Jobs list based on filters
  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (q) params.set('q', q);
      if (location) params.set('location', location);
      if (category) params.set('category', category);
      if (jobType) params.set('jobType', jobType);
      if (experience) params.set('experience', experience);
      if (locationType) params.set('locationType', locationType);
      if (minSalary) params.set('minSalary', minSalary);
      if (sort) params.set('sort', sort);
      params.set('page', page);

      setSearchParams(params);

      const res = await api.get(`/jobs?${params.toString()}`);
      setJobs(res.data.jobs);
      setPagination(res.data.pagination);
    } catch (err) {
      console.error('Lỗi tìm việc:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [location, category, jobType, experience, locationType, minSalary, sort, page]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchJobs();
  };

  const handleResetFilters = () => {
    setQ('');
    setLocation('');
    setCategory('');
    setJobType('');
    setExperience('');
    setLocationType('');
    setMinSalary('');
    setSort('newest');
    setPage(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Header & Search Bar */}
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm mb-8 space-y-4">
        <h1 className="text-2xl font-extrabold text-slate-900">Tìm Kiếm Cơ Hội Việc Làm & Thực Tập</h1>

        <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 flex items-center gap-2.5 px-4 py-3 bg-gray-50 rounded-xl border border-gray-200">
            <Search className="w-5 h-5 text-sky-600 flex-shrink-0" />
            <input
              type="text"
              placeholder="Nhập từ khóa công việc, vị trí hoặc kỹ năng..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="w-full text-sm bg-transparent focus:outline-hidden text-gray-800"
            />
          </div>

          <div className="md:w-64 flex items-center gap-2.5 px-4 py-3 bg-gray-50 rounded-xl border border-gray-200">
            <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0" />
            <select
              value={location}
              onChange={(e) => {
                setLocation(e.target.value);
                setPage(1);
              }}
              className="w-full text-sm bg-transparent focus:outline-hidden text-gray-800 cursor-pointer"
            >
              <option value="">Tất cả địa điểm</option>
              {VIETNAM_PROVINCES.map((prov) => (
                <option key={prov} value={prov}>
                  {prov}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="px-8 py-3 bg-sky-600 hover:bg-sky-700 text-white font-semibold text-sm rounded-xl shadow-md shadow-sky-100 transition-colors flex items-center justify-center gap-2"
          >
            <Search className="w-4 h-4" />
            Tìm Kiếm
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Filters */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <h3 className="font-bold text-gray-900 text-base flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-sky-600" />
                Bộ Lọc Tìm Kiếm
              </h3>
              <button
                onClick={handleResetFilters}
                className="text-xs text-sky-600 hover:text-sky-700 font-semibold flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" /> Đặt lại
              </button>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Ngành Nghề</label>
              <select
                value={category}
                onChange={(e) => { setCategory(e.target.value); setPage(1); }}
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 focus:outline-hidden"
              >
                <option value="">Tất cả ngành nghề</option>
                {options.categories.map((c, i) => (
                  <option key={i} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Job Type Filter */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Hình Thức Làm Việc</label>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                  <input
                    type="radio"
                    name="jobType"
                    checked={jobType === ''}
                    onChange={() => { setJobType(''); setPage(1); }}
                    className="text-sky-600 focus:ring-sky-500"
                  />
                  Tất cả hình thức
                </label>
                {options.jobTypes.map((t, i) => (
                  <label key={i} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                    <input
                      type="radio"
                      name="jobType"
                      checked={jobType === t}
                      onChange={() => { setJobType(t); setPage(1); }}
                      className="text-sky-600 focus:ring-sky-500"
                    />
                    {t}
                  </label>
                ))}
              </div>
            </div>

            {/* Experience Level */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Yêu Cầu Kinh Nghiệm</label>
              <select
                value={experience}
                onChange={(e) => { setExperience(e.target.value); setPage(1); }}
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 focus:outline-hidden"
              >
                <option value="">Tất cả mức kinh nghiệm</option>
                {options.experienceLevels.map((exp, i) => (
                  <option key={i} value={exp}>{exp}</option>
                ))}
              </select>
            </div>

            {/* Location Type (Remote / Hybrid) */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Môi Trường Làm Việc</label>
              <select
                value={locationType}
                onChange={(e) => { setLocationType(e.target.value); setPage(1); }}
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 focus:outline-hidden"
              >
                <option value="">Tất cả môi trường</option>
                {options.locationTypes.map((loc, i) => (
                  <option key={i} value={loc}>{loc}</option>
                ))}
              </select>
            </div>

            {/* Salary filter */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Lương Tối Thiểu (VNĐ)</label>
              <select
                value={minSalary}
                onChange={(e) => { setMinSalary(e.target.value); setPage(1); }}
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 focus:outline-hidden"
              >
                <option value="">Tất cả mức lương</option>
                <option value="3000000">Từ 3 triệu / tháng</option>
                <option value="5000000">Từ 5 triệu / tháng</option>
                <option value="10000000">Từ 10 triệu / tháng</option>
                <option value="15000000">Từ 15 triệu / tháng</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Main Area */}
        <div className="lg:col-span-3 space-y-6">
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-white p-4 rounded-2xl border border-gray-100 gap-4">
            <div className="text-sm text-gray-600">
              Hiển thị <span className="font-bold text-gray-900">{jobs.length}</span> việc làm trong tổng số <span className="font-bold text-gray-900">{pagination.total}</span> vị trí
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-gray-500">Sắp xếp:</span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="p-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-800 focus:outline-hidden"
              >
                <option value="newest">Mới nhất</option>
                <option value="salary_high">Lương cao nhất</option>
                <option value="oldest">Cũ nhất</option>
              </select>
            </div>
          </div>

          {/* Job List */}
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="bg-white rounded-2xl p-6 border border-gray-100 animate-pulse h-36"></div>
              ))}
            </div>
          ) : jobs.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 space-y-3">
              <Briefcase className="w-12 h-12 text-gray-300 mx-auto" />
              <h3 className="text-lg font-bold text-gray-800">Không tìm thấy việc làm phù hợp</h3>
              <p className="text-sm text-gray-500">Thử thay đổi từ khóa hoặc xóa bớt các bộ lọc tìm kiếm</p>
              <button
                onClick={handleResetFilters}
                className="px-4 py-2 bg-sky-50 text-sky-700 rounded-xl font-semibold text-sm hover:bg-sky-100 inline-block mt-2"
              >
                Xóa tất cả bộ lọc
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {jobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-6">
              <button
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className="p-2.5 rounded-xl border border-gray-200 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>

              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-10 h-10 rounded-xl font-semibold text-sm transition-colors ${
                    page === p ? 'bg-sky-600 text-white shadow-md' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {p}
                </button>
              ))}

              <button
                disabled={page === pagination.totalPages}
                onClick={() => setPage(page + 1)}
                className="p-2.5 rounded-xl border border-gray-200 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobSearchPage;
