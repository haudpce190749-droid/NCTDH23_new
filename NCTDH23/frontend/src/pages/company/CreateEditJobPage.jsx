import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { PlusCircle, Save, ArrowLeft, Plus, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { VIETNAM_PROVINCES } from '../../constants/provinces';

const CreateEditJobPage = () => {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const { showToast } = useAuth();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Công nghệ thông tin');
  const [jobType, setJobType] = useState('Full-time');
  const [experienceLevel, setExperienceLevel] = useState('Thực tập sinh');
  const [workLocationType, setWorkLocationType] = useState('Tại văn phòng');
  const [location, setLocation] = useState('Hà Nội');
  const [salaryMin, setSalaryMin] = useState('');
  const [salaryMax, setSalaryMax] = useState('');
  const [salaryNegotiable, setSalaryNegotiable] = useState(false);
  const [description, setDescription] = useState('');
  const [responsibilities, setResponsibilities] = useState('');
  const [requirements, setRequirements] = useState('');
  const [benefits, setBenefits] = useState('');
  const [deadline, setDeadline] = useState('');
  const [status, setStatus] = useState('published');

  const [skillInput, setSkillInput] = useState('');
  const [skills, setSkills] = useState(['ReactJS', 'Node.js']);

  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isEdit) {
      const fetchJob = async () => {
        try {
          const res = await api.get(`/jobs/${id}`);
          const j = res.data.job;
          setTitle(j.title);
          setCategory(j.category);
          setJobType(j.job_type);
          setExperienceLevel(j.experience_level);
          setWorkLocationType(j.work_location_type || 'Tại văn phòng');
          setLocation(j.location);
          setSalaryMin(j.salary_min || '');
          setSalaryMax(j.salary_max || '');
          setSalaryNegotiable(!!j.salary_negotiable);
          setDescription(j.description);
          setResponsibilities(j.responsibilities || '');
          setRequirements(j.requirements || '');
          setBenefits(j.benefits || '');
          setDeadline(j.deadline || '');
          setStatus(j.status);
          setSkills(j.skills || []);
        } catch (err) {
          showToast('Lỗi tải thông tin công việc', 'error');
        } finally {
          setLoading(false);
        }
      };
      fetchJob();
    }
  }, [id, isEdit]);

  const handleAddSkill = (e) => {
    e.preventDefault();
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setSkills([...skills, skillInput.trim()]);
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skToRemove) => {
    setSkills(skills.filter((s) => s !== skToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const payload = {
      title,
      category,
      jobType,
      experienceLevel,
      workLocationType,
      location,
      salaryMin: salaryMin ? parseInt(salaryMin) : 0,
      salaryMax: salaryMax ? parseInt(salaryMax) : 0,
      salaryNegotiable,
      description,
      responsibilities,
      requirements,
      benefits,
      deadline,
      status,
      skills
    };

    try {
      if (isEdit) {
        await api.put(`/jobs/${id}`, payload);
        showToast('Cập nhật tin tuyển dụng thành công!', 'success');
      } else {
        await api.post('/jobs', payload);
        showToast('Tạo tin tuyển dụng thành công!', 'success');
      }
      navigate('/company/jobs/my-jobs');
    } catch (err) {
      showToast(err.response?.data?.error || 'Lỗi khi đăng tin', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="bg-white rounded-3xl p-8 border border-gray-100 animate-pulse h-96"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <Link to="/company/jobs/my-jobs" className="text-xs font-semibold text-sky-600 hover:underline flex items-center gap-1 mb-2">
            <ArrowLeft className="w-3.5 h-3.5" /> Quay lại danh sách tin
          </Link>
          <h1 className="text-2xl font-extrabold text-gray-900">
            {isEdit ? 'Chỉnh Sửa Tin Tuyển Dụng' : 'Tạo Tin Tuyển Dụng Mới'}
          </h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6 text-xs">
        {/* Title */}
        <div>
          <label className="block font-bold text-gray-700 uppercase mb-1">Tiêu Đề Công Việc *</label>
          <input
            type="text"
            required
            placeholder="VD: Thực Tập Sinh Lập Trình ReactJS / Frontend..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-900"
          />
        </div>

        {/* Category & Job Type & Experience */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block font-bold text-gray-700 uppercase mb-1">Ngành Nghề *</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-medium"
            >
              <option value="Công nghệ thông tin">Công nghệ thông tin</option>
              <option value="Marketing / Truyền thông">Marketing / Truyền thông</option>
              <option value="Thiết kế / Đồ họa">Thiết kế / Đồ họa</option>
              <option value="Dữ liệu / AI">Dữ liệu / AI</option>
              <option value="Tài chính / Ngân hàng">Tài chính / Ngân hàng</option>
              <option value="Kinh doanh / Bán hàng">Kinh doanh / Bán hàng</option>
              <option value="Nhân sự / Hành chính">Nhân sự / Hành chính</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-gray-700 uppercase mb-1">Hình Thức *</label>
            <select
              value={jobType}
              onChange={(e) => setJobType(e.target.value)}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-medium"
            >
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Internship">Internship (Thực tập)</option>
              <option value="Freelance">Freelance</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-gray-700 uppercase mb-1">Mức Kinh Nghiệm *</label>
            <select
              value={experienceLevel}
              onChange={(e) => setExperienceLevel(e.target.value)}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-medium"
            >
              <option value="Thực tập sinh">Thực tập sinh</option>
              <option value="Sinh viên mới tốt nghiệp">Sinh viên mới tốt nghiệp</option>
              <option value="1-2 năm">1-2 năm kinh nghiệm</option>
              <option value="Trên 2 năm">Trên 2 năm</option>
            </select>
          </div>
        </div>

        {/* Location & Work Environment */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-bold text-gray-700 uppercase mb-1">Môi Trường Làm Việc</label>
            <select
              value={workLocationType}
              onChange={(e) => setWorkLocationType(e.target.value)}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-medium"
            >
              <option value="Tại văn phòng">Tại văn phòng</option>
              <option value="Từ xa (Remote)">Từ xa (Remote)</option>
              <option value="Hybrid">Hybrid (Linh hoạt)</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-gray-700 uppercase mb-1">Địa Điểm Làm Việc *</label>
            <input
              type="text"
              required
              list="provinces-list"
              placeholder="VD: Hà Nội, TP.HCM, Đà Nẵng, Cần Thơ..."
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-medium"
            />
            <datalist id="provinces-list">
              {VIETNAM_PROVINCES.map((prov) => (
                <option key={prov} value={prov} />
              ))}
            </datalist>
          </div>
        </div>

        {/* Salary Range */}
        <div className="space-y-2">
          <label className="block font-bold text-gray-700 uppercase">Mức Lương (VNĐ / Tháng)</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="number"
              placeholder="Lương tối thiểu (VNĐ)"
              value={salaryMin}
              onChange={(e) => setSalaryMin(e.target.value)}
              disabled={salaryNegotiable}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-medium disabled:opacity-40"
            />
            <input
              type="number"
              placeholder="Lương tối đa (VNĐ)"
              value={salaryMax}
              onChange={(e) => setSalaryMax(e.target.value)}
              disabled={salaryNegotiable}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-medium disabled:opacity-40"
            />
          </div>
          <label className="flex items-center gap-2 cursor-pointer pt-1">
            <input
              type="checkbox"
              checked={salaryNegotiable}
              onChange={(e) => setSalaryNegotiable(e.target.checked)}
              className="rounded-xs text-sky-600 focus:ring-sky-500"
            />
            <span className="font-semibold text-gray-700">Thỏa thuận (Không công khai số tiền cụ thể)</span>
          </label>
        </div>

        {/* Skills Tag input */}
        <div>
          <label className="block font-bold text-gray-700 uppercase mb-1">Kỹ Năng Bắt Buộc / Ưu Tiên</label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              placeholder="Nhập kỹ năng (ReactJS, SQL...) rồi bấm Thêm"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              className="flex-1 p-2.5 bg-gray-50 border border-gray-200 rounded-xl"
            />
            <button
              onClick={handleAddSkill}
              className="px-4 py-2 bg-sky-600 text-white font-bold rounded-xl flex items-center gap-1"
            >
              <Plus className="w-4 h-4" /> Thêm
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {skills.map((sk, idx) => (
              <span key={idx} className="flex items-center gap-1.5 px-3 py-1 bg-sky-50 text-sky-800 font-semibold rounded-lg border border-sky-100">
                {sk}
                <button type="button" onClick={() => handleRemoveSkill(sk)} className="text-sky-500 hover:text-rose-600">
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block font-bold text-gray-700 uppercase mb-1">Mô Tả Công Việc *</label>
          <textarea
            rows={5}
            required
            placeholder="Nêu tổng quan nội dung công việc..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-medium"
          ></textarea>
        </div>

        {/* Responsibilities */}
        <div>
          <label className="block font-bold text-gray-700 uppercase mb-1">Trách Nhiệm Công Việc</label>
          <textarea
            rows={4}
            placeholder="Các nhiệm vụ hàng ngày của ứng viên..."
            value={responsibilities}
            onChange={(e) => setResponsibilities(e.target.value)}
            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-medium"
          ></textarea>
        </div>

        {/* Requirements */}
        <div>
          <label className="block font-bold text-gray-700 uppercase mb-1">Yêu Cầu Ứng Viên</label>
          <textarea
            rows={4}
            placeholder="Yêu cầu về bằng cấp, kinh nghiệm, thái độ..."
            value={requirements}
            onChange={(e) => setRequirements(e.target.value)}
            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-medium"
          ></textarea>
        </div>

        {/* Benefits */}
        <div>
          <label className="block font-bold text-gray-700 uppercase mb-1">Quyền Lợi Đãi Ngộ</label>
          <textarea
            rows={3}
            placeholder="Chế độ bảo hiểm, thưởng, trợ cấp..."
            value={benefits}
            onChange={(e) => setBenefits(e.target.value)}
            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-medium"
          ></textarea>
        </div>

        {/* Deadline & Status */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-bold text-gray-700 uppercase mb-1">Hạn Nộp Hồ Sơ</label>
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-medium text-gray-800"
            />
          </div>

          <div>
            <label className="block font-bold text-gray-700 uppercase mb-1">Trạng Thái Bài Đăng</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-medium"
            >
              <option value="published">Xuất bản ngay (Công khai)</option>
              <option value="draft">Bản nháp (Ẩn)</option>
              <option value="closed">Đóng tuyển dụng</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
          <Link to="/company/jobs/my-jobs" className="px-5 py-3 rounded-xl border border-gray-200 font-semibold text-gray-600">
            Hủy bỏ
          </Link>

          <button
            type="submit"
            disabled={submitting}
            className="px-8 py-3 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl shadow-md flex items-center gap-2 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {submitting ? 'Đang lưu...' : isEdit ? 'Cập Nhật Tin' : 'Đăng Tin Tuyển Dụng'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateEditJobPage;
