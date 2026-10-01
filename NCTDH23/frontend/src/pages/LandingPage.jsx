import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  MapPin,
  Briefcase,
  Building2,
  Sparkles,
  TrendingUp,
  Award,
  Users,
  CheckCircle,
  ArrowRight,
  Code,
  LineChart,
  Palette,
  Megaphone,
  Headphones,
  ShieldCheck
} from 'lucide-react';
import JobCard from '../components/JobCard';
import api from '../services/api';

const LandingPage = () => {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [featuredCompanies, setFeaturedCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [jobsRes, companiesRes] = await Promise.all([
          api.get('/jobs?limit=6'),
          api.get('/companies')
        ]);
        setFeaturedJobs(jobsRes.data.jobs);
        setFeaturedCompanies(companiesRes.data.companies.slice(0, 5));
      } catch (err) {
        console.error('Lỗi tải trang chủ:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/jobs?q=${encodeURIComponent(keyword)}&location=${encodeURIComponent(location)}`);
  };

  const categories = [
    { title: 'Công nghệ thông tin', count: '120+ Việc làm', icon: Code, color: 'bg-sky-50 text-sky-600', cat: 'Công nghệ thông tin' },
    { title: 'Marketing / Truyền thông', count: '85+ Việc làm', icon: Megaphone, color: 'bg-purple-50 text-purple-600', cat: 'Marketing / Truyền thông' },
    { title: 'Thiết kế UI/UX', count: '45+ Việc làm', icon: Palette, color: 'bg-pink-50 text-pink-600', cat: 'Thiết kế / Đồ họa' },
    { title: 'Phân tích dữ liệu / AI', count: '60+ Việc làm', icon: LineChart, color: 'bg-emerald-50 text-emerald-600', cat: 'Dữ liệu / AI' },
  ];

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-sky-50/60 via-white to-gray-50 pt-12 pb-20 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-100/80 text-sky-800 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-sky-600" />
              Nền Tảng Tuyển Dụng Sinh Viên Số 1 Việt Nam
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-tight">
              Khởi Đầu Sự Nghiệp <br />
              <span className="bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent">
                Cùng Hàng Ngàn Cơ Hội Tốt
              </span>
            </h1>

            <p className="text-lg text-slate-600 font-normal leading-relaxed">
              EduJob kết nối sinh viên và cựu sinh viên với các công ty công nghệ, tập đoàn đa quốc gia. Tìm kiếm cơ hội thực tập, công việc Fresher uy tín dễ dàng hơn bao giờ hết.
            </p>

            {/* Quick Job Search Box */}
            <form onSubmit={handleSearch} className="bg-white p-3 rounded-2xl shadow-xl border border-gray-100 flex flex-col md:flex-row items-center gap-2 max-w-3xl mx-auto">
              <div className="flex-1 flex items-center gap-2.5 px-3 py-2 w-full border-b md:border-b-0 md:border-r border-gray-100">
                <Search className="w-5 h-5 text-sky-600" />
                <input
                  type="text"
                  placeholder="Vị trí tuyển dụng, kỹ năng (ReactJS, Data, Marketing...)"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  className="w-full text-sm text-gray-800 placeholder-gray-400 bg-transparent focus:outline-hidden"
                />
              </div>

              <div className="flex-1 flex items-center gap-2.5 px-3 py-2 w-full">
                <MapPin className="w-5 h-5 text-gray-400" />
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full text-sm text-gray-700 bg-transparent focus:outline-hidden"
                >
                  <option value="">Tất cả địa điểm</option>
                  <option value="Hà Nội">Hà Nội</option>
                  <option value="TP. Hồ Chí Minh">TP. Hồ Chí Minh</option>
                  <option value="Đà Nẵng">Đà Nẵng</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full md:w-auto px-7 py-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-semibold text-sm shadow-md shadow-sky-200 transition-all flex items-center justify-center gap-2"
              >
                <Search className="w-4 h-4" />
                Tìm Việc Ngay
              </button>
            </form>

            {/* Quick Stats */}
            <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto text-left">
              <div className="p-3 bg-white rounded-xl border border-gray-100 shadow-xs">
                <span className="text-2xl font-bold text-sky-600 block">500+</span>
                <span className="text-xs text-gray-500 font-medium">Doanh nghiệp uy tín</span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-gray-100 shadow-xs">
                <span className="text-2xl font-bold text-emerald-600 block">2,500+</span>
                <span className="text-xs text-gray-500 font-medium">Việc làm mới hàng tháng</span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-gray-100 shadow-xs">
                <span className="text-2xl font-bold text-purple-600 block">15,000+</span>
                <span className="text-xs text-gray-500 font-medium">Sinh viên đã nộp CV</span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-gray-100 shadow-xs">
                <span className="text-2xl font-bold text-amber-600 block">95%</span>
                <span className="text-xs text-gray-500 font-medium">Tỷ lệ phản hồi hồ sơ</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Danh Mục Việc Làm Nổi Bật</h2>
            <p className="text-sm text-gray-500 mt-1">Khám phá các ngành nghề đang khát nhân lực trẻ tốt nhất</p>
          </div>
          <Link to="/jobs" className="text-sm font-semibold text-sky-600 hover:text-sky-700 flex items-center gap-1">
            Xem tất cả <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <div
                key={idx}
                onClick={() => navigate(`/jobs?category=${encodeURIComponent(cat.cat)}`)}
                className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs hover:shadow-md hover:border-sky-200 transition-all cursor-pointer group"
              >
                <div className={`w-12 h-12 rounded-xl ${cat.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-gray-900 text-lg group-hover:text-sky-600 transition-colors">{cat.title}</h3>
                <p className="text-xs text-gray-500 mt-1">{cat.count}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Featured Jobs Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Việc Làm Mới Nhất Dành Cho Sinh Viên</h2>
            <p className="text-sm text-gray-500 mt-1">Ứng tuyển trực tiếp chỉ với 1 cú nhấp chuột</p>
          </div>
          <Link to="/jobs" className="text-sm font-semibold text-sky-600 hover:text-sky-700 flex items-center gap-1">
            Tất cả việc làm <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="bg-white rounded-2xl p-6 border border-gray-100 animate-pulse h-48"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}
      </section>

      {/* Featured Companies Section */}
      <section className="bg-sky-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-bold">Doanh Nghiệp Hàng Đầu Đồng Hành</h2>
            <p className="text-sky-200 text-sm mt-2">Các công ty công nghệ và tập đoàn hàng đầu sẵn sàng chào đón sinh viên tài năng</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {featuredCompanies.map((comp) => (
              <Link
                key={comp.id}
                to={`/companies/${comp.id}`}
                className="bg-white/10 backdrop-blur-md border border-white/15 p-5 rounded-2xl text-center hover:bg-white/20 transition-all flex flex-col items-center justify-between group"
              >
                <div className="w-16 h-16 rounded-xl bg-white p-2 flex items-center justify-center shadow-md mb-3 group-hover:scale-105 transition-transform">
                  <Building2 className="w-8 h-8 text-sky-800" />
                </div>
                <h3 className="font-bold text-white text-base truncate w-full">{comp.company_name}</h3>
                <span className="text-xs text-sky-200 mt-1">{comp.open_jobs_count || 3} việc làm đang tuyển</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Platform Benefits */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs">
            <div className="w-12 h-12 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-gray-900 text-lg">Tin Tuyển Dụng Xác Thực</h3>
            <p className="text-sm text-gray-500 mt-2 leading-relaxed">
              100% doanh nghiệp và tin tuyển dụng được kiểm duyệt chặt chẽ, đảm bảo thông tin minh bạch về mức lương và môi trường.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs">
            <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-gray-900 text-lg">Tối Ưu Hóa Hồ Sơ CV</h3>
            <p className="text-sm text-gray-500 mt-2 leading-relaxed">
              Hệ thống tạo CV chuyên nghiệp tích hợp kỹ năng, dự án thực tế giúp hồ sơ sinh viên nổi bật trước mắt nhà tuyển dụng.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-gray-900 text-lg">Theo Dõi Trạng Thái Realtime</h3>
            <p className="text-sm text-gray-500 mt-2 leading-relaxed">
              Cập nhật tức thì tình trạng hồ sơ: Đang xem xét, Mời phỏng vấn, Trúng tuyển minh bạch và tiện lợi.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-sky-600 to-blue-700 rounded-3xl p-8 sm:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl">
          <div className="space-y-3 max-w-xl text-center md:text-left">
            <h2 className="text-3xl font-extrabold">Bạn Đã Sẵn Sàng Bắt Đầu Hành Trình?</h2>
            <p className="text-sky-100 text-sm leading-relaxed">
              Tạo tài khoản sinh viên hoàn toàn miễn phí để khám phá hàng trăm cơ hội việc làm và nâng tầm sự nghiệp ngay hôm nay.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              to="/register?role=student"
              className="px-6 py-3.5 rounded-xl bg-white text-sky-700 font-bold text-sm shadow-md hover:bg-sky-50 transition-colors text-center"
            >
              Đăng Ký Sinh Viên
            </Link>
            <Link
              to="/register?role=company"
              className="px-6 py-3.5 rounded-xl bg-sky-800 text-white font-bold text-sm hover:bg-sky-950 transition-colors text-center border border-sky-400/30"
            >
              Dành Cho Nhà Tuyển Dụng
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
