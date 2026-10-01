import React, { useState, useEffect } from 'react';
import {
  User,
  GraduationCap,
  Briefcase,
  Code,
  FolderGit2,
  Plus,
  Trash2,
  Save,
  Upload,
  Link as LinkIcon,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const StudentProfilePage = () => {
  const { showToast, refreshUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [savingPersonal, setSavingPersonal] = useState(false);

  // Form states for Personal Info
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [bio, setBio] = useState('');
  const [university, setUniversity] = useState('');
  const [major, setMajor] = useState('');
  const [graduationYear, setGraduationYear] = useState('');
  const [gpa, setGpa] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');

  // Modal / Form state for Add Education
  const [eduModal, setEduModal] = useState(false);
  const [newEdu, setNewEdu] = useState({ university: '', major: '', graduation_year: '', gpa: '', degree: 'Cử nhân' });

  // Modal / Form state for Add Skill
  const [skillModal, setSkillModal] = useState(false);
  const [newSkill, setNewSkill] = useState({ skill_name: '', skill_level: 'Trung bình' });

  // Modal / Form state for Add Experience
  const [expModal, setExpModal] = useState(false);
  const [newExp, setNewExp] = useState({ company: '', position: '', start_date: '', end_date: '', description: '' });

  // Modal / Form state for Add Project
  const [projModal, setProjModal] = useState(false);
  const [newProj, setNewProj] = useState({ title: '', description: '', technologies: '', project_url: '' });

  const fetchProfile = async () => {
    try {
      const res = await api.get('/students/profile');
      const p = res.data.profile;
      setProfile(p);

      setFullName(p.full_name || '');
      setPhone(p.phone || '');
      setLocation(p.location || '');
      setBio(p.bio || '');
      setUniversity(p.university || '');
      setMajor(p.major || '');
      setGraduationYear(p.graduation_year || '');
      setGpa(p.gpa || '');
      setLinkedinUrl(p.linkedin_url || '');
      setGithubUrl(p.github_url || '');
      setWebsiteUrl(p.website_url || '');
    } catch (err) {
      console.error('Lỗi lấy hồ sơ:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // Save Personal Info
  const handleSavePersonal = async (e) => {
    e.preventDefault();
    setSavingPersonal(true);
    try {
      await api.put('/students/profile', {
        full_name: fullName,
        phone,
        location,
        bio,
        university,
        major,
        graduation_year: graduationYear,
        gpa,
        linkedin_url: linkedinUrl,
        github_url: githubUrl,
        website_url: websiteUrl
      });
      showToast('Cập nhật thông tin cá nhân thành công!', 'success');
      refreshUser();
      fetchProfile();
    } catch (err) {
      showToast('Lỗi khi cập nhật thông tin', 'error');
    } finally {
      setSavingPersonal(false);
    }
  };

  // Avatar Upload
  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('avatar', file);

    try {
      await api.post('/students/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      showToast('Tải ảnh đại diện thành công', 'success');
      fetchProfile();
      refreshUser();
    } catch (err) {
      showToast('Lỗi tải ảnh đại diện', 'error');
    }
  };

  // Add & Delete Education
  const handleAddEducation = async (e) => {
    e.preventDefault();
    try {
      await api.post('/students/education', newEdu);
      showToast('Đã thêm thông tin học vấn mới', 'success');
      setEduModal(false);
      setNewEdu({ university: '', major: '', graduation_year: '', gpa: '', degree: 'Cử nhân' });
      fetchProfile();
    } catch (err) {
      showToast('Lỗi khi thêm học vấn', 'error');
    }
  };

  const handleDeleteEducation = async (id) => {
    try {
      await api.delete(`/students/education/${id}`);
      showToast('Đã xóa thông tin học vấn', 'info');
      fetchProfile();
    } catch (err) {
      showToast('Lỗi xóa học vấn', 'error');
    }
  };

  // Add & Delete Skills
  const handleAddSkill = async (e) => {
    e.preventDefault();
    try {
      await api.post('/students/skills', newSkill);
      showToast('Đã thêm kỹ năng mới', 'success');
      setSkillModal(false);
      setNewSkill({ skill_name: '', skill_level: 'Trung bình' });
      fetchProfile();
    } catch (err) {
      showToast('Lỗi khi thêm kỹ năng', 'error');
    }
  };

  const handleDeleteSkill = async (id) => {
    try {
      await api.delete(`/students/skills/${id}`);
      showToast('Đã xóa kỹ năng', 'info');
      fetchProfile();
    } catch (err) {
      showToast('Lỗi xóa kỹ năng', 'error');
    }
  };

  // Add & Delete Experience
  const handleAddExp = async (e) => {
    e.preventDefault();
    try {
      await api.post('/students/experience', newExp);
      showToast('Đã thêm kinh nghiệm làm việc', 'success');
      setExpModal(false);
      setNewExp({ company: '', position: '', start_date: '', end_date: '', description: '' });
      fetchProfile();
    } catch (err) {
      showToast('Lỗi khi thêm kinh nghiệm', 'error');
    }
  };

  const handleDeleteExp = async (id) => {
    try {
      await api.delete(`/students/experience/${id}`);
      showToast('Đã xóa kinh nghiệm', 'info');
      fetchProfile();
    } catch (err) {
      showToast('Lỗi xóa kinh nghiệm', 'error');
    }
  };

  // Add & Delete Project
  const handleAddProj = async (e) => {
    e.preventDefault();
    try {
      await api.post('/students/projects', newProj);
      showToast('Đã thêm dự án cá nhân', 'success');
      setProjModal(false);
      setNewProj({ title: '', description: '', technologies: '', project_url: '' });
      fetchProfile();
    } catch (err) {
      showToast('Lỗi khi thêm dự án', 'error');
    }
  };

  const handleDeleteProj = async (id) => {
    try {
      await api.delete(`/students/projects/${id}`);
      showToast('Đã xóa dự án', 'info');
      fetchProfile();
    } catch (err) {
      showToast('Lỗi xóa dự án', 'error');
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-10 space-y-6">
        <div className="bg-white rounded-3xl p-8 border border-gray-100 animate-pulse h-96"></div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Header Card with Avatar */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm flex flex-col sm:flex-row items-center gap-6">
        <div className="relative group">
          <div className="w-24 h-24 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-2xl overflow-hidden border-2 border-sky-200">
            {profile?.avatar ? (
              <img src={profile.avatar} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              (profile?.full_name || 'S')[0].toUpperCase()
            )}
          </div>
          <label className="absolute inset-0 bg-black/40 rounded-2xl flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
            <Upload className="w-6 h-6" />
            <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
          </label>
        </div>

        <div className="space-y-1 text-center sm:text-left flex-1">
          <h1 className="text-2xl font-extrabold text-gray-900">{profile?.full_name}</h1>
          <p className="text-xs font-semibold text-sky-600">{profile?.university || 'Chưa cập nhật trường đại học'}</p>
          <p className="text-xs text-gray-500">{profile?.location || 'Hà Nội'}</p>
        </div>
      </div>

      {/* Personal Info Form */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-xs space-y-6">
        <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-2">
          <User className="w-5 h-5 text-sky-600" /> Thông Tin Cá Nhân
        </h2>

        <form onSubmit={handleSavePersonal} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-gray-700 uppercase mb-1">Họ Và Tên</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 uppercase mb-1">Số Điện Thoại</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-gray-700 uppercase mb-1">Tỉnh / Thành Phố</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Hà Nội, TP.HCM..."
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 uppercase mb-1">Trường Đại Học</label>
              <input
                type="text"
                value={university}
                onChange={(e) => setUniversity(e.target.value)}
                placeholder="Đại học Bách Khoa..."
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-bold text-gray-700 uppercase mb-1">Chuyên Ngành</label>
              <input
                type="text"
                value={major}
                onChange={(e) => setMajor(e.target.value)}
                placeholder="Công nghệ thông tin..."
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl"
              />
            </div>
            <div>
              <label className="block font-bold text-gray-700 uppercase mb-1">Năm Tốt Nghiệp Dự Kiến</label>
              <input
                type="number"
                value={graduationYear}
                onChange={(e) => setGraduationYear(e.target.value)}
                placeholder="2025"
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl"
              />
            </div>
            <div>
              <label className="block font-bold text-gray-700 uppercase mb-1">Điểm GPA (Hệ 4.0)</label>
              <input
                type="number"
                step="0.01"
                value={gpa}
                onChange={(e) => setGpa(e.target.value)}
                placeholder="3.65"
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-gray-700 uppercase mb-1">Giới Thiệu Bản Thân (Bio)</label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Mô tả mục tiêu nghề nghiệp, sở thích..."
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl"
            ></textarea>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-gray-700 uppercase mb-1">Link GitHub</label>
              <input
                type="url"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                placeholder="https://github.com/..."
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl"
              />
            </div>
            <div>
              <label className="block font-bold text-gray-700 uppercase mb-1">Link LinkedIn</label>
              <input
                type="url"
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
                placeholder="https://linkedin.com/in/..."
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={savingPersonal}
              className="px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {savingPersonal ? 'Đang lưu...' : 'Lưu Thay Đổi Thông Tin'}
            </button>
          </div>
        </form>
      </div>

      {/* Skills Section */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Code className="w-5 h-5 text-sky-600" /> Kỹ Năng Chuyên Môn ({profile?.skills?.length || 0})
          </h2>
          <button
            onClick={() => setSkillModal(true)}
            className="px-3 py-1.5 bg-sky-50 text-sky-700 font-bold text-xs rounded-xl hover:bg-sky-100 flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" /> Thêm Kỹ Năng
          </button>
        </div>

        <div className="flex flex-wrap gap-2.5">
          {profile?.skills?.map((s) => (
            <div key={s.id} className="flex items-center gap-2 px-3 py-1.5 bg-sky-50 border border-sky-100 rounded-xl text-xs font-semibold text-sky-800">
              <span>{s.skill_name}</span>
              <span className="text-[10px] text-sky-600 bg-white px-1.5 py-0.5 rounded-md">{s.skill_level}</span>
              <button onClick={() => handleDeleteSkill(s.id)} className="text-sky-400 hover:text-rose-600">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Experience Section */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-sky-600" /> Kinh Nghiệm Làm Việc ({profile?.experience?.length || 0})
          </h2>
          <button
            onClick={() => setExpModal(true)}
            className="px-3 py-1.5 bg-sky-50 text-sky-700 font-bold text-xs rounded-xl hover:bg-sky-100 flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" /> Thêm Kinh Nghiệm
          </button>
        </div>

        <div className="space-y-3">
          {profile?.experience?.map((exp) => (
            <div key={exp.id} className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-start justify-between">
              <div>
                <h4 className="font-bold text-gray-900 text-sm">{exp.position}</h4>
                <p className="text-xs font-semibold text-sky-600">{exp.company}</p>
                <p className="text-[11px] text-gray-500 mt-1">{exp.start_date} - {exp.end_date || 'Hiện tại'}</p>
                <p className="text-xs text-gray-700 mt-2">{exp.description}</p>
              </div>
              <button onClick={() => handleDeleteExp(exp.id)} className="text-gray-400 hover:text-rose-600 p-1">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Projects Section */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <FolderGit2 className="w-5 h-5 text-sky-600" /> Dự Án Cá Nhân ({profile?.projects?.length || 0})
          </h2>
          <button
            onClick={() => setProjModal(true)}
            className="px-3 py-1.5 bg-sky-50 text-sky-700 font-bold text-xs rounded-xl hover:bg-sky-100 flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" /> Thêm Dự Án
          </button>
        </div>

        <div className="space-y-3">
          {profile?.projects?.map((proj) => (
            <div key={proj.id} className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-start justify-between">
              <div>
                <h4 className="font-bold text-gray-900 text-sm">{proj.title}</h4>
                <p className="text-xs text-gray-700 mt-1">{proj.description}</p>
                <p className="text-[11px] text-sky-700 font-semibold mt-1">Công nghệ: {proj.technologies}</p>
              </div>
              <button onClick={() => handleDeleteProj(proj.id)} className="text-gray-400 hover:text-rose-600 p-1">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Modals for Adding Skill */}
      {skillModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4">
            <h3 className="font-bold text-base text-gray-900">Thêm Kỹ Năng Mới</h3>
            <form onSubmit={handleAddSkill} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Tên Kỹ Năng</label>
                <input
                  type="text"
                  required
                  placeholder="VD: ReactJS, Python, Figma..."
                  value={newSkill.skill_name}
                  onChange={(e) => setNewSkill({ ...newSkill, skill_name: e.target.value })}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Trình Độ</label>
                <select
                  value={newSkill.skill_level}
                  onChange={(e) => setNewSkill({ ...newSkill, skill_level: e.target.value })}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl"
                >
                  <option value="Cơ bản">Cơ bản</option>
                  <option value="Trung bình">Trung bình</option>
                  <option value="Thành thạo">Thành thạo</option>
                  <option value="Xuất sắc">Xuất sắc</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setSkillModal(false)} className="px-4 py-2 text-gray-600">
                  Hủy
                </button>
                <button type="submit" className="px-5 py-2 bg-sky-600 text-white font-bold rounded-xl">
                  Lưu Kỹ Năng
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal for Adding Experience */}
      {expModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4">
            <h3 className="font-bold text-base text-gray-900">Thêm Kinh Nghiệm Làm Việc</h3>
            <form onSubmit={handleAddExp} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Tên Công Ty / Tổ Chức</label>
                <input
                  type="text"
                  required
                  value={newExp.company}
                  onChange={(e) => setNewExp({ ...newExp, company: e.target.value })}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Vị Trí / Chức Danh</label>
                <input
                  type="text"
                  required
                  value={newExp.position}
                  onChange={(e) => setNewExp({ ...newExp, position: e.target.value })}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Mô Tả Công Việc</label>
                <textarea
                  rows={3}
                  value={newExp.description}
                  onChange={(e) => setNewExp({ ...newExp, description: e.target.value })}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl"
                ></textarea>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setExpModal(false)} className="px-4 py-2 text-gray-600">
                  Hủy
                </button>
                <button type="submit" className="px-5 py-2 bg-sky-600 text-white font-bold rounded-xl">
                  Lưu Kinh Nghiệm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal for Adding Project */}
      {projModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4">
            <h3 className="font-bold text-base text-gray-900">Thêm Dự Án Cá Nhân</h3>
            <form onSubmit={handleAddProj} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Tên Dự Án</label>
                <input
                  type="text"
                  required
                  value={newProj.title}
                  onChange={(e) => setNewProj({ ...newProj, title: e.target.value })}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Công Nghệ Sử Dụng</label>
                <input
                  type="text"
                  placeholder="ReactJS, Node.js, Tailwind..."
                  value={newProj.technologies}
                  onChange={(e) => setNewProj({ ...newProj, technologies: e.target.value })}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Mô Tả Dự Án</label>
                <textarea
                  rows={3}
                  value={newProj.description}
                  onChange={(e) => setNewProj({ ...newProj, description: e.target.value })}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl"
                ></textarea>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setProjModal(false)} className="px-4 py-2 text-gray-600">
                  Hủy
                </button>
                <button type="submit" className="px-5 py-2 bg-sky-600 text-white font-bold rounded-xl">
                  Lưu Dự Án
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentProfilePage;
