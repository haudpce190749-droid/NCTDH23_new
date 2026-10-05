import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Briefcase,
  Search,
  Building2,
  Bookmark,
  FileText,
  User,
  LogOut,
  PlusCircle,
  Menu,
  X,
  ChevronDown,
  LayoutDashboard,
  Settings,
  GraduationCap
} from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    setProfileDropdownOpen(false);
    navigate('/');
  };

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Brand Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2.5">
              <img src="/logo.png" alt="EduJob Logo" className="w-10 h-10 object-contain rounded-lg shadow-xs" />
              <div>
                <span className="text-lg font-bold bg-gradient-to-r from-sky-700 to-blue-600 bg-clip-text text-transparent">
                  EduJob
                </span>
                <span className="text-xs block text-gray-500 font-medium -mt-1">Cổng Việc Làm Sinh Viên</span>
              </div>
            </Link>

            {/* Desktop Public Nav Links */}
            <div className="hidden md:flex items-center ml-10 space-x-1">
              <Link
                to="/jobs"
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                  isActive('/jobs') ? 'bg-sky-50 text-sky-700 font-semibold' : 'text-gray-600 hover:text-sky-600 hover:bg-gray-50'
                }`}
              >
                <Search className="w-4 h-4" />
                Tìm Việc Làm
              </Link>

              <Link
                to="/companies"
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                  isActive('/companies') ? 'bg-sky-50 text-sky-700 font-semibold' : 'text-gray-600 hover:text-sky-600 hover:bg-gray-50'
                }`}
              >
                <Building2 className="w-4 h-4" />
                Doanh Nghiệp
              </Link>

              <Link
                to="/about"
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive('/about') ? 'bg-sky-50 text-sky-700 font-semibold' : 'text-gray-600 hover:text-sky-600 hover:bg-gray-50'
                }`}
              >
                Giới Thiệu
              </Link>
            </div>
          </div>

          {/* Desktop Right Side Menu */}
          <div className="hidden md:flex items-center space-x-3">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-3 p-1.5 rounded-xl border border-gray-200 hover:border-sky-200 hover:bg-sky-50/50 transition-all cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-sm overflow-hidden">
                    {user.profile?.avatar || user.profile?.logo ? (
                      <img
                        src={user.profile.avatar || user.profile.logo}
                        alt="Avatar"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      (user.profile?.full_name || user.profile?.company_name || user.email)[0].toUpperCase()
                    )}
                  </div>
                  <div className="text-left pr-1">
                    <span className="text-sm font-semibold text-gray-800 block truncate max-w-[140px]">
                      {user.profile?.full_name || user.profile?.company_name || user.email}
                    </span>
                    <span className="text-[11px] text-sky-600 font-medium block capitalize -mt-0.5">
                      {user.role === 'student' ? 'Sinh viên' : user.role === 'company' ? 'Nhà tuyển dụng' : 'Quản trị viên'}
                    </span>
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>

                {/* Dropdown Menu */}
                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                    {user.role === 'student' && (
                      <>
                        <Link
                          to="/student/dashboard"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-sky-50 hover:text-sky-700 font-medium"
                        >
                          <LayoutDashboard className="w-4 h-4 text-sky-600" />
                          Dashboard Sinh Viên
                        </Link>
                        <Link
                          to="/student/applications"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-sky-50 hover:text-sky-700"
                        >
                          <FileText className="w-4 h-4 text-gray-400" />
                          Việc Làm Đã Nộp
                        </Link>
                        <Link
                          to="/student/saved"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-sky-50 hover:text-sky-700"
                        >
                          <Bookmark className="w-4 h-4 text-gray-400" />
                          Việc Làm Đã Lưu
                        </Link>
                        <Link
                          to="/student/profile"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-sky-50 hover:text-sky-700"
                        >
                          <User className="w-4 h-4 text-gray-400" />
                          Hồ Sơ Cá Nhân
                        </Link>
                      </>
                    )}

                    {user.role === 'company' && (
                      <>
                        <Link
                          to="/company/dashboard"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-sky-50 hover:text-sky-700 font-medium"
                        >
                          <LayoutDashboard className="w-4 h-4 text-sky-600" />
                          Dashboard Doanh Nghiệp
                        </Link>
                        <Link
                          to="/company/jobs/create"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-sm text-emerald-700 hover:bg-emerald-50 font-semibold"
                        >
                          <PlusCircle className="w-4 h-4 text-emerald-600" />
                          Đăng Tin Tuyển Dụng
                        </Link>
                        <Link
                          to="/company/applicants"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-sky-50 hover:text-sky-700"
                        >
                          <User className="w-4 h-4 text-gray-400" />
                          Quản Lý Ứng Viên
                        </Link>
                        <Link
                          to="/company/profile"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-sky-50 hover:text-sky-700"
                        >
                          <Building2 className="w-4 h-4 text-gray-400" />
                          Trang Công Ty
                        </Link>
                      </>
                    )}

                    <div className="border-t border-gray-100 my-1"></div>
                    <Link
                      to={user.role === 'student' ? '/student/settings' : '/company/settings'}
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <Settings className="w-4 h-4 text-gray-400" />
                      Cài Đặt Tài Khoản
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left flex items-center gap-2.5 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 font-medium"
                    >
                      <LogOut className="w-4 h-4" />
                      Đăng Xuất
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-gray-700 hover:text-sky-600 hover:bg-gray-50 transition-colors"
                >
                  Đăng Nhập
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-xl text-sm font-semibold bg-sky-600 hover:bg-sky-700 text-white shadow-md shadow-sky-100 transition-all hover:shadow-lg"
                >
                  Đăng Ký Tài Khoản
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu toggle button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-gray-600 hover:text-sky-600 hover:bg-gray-100 focus:outline-hidden"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-100 px-4 pt-2 pb-6 space-y-3">
          <Link
            to="/jobs"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-gray-700 hover:bg-sky-50 hover:text-sky-700"
          >
            Tìm Việc Làm
          </Link>
          <Link
            to="/companies"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-gray-700 hover:bg-sky-50 hover:text-sky-700"
          >
            Doanh Nghiệp
          </Link>
          <Link
            to="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-gray-700 hover:bg-sky-50 hover:text-sky-700"
          >
            Giới Thiệu Platform
          </Link>

          {user ? (
            <div className="pt-4 border-t border-gray-100 space-y-2">
              <div className="px-3 py-1 font-bold text-sky-800 text-sm">
                Tài khoản ({user.role === 'student' ? 'Sinh viên' : 'Nhà tuyển dụng'}): {user.profile?.full_name || user.profile?.company_name}
              </div>
              {user.role === 'student' ? (
                <>
                  <Link
                    to="/student/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-sky-50"
                  >
                    Dashboard Sinh Viên
                  </Link>
                  <Link
                    to="/student/applications"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-sky-50"
                  >
                    Việc Làm Đã Nộp
                  </Link>
                  <Link
                    to="/student/saved"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-sky-50"
                  >
                    Việc Làm Đã Lưu
                  </Link>
                  <Link
                    to="/student/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-sky-50"
                  >
                    Quản Lý Hồ Sơ & CV
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/company/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-sky-50"
                  >
                    Dashboard Doanh Nghiệp
                  </Link>
                  <Link
                    to="/company/jobs/create"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-lg text-sm text-emerald-700 bg-emerald-50 font-semibold"
                  >
                    + Đăng Tin Tuyển Dụng Mới
                  </Link>
                  <Link
                    to="/company/applicants"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-sky-50"
                  >
                    Quản Lý Hồ Sơ Ứng Viên
                  </Link>
                </>
              )}
              <button
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 rounded-lg text-sm font-semibold text-rose-600 hover:bg-rose-50"
              >
                Đăng Xuất
              </button>
            </div>
          ) : (
            <div className="pt-4 border-t border-gray-100 flex flex-col gap-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-700 bg-gray-100"
              >
                Đăng Nhập
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-sky-600 shadow-md"
              >
                Đăng Ký Tài Khoản Mới
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
