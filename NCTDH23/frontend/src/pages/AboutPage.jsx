import React from 'react';
import { GraduationCap, Target, ShieldCheck, Users, HeartHandshake, Sparkles } from 'lucide-react';

const AboutPage = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-100 text-sky-800 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-sky-600" /> Về EduJob Vietnam (NCTDH23)
        </div>
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
          Nền Tảng Kết Nối Tương Lai Cho Sinh Viên
        </h1>
        <p className="text-base text-gray-600 leading-relaxed">
          EduJob được phát triển với mục tiêu tạo ra môi trường tìm kiếm việc làm, cơ hội thực tập công bằng, minh bạch và chuyên nghiệp nhất cho sinh viên Việt Nam.
        </p>
      </div>

      {/* Grid Values */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center">
            <Target className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">Sứ Mệnh</h3>
          <p className="text-xs text-gray-500 leading-relaxed">
            Giúp 100% sinh viên tìm kiếm được cơ hội thực tập và việc làm phù hợp với năng lực ngay từ khi còn ngồi trên ghế nhà trường.
          </p>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">Minh Bạch</h3>
          <p className="text-xs text-gray-500 leading-relaxed">
            Xác thực thông tin tuyển dụng, loại bỏ tin tuyển dụng rác hay lừa đảo, đảm bảo sinh viên tiếp cận môi trường làm việc lành mạnh.
          </p>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">Đồng Hành</h3>
          <p className="text-xs text-gray-500 leading-relaxed">
            Cung cấp công cụ quản lý CV, lưu vết ứng tuyển và nhận phản hồi trực tiếp từ nhà tuyển dụng theo thời gian thực.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
