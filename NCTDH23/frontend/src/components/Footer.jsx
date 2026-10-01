import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Mail, Phone, MapPin, Github, Linkedin, Facebook } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-14 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          {/* Col 1: Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-sky-600 flex items-center justify-center text-white shadow-md">
                <GraduationCap className="w-6 h-6" />
              </div>
              <span className="text-xl font-bold text-white">EduJob</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Nền tảng việc làm và thực tập số 1 dành cho sinh viên Việt Nam. Kết nối tài năng trẻ với các doanh nghiệp và tập đoàn hàng đầu.
            </p>
            <div className="flex items-center space-x-3 pt-2">
              <a href="https://github.com" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-sky-600 transition-colors">
                <Github className="w-4 h-4" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-sky-600 transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-sky-600 transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Dành cho Sinh Viên */}
          <div>
            <h4 className="text-white font-semibold text-base mb-4">Dành Cho Sinh Viên</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/jobs" className="hover:text-sky-400 transition-colors">Tìm cơ hội thực tập</Link>
              </li>
              <li>
                <Link to="/jobs?experience=Sinh+viên+mới+tốt+nghiệp" className="hover:text-sky-400 transition-colors">Việc làm Fresher</Link>
              </li>
              <li>
                <Link to="/student/profile" className="hover:text-sky-400 transition-colors">Tạo & Quản lý CV online</Link>
              </li>
              <li>
                <Link to="/student/applications" className="hover:text-sky-400 transition-colors">Theo dõi ứng tuyển</Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Dành cho Doanh Nghiệp */}
          <div>
            <h4 className="text-white font-semibold text-base mb-4">Dành Cho Nhà Tuyển Dụng</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/company/jobs/create" className="hover:text-sky-400 transition-colors">Đăng tin tuyển dụng</Link>
              </li>
              <li>
                <Link to="/company/applicants" className="hover:text-sky-400 transition-colors">Quản lý hồ sơ ứng viên</Link>
              </li>
              <li>
                <Link to="/companies" className="hover:text-sky-400 transition-colors">Danh bạ doanh nghiệp</Link>
              </li>
              <li>
                <Link to="/register?role=company" className="hover:text-sky-400 transition-colors">Đăng ký tài khoản công ty</Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Liên hệ */}
          <div>
            <h4 className="text-white font-semibold text-base mb-4">Thông Tin Liên Hệ</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-sky-500 mt-0.5 flex-shrink-0" />
                <span>Đại học Bách Khoa Hà Nội, Hai Bà Trưng, Hà Nội</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-sky-500 flex-shrink-0" />
                <span>hotro@edujob.vn</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-sky-500 flex-shrink-0" />
                <span>024 3869 2026</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 EduJob Vietnam - Platform Kết Nối Việc Làm Sinh Viên (NCTDH23). Bảo lưu mọi quyền.</p>
          <div className="flex space-x-6">
            <a href="#" className="hover:text-slate-400">Điều khoản sử dụng</a>
            <a href="#" className="hover:text-slate-400">Chính sách bảo mật</a>
            <a href="#" className="hover:text-slate-400">Sơ đồ trang web</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
