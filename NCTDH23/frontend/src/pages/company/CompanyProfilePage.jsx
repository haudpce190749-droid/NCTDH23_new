import React, { useState, useEffect } from 'react';
import { Building2, Save, Upload, Globe, Mail, Phone, MapPin } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const CompanyProfilePage = () => {
  const { showToast, refreshUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [companyName, setCompanyName] = useState('');
  const [logo, setLogo] = useState('');
  const [description, setDescription] = useState('');
  const [industry, setIndustry] = useState('');
  const [companySize, setCompanySize] = useState('');
  const [location, setLocation] = useState('');
  const [website, setWebsite] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');

  const fetchCompanyProfile = async () => {
    try {
      const res = await api.get('/companies/dashboard/me');
      const c = res.data.company;
      setCompanyName(c.company_name || '');
      setLogo(c.logo || '');
      setDescription(c.description || '');
      setIndustry(c.industry || '');
      setCompanySize(c.company_size || '');
      setLocation(c.location || '');
      setWebsite(c.website || '');
      setContactEmail(c.contact_email || '');
      setContactPhone(c.contact_phone || '');
    } catch (err) {
      console.error('Lỗi lấy hồ sơ công ty:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanyProfile();
  }, []);

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('logo', file);

    try {
      const res = await api.post('/companies/logo', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setLogo(res.data.logoUrl);
      showToast('Tải logo công ty thành công', 'success');
      refreshUser();
    } catch (err) {
      showToast('Lỗi khi tải logo', 'error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await api.put('/companies/profile', {
        company_name: companyName,
        description,
        industry,
        company_size: companySize,
        location,
        website,
        contact_email: contactEmail,
        contact_phone: contactPhone
      });

      showToast('Cập nhật thông tin công ty thành công!', 'success');
      refreshUser();
    } catch (err) {
      showToast('Lỗi khi cập nhật hồ sơ công ty', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10 space-y-4">
        <div className="bg-white rounded-3xl p-8 border border-gray-100 animate-pulse h-96"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900 flex items-center gap-2">
          <Building2 className="w-6 h-6 text-sky-600" /> Hồ Sơ Doanh Nghiệp
        </h1>
        <p className="text-xs text-gray-500 mt-1">Thông tin công ty sẽ hiển thị công khai trên trang chi tiết tuyển dụng.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6 text-xs">
        {/* Logo Upload */}
        <div className="flex items-center gap-6 pb-6 border-b border-gray-100">
          <div className="w-20 h-20 rounded-2xl bg-gray-50 border border-gray-200 p-2 flex items-center justify-center relative group flex-shrink-0">
            {logo ? (
              <img src={logo} alt={companyName} className="w-full h-full object-contain rounded-xl" />
            ) : (
              <Building2 className="w-10 h-10 text-gray-400" />
            )}
            <label className="absolute inset-0 bg-black/40 rounded-2xl flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
              <Upload className="w-5 h-5" />
              <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
            </label>
          </div>

          <div>
            <h3 className="font-bold text-gray-900 text-sm">Logo Công Ty</h3>
            <p className="text-gray-500 text-[11px] mt-0.5">Khuyến nghị ảnh vuông JPG, PNG, dung lượng tối đa 5MB</p>
            <label className="inline-block mt-2">
              <span className="px-3.5 py-1.5 bg-sky-50 text-sky-700 hover:bg-sky-100 font-bold text-xs rounded-xl cursor-pointer inline-block">
                Đổi Logo
              </span>
              <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
            </label>
          </div>
        </div>

        {/* Company Name & Industry */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-bold text-gray-700 uppercase mb-1">Tên Công Ty *</label>
            <input
              type="text"
              required
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-semibold text-gray-900"
            />
          </div>

          <div>
            <label className="block font-bold text-gray-700 uppercase mb-1">Lĩnh Vực Hoạt Động</label>
            <input
              type="text"
              placeholder="VD: Công nghệ thông tin, Thương mại điện tử..."
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-medium"
            />
          </div>
        </div>

        {/* Company Size & Location */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-bold text-gray-700 uppercase mb-1">Quy Mô Công Ty</label>
            <select
              value={companySize}
              onChange={(e) => setCompanySize(e.target.value)}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-medium"
            >
              <option value="Dưới 50 nhân viên">Dưới 50 nhân viên</option>
              <option value="50-200 nhân viên">50-200 nhân viên</option>
              <option value="500-1000 nhân viên">500-1000 nhân viên</option>
              <option value="1000+ nhân viên">1000+ nhân viên</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-gray-700 uppercase mb-1">Trụ Sở / Địa Chỉ</label>
            <input
              type="text"
              placeholder="VD: Tòa nhà FPT Campus, Cầu Giấy, Hà Nội"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-medium"
            />
          </div>
        </div>

        {/* Website & Contact Email & Phone */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block font-bold text-gray-700 uppercase mb-1">Website Công Ty</label>
            <input
              type="url"
              placeholder="https://..."
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-medium"
            />
          </div>

          <div>
            <label className="block font-bold text-gray-700 uppercase mb-1">Email Tuyển Dụng</label>
            <input
              type="email"
              placeholder="recruitment@company.com"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-medium"
            />
          </div>

          <div>
            <label className="block font-bold text-gray-700 uppercase mb-1">Số Điện Thoại Liên Hệ</label>
            <input
              type="text"
              placeholder="024 1234 5678"
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-medium"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block font-bold text-gray-700 uppercase mb-1">Giới Thiệu Doanh Nghiệp</label>
          <textarea
            rows={5}
            placeholder="Mô tả tầm nhìn, sứ mệnh, môi trường làm việc..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-medium"
          ></textarea>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Đang lưu...' : 'Lưu Hồ Sơ Công Ty'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CompanyProfilePage;
