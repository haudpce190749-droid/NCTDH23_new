import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Users, Search, Filter, Eye, Download, FileText, CheckCircle2, XCircle, Phone, Mail, GraduationCap, X, ChevronRight } from 'lucide-react';
import { ApplicationStatusBadge } from '../../components/StatusBadge';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const CompanyApplicantsPage = () => {
  const [searchParams] = useSearchParams();
  const initialJobId = searchParams.get('jobId') || '';

  const { showToast } = useAuth();
  const [applicants, setApplicants] = useState([]);
  const [jobId, setJobId] = useState(initialJobId);
  const [status, setStatus] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Candidate Profile Modal state
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [candidateProfile, setCandidateProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [statusNotes, setStatusNotes] = useState('');

  const fetchApplicants = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (jobId) params.set('jobId', jobId);
      if (status) params.set('status', status);
      if (searchQuery) params.set('q', searchQuery);

      const res = await api.get(`/companies/applicants?${params.toString()}`);
      setApplicants(res.data.applicants);
    } catch (err) {
      console.error('Lỗi lấy ứng viên:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplicants();
  }, [jobId, status]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchApplicants();
  };

  const handleOpenCandidateModal = async (applicant) => {
    setSelectedCandidate(applicant);
    setStatusNotes(applicant.notes || '');
    setLoadingProfile(true);

    try {
      const res = await api.get(`/students/public-profile/${applicant.student_id}`);
      setCandidateProfile(res.data.profile);
    } catch (err) {
      console.error('Lỗi lấy hồ sơ ứng viên:', err);
    } finally {
      setLoadingProfile(false);
    }
  };

  const handleUpdateStatus = async (newStatus) => {
    if (!selectedCandidate) return;

    try {
      await api.put(`/applications/${selectedCandidate.id}/status`, {
        status: newStatus,
        notes: statusNotes
      });
      showToast('Cập nhật trạng thái ứng tuyển thành công', 'success');

      setSelectedCandidate({ ...selectedCandidate, status: newStatus, notes: statusNotes });
      fetchApplicants();
    } catch (err) {
      showToast('Lỗi khi cập nhật trạng thái', 'error');
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-10 space-y-4">
        <div className="bg-white rounded-3xl p-8 border border-gray-100 animate-pulse h-96"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900 flex items-center gap-2">
          <Users className="w-6 h-6 text-sky-600" /> Quản Lý Hồ Sơ Ứng Viên ({applicants.length})
        </h1>
        <p className="text-xs text-gray-500 mt-1">Sàng lọc, đánh giá hồ sơ và cập nhật tiến độ phỏng vấn tuyển dụng.</p>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-xs flex flex-col md:flex-row gap-4 items-center justify-between">
        <form onSubmit={handleSearchSubmit} className="w-full md:w-auto flex-1 flex items-center gap-2 bg-gray-50 p-2.5 rounded-xl border border-gray-200">
          <Search className="w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm tên ứng viên, vị trí tuyển dụng..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs bg-transparent focus:outline-hidden text-gray-800"
          />
        </form>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-800"
            >
              <option value="">Tất cả trạng thái</option>
              <option value="submitted">Đã nộp</option>
              <option value="reviewing">Đang xem xét</option>
              <option value="shortlisted">Phù hợp / Tiềm năng</option>
              <option value="interview">Mời phỏng vấn</option>
              <option value="accepted">Trúng tuyển</option>
              <option value="rejected">Từ chối</option>
            </select>
          </div>
        </div>
      </div>

      {/* Applicants List */}
      {applicants.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 space-y-3">
          <Users className="w-12 h-12 text-gray-300 mx-auto" />
          <h3 className="text-lg font-bold text-gray-800">Chưa có ứng viên nào</h3>
          <p className="text-xs text-gray-500">Chưa có hồ sơ nào nộp cho vị trí đã chọn hoặc theo bộ lọc hiện tại.</p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-xs overflow-hidden divide-y divide-gray-100">
          {applicants.map((app) => (
            <div key={app.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-gray-50/50 transition-colors">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-700 font-bold flex items-center justify-center text-sm flex-shrink-0">
                  {(app.student_name || 'S')[0]}
                </div>

                <div className="space-y-1">
                  <h3 className="font-bold text-gray-900 text-base">{app.student_name}</h3>
                  <p className="text-xs font-semibold text-sky-700">Ứng tuyển: {app.job_title}</p>
                  <p className="text-xs text-gray-500">
                    {app.university ? `${app.university} (${app.major || ''})` : 'Sinh viên'} • Nộp ngày: {new Date(app.applied_at).toLocaleDateString('vi-VN')}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <ApplicationStatusBadge status={app.status} />

                <button
                  onClick={() => handleOpenCandidateModal(app)}
                  className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5"
                >
                  <Eye className="w-3.5 h-3.5" /> Xem Hồ Sơ & Đánh Giá
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CANDIDATE DETAIL MODAL */}
      {selectedCandidate && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 relative max-h-[90vh] overflow-y-auto shadow-2xl">
            <button
              onClick={() => setSelectedCandidate(null)}
              className="absolute top-5 right-5 p-2 text-gray-400 hover:text-gray-600 rounded-xl hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Candidate Header */}
            <div className="flex items-center gap-4 border-b border-gray-100 pb-4">
              <div className="w-16 h-16 rounded-2xl bg-sky-100 text-sky-700 font-bold text-xl flex items-center justify-center flex-shrink-0">
                {(selectedCandidate.student_name || 'S')[0]}
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-gray-900">{selectedCandidate.student_name}</h3>
                <p className="text-xs font-semibold text-sky-600">Ứng tuyển vị trí: {selectedCandidate.job_title}</p>
                <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
                  <span>SĐT: {selectedCandidate.contact_phone}</span>
                  <span>Email: {selectedCandidate.contact_email}</span>
                </div>
              </div>
            </div>

            {/* CV Download / Preview button */}
            {selectedCandidate.cv_url && (
              <div className="p-4 bg-sky-50 rounded-2xl border border-sky-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="w-6 h-6 text-sky-600" />
                  <div>
                    <span className="font-bold text-gray-800 text-xs block">{selectedCandidate.cv_filename || 'Tệp CV Ứng Tuyển'}</span>
                    <span className="text-[11px] text-gray-500">Bản mềm đính kèm</span>
                  </div>
                </div>
                <a
                  href={selectedCandidate.cv_url}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" /> Xem / Tải CV
                </a>
              </div>
            )}

            {/* Cover Letter */}
            {selectedCandidate.cover_letter && (
              <div className="space-y-1">
                <h4 className="font-bold text-gray-800 text-xs uppercase">Thư Giới Thiệu (Cover Letter)</h4>
                <div className="p-3 bg-gray-50 rounded-xl text-xs text-gray-700 leading-relaxed whitespace-pre-line">
                  {selectedCandidate.cover_letter}
                </div>
              </div>
            )}

            {/* Candidate Details (Education & Skills) */}
            {candidateProfile && (
              <div className="space-y-4 pt-2 border-t border-gray-100 text-xs">
                {/* Education */}
                <div>
                  <h4 className="font-bold text-gray-800 uppercase mb-2">Học Vấn</h4>
                  <p className="text-gray-700 font-semibold">{candidateProfile.university} - {candidateProfile.major}</p>
                  <p className="text-gray-500">Năm tốt nghiệp: {candidateProfile.graduation_year} • GPA: {candidateProfile.gpa || 'N/A'}</p>
                </div>

                {/* Skills */}
                {candidateProfile.skills && candidateProfile.skills.length > 0 && (
                  <div>
                    <h4 className="font-bold text-gray-800 uppercase mb-2">Kỹ Năng</h4>
                    <div className="flex flex-wrap gap-2">
                      {candidateProfile.skills.map((sk) => (
                        <span key={sk.id} className="px-2.5 py-1 bg-gray-100 text-gray-800 rounded-lg font-medium">
                          {sk.skill_name} ({sk.skill_level})
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Pipeline Status Change Actions */}
            <div className="pt-4 border-t border-gray-100 space-y-3">
              <h4 className="font-bold text-gray-800 text-xs uppercase">Cập Nhật Trạng Thái Hồ Sơ</h4>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleUpdateStatus('reviewing')}
                  className="px-3 py-2 bg-purple-50 text-purple-700 hover:bg-purple-100 rounded-xl font-semibold text-xs border border-purple-200"
                >
                  Đang xem xét
                </button>

                <button
                  onClick={() => handleUpdateStatus('shortlisted')}
                  className="px-3 py-2 bg-amber-50 text-amber-700 hover:bg-amber-100 rounded-xl font-semibold text-xs border border-amber-200"
                >
                  Phù hợp / Tiềm năng
                </button>

                <button
                  onClick={() => handleUpdateStatus('interview')}
                  className="px-3 py-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-xl font-semibold text-xs border border-indigo-200"
                >
                  Mời Phỏng Vấn
                </button>

                <button
                  onClick={() => handleUpdateStatus('accepted')}
                  className="px-3 py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-xl font-semibold text-xs border border-emerald-200"
                >
                  Trúng Tuyển
                </button>

                <button
                  onClick={() => handleUpdateStatus('rejected')}
                  className="px-3 py-2 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-xl font-semibold text-xs border border-rose-200"
                >
                  Từ Chối
                </button>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-600 mb-1">Ghi chú nội bộ dành cho ứng viên:</label>
                <input
                  type="text"
                  placeholder="Ghi chú về lịch phỏng vấn hoặc lý do..."
                  value={statusNotes}
                  onChange={(e) => setStatusNotes(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-800"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyApplicantsPage;
