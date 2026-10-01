import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Building2,
  MapPin,
  DollarSign,
  Briefcase,
  Clock,
  Calendar,
  Bookmark,
  Share2,
  CheckCircle2,
  AlertCircle,
  FileText,
  Upload,
  Globe,
  Users,
  Send,
  X
} from 'lucide-react';
import { JobTypeBadge, WorkLocationBadge } from '../components/StatusBadge';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const JobDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, showToast } = useAuth();

  const [job, setJob] = useState(null);
  const [relatedJobs, setRelatedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isSaved, setIsSaved] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);

  // Application Modal state
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [studentProfile, setStudentProfile] = useState(null);
  const [useExistingCv, setUseExistingCv] = useState(true);
  const [cvFile, setCvFile] = useState(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [submittingApp, setSubmittingApp] = useState(false);

  useEffect(() => {
    const fetchJobDetail = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/jobs/${id}`);
        setJob(res.data.job);
        setRelatedJobs(res.data.relatedJobs);

        if (user && user.role === 'student') {
          // Check saved status
          const savedRes = await api.get(`/saved-jobs/check/${id}`);
          setIsSaved(savedRes.data.isSaved);

          // Check application status
          const appRes = await api.get(`/applications/check-status/${id}`);
          setHasApplied(appRes.data.applied);

          // Fetch student profile for modal default data
          const profRes = await api.get('/students/profile');
          setStudentProfile(profRes.data.profile);
          setContactPhone(profRes.data.profile.phone || '');
          setPortfolioUrl(profRes.data.profile.github_url || '');
        }
      } catch (err) {
        console.error('Lỗi tải chi tiết công việc:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetail();
  }, [id, user]);

  const handleToggleSave = async () => {
    if (!user) {
      showToast('Vui lòng đăng nhập tài khoản sinh viên để lưu việc làm', 'info');
      navigate('/login');
      return;
    }
    if (user.role !== 'student') return;

    try {
      const res = await api.post('/saved-jobs/toggle', { jobId: id });
      setIsSaved(res.data.saved);
      showToast(res.data.message, res.data.saved ? 'success' : 'info');
    } catch (err) {
      showToast('Lỗi khi lưu việc làm', 'error');
    }
  };

  const handleOpenApplyModal = () => {
    if (!user) {
      showToast('Vui lòng đăng nhập tài khoản sinh viên để ứng tuyển', 'info');
      navigate('/login');
      return;
    }

    if (user.role !== 'student') {
      showToast('Chỉ tài khoản sinh viên mới có thể nộp ứng tuyển', 'error');
      return;
    }

    setApplyModalOpen(true);
  };

  const handleSubmitApplication = async (e) => {
    e.preventDefault();

    if (!useExistingCv && !cvFile) {
      showToast('Vui lòng chọn tệp CV mới hoặc dùng CV đã có trong hồ sơ', 'error');
      return;
    }

    try {
      setSubmittingApp(true);
      const formData = new FormData();
      formData.append('job_id', id);
      formData.append('cover_letter', coverLetter);
      formData.append('portfolio_url', portfolioUrl);
      formData.append('contact_phone', contactPhone);
      formData.append('use_existing_cv', useExistingCv ? 'true' : 'false');

      if (!useExistingCv && cvFile) {
        formData.append('cv', cvFile);
      }

      const res = await api.post('/applications/apply', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      showToast(res.data.message, 'success');
      setHasApplied(true);
      setApplyModalOpen(false);
    } catch (err) {
      showToast(err.response?.data?.error || 'Lỗi khi gửi hồ sơ ứng tuyển', 'error');
    } finally {
      setSubmittingApp(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-3xl p-8 border border-gray-100 animate-pulse h-96"></div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center space-y-4">
        <AlertCircle className="w-16 h-16 text-rose-500 mx-auto" />
        <h2 className="text-2xl font-bold text-gray-800">Không Tìm Thấy Công Việc Này</h2>
        <p className="text-gray-500 text-sm">Công việc có thể đã bị đóng hoặc xóa khỏi hệ thống.</p>
        <Link to="/jobs" className="px-6 py-2.5 bg-sky-600 text-white rounded-xl font-semibold text-sm inline-block">
          Quay lại danh sách việc làm
        </Link>
      </div>
    );
  }

  const formatSalary = (min, max, negotiable) => {
    if (negotiable) return 'Lương thỏa thuận';
    if (!min && !max) return 'Lương thỏa thuận';
    const fmt = (n) => (n >= 1000000 ? `${(n / 1000000).toFixed(0)} triệu` : `${n / 1000}k`);
    if (min && max) return `${fmt(min)} - ${fmt(max)} VNĐ / tháng`;
    if (min) return `Từ ${fmt(min)} VNĐ / tháng`;
    return 'Lương thỏa thuận';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="flex items-start gap-5">
            <div className="w-20 h-20 rounded-2xl bg-gray-50 border border-gray-100 p-2 flex items-center justify-center flex-shrink-0 shadow-xs">
              {job.company_logo ? (
                <img src={job.company_logo} alt={job.company_name} className="w-full h-full object-contain rounded-xl" />
              ) : (
                <Building2 className="w-10 h-10 text-gray-400" />
              )}
            </div>

            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <JobTypeBadge type={job.job_type} />
                <WorkLocationBadge type={job.work_location_type} />
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-gray-100 text-gray-700">
                  {job.experience_level}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-tight">{job.title}</h1>

              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 font-medium">
                <Link to={`/companies/${job.company_id}`} className="hover:text-sky-600 flex items-center gap-1 font-semibold text-gray-800">
                  <Building2 className="w-4 h-4 text-gray-400" />
                  {job.company_name}
                </Link>
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  {job.location}
                </span>
                <span className="flex items-center gap-1 text-emerald-700 font-bold">
                  <DollarSign className="w-4 h-4" />
                  {formatSalary(job.salary_min, job.salary_max, job.salary_negotiable)}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap md:flex-col gap-3 min-w-[200px]">
            {hasApplied ? (
              <button disabled className="w-full py-3 px-6 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold text-sm flex items-center justify-center gap-2 cursor-not-allowed">
                <CheckCircle2 className="w-5 h-5" />
                Đã Nộp Ứng Tuyển
              </button>
            ) : (
              <button
                onClick={handleOpenApplyModal}
                className="w-full py-3.5 px-6 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-sm shadow-lg shadow-sky-100 transition-all flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                Ứng Tuyển Ngay
              </button>
            )}

            <button
              onClick={handleToggleSave}
              className={`w-full py-3 px-6 rounded-xl border font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
                isSaved
                  ? 'bg-sky-50 border-sky-200 text-sky-700'
                  : 'bg-white border-gray-200 text-gray-700 hover:border-sky-200 hover:text-sky-600'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
              {isSaved ? 'Đã Lưu Công Việc' : 'Lưu Công Việc'}
            </button>
          </div>
        </div>

        {/* Quick Deadline & Posted Date */}
        <div className="pt-4 border-t border-gray-100 flex flex-wrap items-center justify-between text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-gray-400" />
            Đăng ngày: {new Date(job.created_at).toLocaleDateString('vi-VN')}
          </span>
          {job.deadline && (
            <span className="flex items-center gap-1 text-amber-700 font-semibold">
              <Calendar className="w-3.5 h-3.5" />
              Hạn nộp hồ sơ: {new Date(job.deadline).toLocaleDateString('vi-VN')}
            </span>
          )}
        </div>
      </div>

      {/* Main Grid: Details vs Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 cols: Job Details Breakdown */}
        <div className="lg:col-span-2 space-y-8">
          {/* Description */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-xs space-y-4">
            <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3">Mô Tả Công Việc</h2>
            <div className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">{job.description}</div>
          </div>

          {/* Responsibilities */}
          {job.responsibilities && (
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-xs space-y-4">
              <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3">Trách Nhiệm Công Việc</h2>
              <div className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">{job.responsibilities}</div>
            </div>
          )}

          {/* Requirements */}
          {job.requirements && (
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-xs space-y-4">
              <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3">Yêu Cầu Ứng Viên</h2>
              <div className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">{job.requirements}</div>
            </div>
          )}

          {/* Skills Badges */}
          {job.skills && job.skills.length > 0 && (
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-xs space-y-4">
              <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3">Kỹ Năng Yêu Cầu</h2>
              <div className="flex flex-wrap gap-2">
                {job.skills.map((sk, idx) => (
                  <span key={idx} className="px-3 py-1.5 rounded-xl bg-sky-50 text-sky-800 font-semibold text-xs border border-sky-100">
                    {sk}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Benefits */}
          {job.benefits && (
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-xs space-y-4">
              <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3">Quyền Lợi Đãi Ngộ</h2>
              <div className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">{job.benefits}</div>
            </div>
          )}
        </div>

        {/* Right Sidebar: Company Info */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs space-y-5">
            <h3 className="font-bold text-gray-900 text-base border-b border-gray-100 pb-3">Thông Tin Nhà Tuyển Dụng</h3>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 p-1 flex items-center justify-center">
                {job.company_logo ? (
                  <img src={job.company_logo} alt={job.company_name} className="w-full h-full object-contain rounded-lg" />
                ) : (
                  <Building2 className="w-6 h-6 text-gray-400" />
                )}
              </div>
              <div>
                <h4 className="font-bold text-gray-900 text-sm">{job.company_name}</h4>
                <p className="text-xs text-gray-500">{job.company_industry || 'Công nghệ / Phần mềm'}</p>
              </div>
            </div>

            <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed">{job.company_description}</p>

            <div className="space-y-2.5 text-xs text-gray-600 pt-2 border-t border-gray-100">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-gray-400" />
                <span>Quy mô: {job.company_size || '100+ nhân viên'}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span>{job.company_location || job.location}</span>
              </div>
              {job.company_website && (
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-gray-400" />
                  <a href={job.company_website} target="_blank" rel="noreferrer" className="text-sky-600 hover:underline truncate">
                    {job.company_website}
                  </a>
                </div>
              )}
            </div>

            <Link
              to={`/companies/${job.company_id}`}
              className="w-full py-2.5 text-center bg-gray-50 hover:bg-gray-100 text-gray-700 font-semibold text-xs rounded-xl block transition-colors"
            >
              Xem trang doanh nghiệp
            </Link>
          </div>
        </div>
      </div>

      {/* APPLY MODAL */}
      {applyModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 relative animate-in fade-in zoom-in-95 shadow-2xl">
            <button
              onClick={() => setApplyModalOpen(false)}
              className="absolute top-5 right-5 p-2 text-gray-400 hover:text-gray-600 rounded-xl hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <h3 className="text-xl font-extrabold text-gray-900">Ứng Tuyển Vị Trí</h3>
              <p className="text-sm font-bold text-sky-600">{job.title} - {job.company_name}</p>
            </div>

            <form onSubmit={handleSubmitApplication} className="space-y-5 text-sm">
              {/* CV Selection Options */}
              <div className="space-y-3">
                <label className="block text-xs font-bold text-gray-700 uppercase">Hồ Sơ CV Ứng Tuyển</label>

                {studentProfile?.cv_url ? (
                  <div className="space-y-2">
                    <label className="flex items-center gap-3 p-3.5 rounded-xl border border-sky-200 bg-sky-50/50 cursor-pointer">
                      <input
                        type="radio"
                        name="cvChoice"
                        checked={useExistingCv}
                        onChange={() => setUseExistingCv(true)}
                        className="text-sky-600 focus:ring-sky-500"
                      />
                      <div>
                        <span className="font-semibold text-gray-800 block text-xs">Sử dụng CV trong hồ sơ</span>
                        <span className="text-[11px] text-gray-500 block truncate">{studentProfile.cv_filename}</span>
                      </div>
                    </label>

                    <label className="flex items-center gap-3 p-3.5 rounded-xl border border-gray-200 cursor-pointer">
                      <input
                        type="radio"
                        name="cvChoice"
                        checked={!useExistingCv}
                        onChange={() => setUseExistingCv(false)}
                        className="text-sky-600 focus:ring-sky-500"
                      />
                      <span className="font-semibold text-gray-800 text-xs">Tải lên tệp CV mới (PDF, DOCX)</span>
                    </label>
                  </div>
                ) : (
                  <p className="text-xs text-amber-700 bg-amber-50 p-2.5 rounded-lg">
                    Bạn chưa tải CV lên hồ sơ cá nhân. Vui lòng đính kèm file bên dưới.
                  </p>
                )}

                {(!useExistingCv || !studentProfile?.cv_url) && (
                  <div className="mt-2">
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => setCvFile(e.target.files[0])}
                      className="block w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-sky-50 file:text-sky-700 hover:file:bg-sky-100"
                    />
                  </div>
                )}
              </div>

              {/* Cover Letter */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Thư Giới Thiệu (Cover Letter)</label>
                <textarea
                  rows={4}
                  placeholder="Giới thiệu bản thân ngắn gọn, lý do bạn muốn ứng tuyển vị trí này..."
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-hidden text-xs text-gray-800"
                ></textarea>
              </div>

              {/* Portfolio & Contact Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Số Điện Thoại Liên Hệ</label>
                  <input
                    type="text"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    required
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Link Portfolio / GitHub</label>
                  <input
                    type="url"
                    value={portfolioUrl}
                    onChange={(e) => setPortfolioUrl(e.target.value)}
                    placeholder="https://github.com/..."
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-800"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setApplyModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-gray-200 font-semibold text-xs text-gray-600 hover:bg-gray-50"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={submittingApp}
                  className="px-6 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2 disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  {submittingApp ? 'Đang nộp...' : 'Xác Nhận Nộp Ứng Tuyển'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobDetailPage;
